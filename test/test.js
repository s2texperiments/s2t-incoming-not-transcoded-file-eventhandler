//setup test enviroment
require('dotenv').config({
    path: "test/.env"
});
const fs = require('fs');
const event = JSON.parse(fs.readFileSync('test/s3EventData.json', 'utf8'));

describe('eventhandler', () => {

    let s3ApiMock;
    beforeEach(() => {
        s3ApiMock = require('./s3ApiMock');
        s3ApiMock.reset();
    });

    it('collect head request without meta data', async () => {
        s3ApiMock.expectedHeadObjectParams({
            Bucket: "s2t-base-s2tbucket-19xbw73dypb0s",
            Key: "gcp/not-transcoded/sugr1km8s6/f423fbfb-6381-11e8-a23f-c7cbebde15f2.ogg"
        });
        let underTest = require('../index.js');
        await underTest.handler(event);
    });

    //
    // it('delegate collected meta data', async () => {
    //     let underTest = require('../index.js');
    //     await underTest.handler(event);
    // });
});