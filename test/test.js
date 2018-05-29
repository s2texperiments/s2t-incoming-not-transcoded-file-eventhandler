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
        s3ApiMock.expectedParams({
            abc: "asf"
        });
        let underTest = require('../index.js');
        await underTest.handler(event);
    });


    it('delegate collected meta data', async () => {
        let underTest = require('../index.js');
        await underTest.handler(event);
    });
});