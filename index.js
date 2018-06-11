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

    console.log(key.split("/not-transcoded/")[1]);

    let getSuffixPathPart = (key)=>{
        let suffix = key.split("/not-transcoded/")[1];
        let pathPart = suffix.split('/');
        if(pathPart.length !== 2){
            throw "path error"
        }
        return pathPart;
    };

    let fbFn = {
        processApiKeyIdFrom: (key) => getSuffixPathPart(key)[0],
        processPidFrom: (key) =>getSuffixPathPart(key)[1].split(".")[0],
        processProviderFrom: (key) => key.split("/")[0],
    };

    let {
        Metadata: {
            "api-key-id": apiKeyId = fbFn.processApiKeyIdFrom(key),
            pid: pid = fbFn.processPidFrom(key),
            "transcribe-provider": provider = fbFn.processProviderFrom(key)
        } = {}
    } = await s3Api.headObject({
        Bucket: bucketName,
        Key: key
    });

    console.log(`Collected Metadata: ApiKeyId: ${apiKeyId} \
    ProcessId: ${pid} \ 
    transcribe-provider: ${provider}
    `);

    if(!apiKeyId || !pid || !provider){
        console.error("Mandatory fields not set");
        throw "Mandatory fields not set";
    }

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