// const AWS = require('aws-sdk');
// const s3 = new AWS.S3();
// const headObject = async (params) =>
//     new Promise((resolve, rejected) =>
//         s3.headObject(params, (err, data) =>
//             err ? rejected(err) : resolve(data)));


exports.handler = async (event) => {

    console.log('test');
    // let s3Event = event.Records[0].s3;
    //
    //
    //
    //
    // headObject({
    //         Bucket: srcBucket,
    //         Key: srcKey
    //     }
    // );

    /*
 data = {
  AcceptRanges: "bytes",
  ContentLength: 3191,
  ContentType: "image/jpeg",
  ETag: "\"6805f2cfc46c0f04559748bb039d69ae\"",
  LastModified: <Date Representation>,
  Metadata: {
  },
  VersionId: "null"
 }
 */

    //return event.Records.s3.object.
};
