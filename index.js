const test = process.env['MODE'] === 'test';
console.log(process.env['MODE']);
let s3Api = test ? require('./test/s3ApiMock.js') : require('./s3Api.js');

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

    // s3.object.key
    return await s3Api.headObject({
        Bucket: bucketName,
        Key: key
    });
};
