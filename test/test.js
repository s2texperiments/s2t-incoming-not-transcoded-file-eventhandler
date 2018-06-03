//setup test enviroment
require('dotenv').config({
    path: "test/.env"
});

const expect = require('chai').expect;

const fs = require('fs');
const event = JSON.parse(fs.readFileSync('test/s3EventData.json', 'utf8'));

describe('eventhandler', () => {

    let s3ApiMock;
    beforeEach(() => {
        s3ApiMock = require('./s3ApiMock');
        s3ApiMock.reset();
    });
    //
    // it('collect head request without meta data', async () => {
    //     s3ApiMock.expectedHeadObjectParams({
    //         Bucket: "s2t-base-s2tbucket-19xbw73dypb0s",
    //         Key: "gcp/not-transcoded/sugr1km8s6/f423fbfb-6381-11e8-a23f-c7cbebde15f2.ogg"
    //     });
    //
    //     s3ApiMock.givenResponseHeadObject({
    //         AcceptRanges: "bytes",
    //         ContentLength: 3191,
    //         ContentType: "image/jpeg",
    //         ETag: "\"6805f2cfc46c0f04559748bb039d69ae\"",
    //         LastModified: '',
    //         Metadata: {},
    //     });
    //
    //     let underTest = require('../index.js');
    //     let snsMessage = await underTest.handler(event);
    //
    //     expect(snsMessage).to.deep.equal({
    //         bucket: "s2t-base-s2tbucket-19xbw73dypb0s",
    //         key: "gcp/not-transcoded/sugr1km8s6/f423fbfb-6381-11e8-a23f-c7cbebde15f2.ogg",
    //         "transcribe-provider": "gcp",
    //         pid: "f423fbfb-6381-11e8-a23f-c7cbebde15f2",
    //         "api-key-id": "sugr1km8s6"
    //     });
    // });
    //
    //
    // it('delegate collected meta data', async () => {
    //
    //     s3ApiMock.expectedHeadObjectParams({
    //         Bucket: "s2t-base-s2tbucket-19xbw73dypb0s",
    //         Key: "gcp/not-transcoded/sugr1km8s6/f423fbfb-6381-11e8-a23f-c7cbebde15f2.ogg"
    //     });
    //
    //     s3ApiMock.givenResponseHeadObject({
    //         AcceptRanges: "bytes",
    //         ContentLength: 3191,
    //         ContentType: "image/jpeg",
    //         ETag: "\"6805f2cfc46c0f04559748bb039d69ae\"",
    //         LastModified: '',
    //         Metadata: {
    //             "api-key-id": "sugr1km8s6",
    //             "pid": "f423fbfb-6381-11e8-a23f-c7cbebde15f2",
    //             "transcribe-provider": "gcp"
    //         },
    //     });
    //
    //     let underTest = require('../index.js');
    //     let snsMessage = await underTest.handler(event);
    //     expect(snsMessage).to.deep.equal({
    //         bucket: "s2t-base-s2tbucket-19xbw73dypb0s",
    //         key: "gcp/not-transcoded/sugr1km8s6/f423fbfb-6381-11e8-a23f-c7cbebde15f2.ogg",
    //         "transcribe-provider": "gcp",
    //         pid: "f423fbfb-6381-11e8-a23f-c7cbebde15f2",
    //         "api-key-id": "sugr1km8s6"
    //     });
    // });
});