let s3Api = require('./s3Api.js');
let snsApi = require('./snsApi.js');

const TOPIC_ARN = process.env['TOPIC_ARN'];
const MANDATORY_META_DATA = (process.env['MANDATORY_META_DATA'] || '').split(',').map(s => s.trim());

exports.handler = async (event) => {

    let {
        Records: [{
            s3: {
                bucket: {name: bucket},
                object: {key}
            }
        }]
    } = event;

    console.log(`Incoming file: ${bucket}/${key}`);
    let base = [{bucket}, {key}];

    let {
        Metadata = {}
    } = await s3Api.headObject({
        Bucket: bucket,
        Key: key
    });

    console.log(`Collected Metadata: ${JSON.stringify(Metadata)}`);

    let allMeta = [...base,
        ...Object.entries(Metadata).map(e => Object.assign({[e[0]]: e[1]}))
    ];

    let missingMandatoryFields = MANDATORY_META_DATA.filter(m => !allMeta.map(e=>Object.keys(e)[0]).includes(m));
    if(missingMandatoryFields.length>0){
        throw `missing mandatory fields: ${missingMandatoryFields}`;
    }

    let result = allMeta.reduce((acc, cur) => {
        let [key, StringValue] = Object.entries(cur)[0];
        return Object.assign(acc, {
            [key]: {
                DataType: 'String',
                StringValue
            }
        });
    }, {});


    //todo: mandatory fields
    // if (!apiKeyId || !pid || !provider) {
    //     console.error("Mandatory fields not set");
    //     throw "Mandatory fields not set";
    // }

    console.log(`Send to ${TOPIC_ARN}`);
    console.log(result);

    return snsApi.publish({
        Message: 'placeholder',
        MessageAttributes: result,
        TopicArn: TOPIC_ARN
    });
};