let s3Api = require('./s3Api.js');
let snsApi = require('./snsApi.js');

exports.handler = async (event) => {

    let {
        Records: [{
            s3: {
                bucket: {name: Bucket},
                object: {key: Key}
            }
        }]
    } = event;

    console.log(`Incoming file: ${Bucket}/${Key}`);

    let {
        Metadata: {
            "api-key-id": apiKeyId,
            pid,
            "transcribe-provider": provider,
        } = {}
    } = await s3Api.headObject({
        Bucket,
        Key
    });

    console.log(`Collected Metadata: ApiKeyId: ${apiKeyId} \
    ProcessId: ${pid} \ 
    transcribe-provider: ${provider}
    `);

    if (!apiKeyId || !pid || !provider) {
        console.error("Mandatory fields not set");
        throw "Mandatory fields not set";
    }

    console.log(`Send to ${process.env['TOPIC_ARN']}`);

    return snsApi.publish({
        Message: 'placeholder',
        MessageAttributes: {
            bucket: {
                DataType: 'String',
                StringValue: Bucket
            },
            key: {
                DataType: 'String',
                StringValue: Key
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