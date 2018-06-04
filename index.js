const test = process.env['MODE'] === 'test';
let s3Api = test ? require('./test/s3ApiMock.js') : require('./s3Api.js');
let snsApi = test ? require('./test/snsApiMock.js') : require('./snsApi.js');

exports.handler = async (event) => {

    let {
        Records: [{
            s3: {
                bucket: {
                    name: bucketName
                },
                object: {
                    key: key
                }
            }
        }]
    } = event;

    let fbFn = {
        processApiKeyIdFrom: (key) => key.split("/")[2],
        processPidFrom: (key) => key.split("/").pop().split(".")[0],
        processProviderFrom: (key) => key.split("/")[0],
    };

    let {
        Metadata: {
            "api-key-id": apiKeyId = fbFn.processApiKeyIdFrom(key),
            pid: pid = fbFn.processPidFrom(key),
            "transcribe-provider": provider = fbFn.processProviderFrom(key)
        }
    } = await s3Api.headObject({
        Bucket: bucketName,
        Key: key
    });

    await snsApi.publish({
        Message: 'placeholder',
        MessageAttributes: {
            bucket: {
                DataType: 'String',
                StringValue: bucketName
            },
            key: {
                DataType: 'String',
                StringValue: key
            },
            "transcribe-provider": {
                DataType: 'String',
                StringValue: provider
            },
            pid: {
                DataType: 'String',
                StringValue: pid
            },
            "api-key-id": {
                DataType: 'String',
                StringValue: apiKeyId
            },
        },
        TopicArn: process.env['TOPIC_ARN']
    });

    return {
        bucket: bucketName,
        key: key,
        "transcribe-provider": provider,
        pid: pid,
        "api-key-id": apiKeyId
    }
};