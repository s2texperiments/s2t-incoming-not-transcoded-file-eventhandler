let s3Api = require('./s3Api.js');
let snsApi = require('./snsApi.js');

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

    console.log(`Incoming file: ${bucketName}/${key}`);

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

    console.log(`Collected Metadata: ApiKeyId: ${apiKeyId} \
    ProcessId: ${pid} \ 
    transcribe-provider: ${provider}
    `);

    console.log(`Send to ${process.env['TOPIC_ARN']}`);

    return snsApi.publish({
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
};