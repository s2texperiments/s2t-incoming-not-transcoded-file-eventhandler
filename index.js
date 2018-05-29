const test = process.env['MODE'] === 'test';
let s3Api = test ? require('./test/s3ApiMock.js') : require('./s3Api.js');

exports.handler = async (event) => {
    console.log(await s3Api.headObject());

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

    /* todo: move to mock object
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
