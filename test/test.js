//setup test enviroment
require('dotenv').config({
    path: "test/.env"
});

const chai = require('chai');
chai.use(require('chai-as-promised'));
const expect = chai.expect;
const proxyquire = require('proxyquire').noCallThru();
const fake = require('sinon').fake;

const fs = require('fs');

describe('eventhandler', () => {

    let event;
    beforeEach(() => {
        event = getEventData('/s3EventData.json');
    });

    it('succeed if s3 head request response with related metadata in header', async () => {
        let s3HeadObjectFake = fake.resolves(withMetadata());
        let snsPublishFake = fake.resolves("success");

        let underTest = proxyquire('../index.js', {
            './s3Api': {
                headObject: s3HeadObjectFake
            },
            './snsApi': {
                publish: snsPublishFake
            }
        });

        await underTest.handler(event);

        let [s3HeadParam] = s3HeadObjectFake.firstCall.args;
        expectS3Bucket(s3HeadParam);
        expectS3Key(s3HeadParam);

        let [snsPublishParam] = snsPublishFake.firstCall.args;
        expect(snsPublishParam).to.have.all.keys('TopicArn', 'Message', 'MessageAttributes');
        expectSNSTopicArn(snsPublishParam);
        expectSNSMessage(snsPublishParam);

        let messageAttributes = snsPublishParam.MessageAttributes;
        expect(messageAttributes).to.have.all.keys('api-key-id', 'bucket', 'key', 'pid', 'transcribe-provider');
        expectStringMessageAttribute(messageAttributes['api-key-id'], 'another_api_key');
        expectStringMessageAttribute(messageAttributes.bucket, 's2t-base-s2tbucket-19xbw73dypb0s');
        expectStringMessageAttribute(messageAttributes.key, 'gcp/not-transcoded/sugr1km8s6/f423fbfb-6381-11e8-a23f-c7cbebde15f2.ogg');
        expectStringMessageAttribute(messageAttributes.pid, 'another_pid');
        expectStringMessageAttribute(messageAttributes['transcribe-provider'], 'aws');
    });

    it('fail if s3 head request response without metadata in header', async () => {

        let s3HeadObjectFake = fake.resolves(withoutMetadata());
        let snsPublishFake = fake.resolves("success");
        let underTest = proxyquire('../index.js', {
            './s3Api': {
                headObject: s3HeadObjectFake
            },
            './snsApi': {
                publish: snsPublishFake
            }
        });

        return expect(underTest.handler(event)).be.rejected;
    });

    it('fail if s3 head request response with unrelated metadata in header', async () => {

        let s3HeadObjectFake = fake.resolves(withUnrelatedMetadata());
        let snsPublishFake = fake.resolves("success");
        let underTest = proxyquire('../index.js', {
            './s3Api': {
                headObject: s3HeadObjectFake
            },
            './snsApi': {
                publish: snsPublishFake
            }
        });

        return expect(underTest.handler(event)).be.rejected;
    });



    it('fail if s3 call fails', async () => {
        let s3HeadObjectFake = fake.rejects("reason");
        let snsPublishFake = fake.resolves("success");
        let underTest = proxyquire('../index.js', {
            './s3Api': {
                headObject: s3HeadObjectFake
            },
            './snsApi': {
                publish: snsPublishFake
            }
        });

        return expect(underTest.handler(event)).be.rejected;
    });


    it('fail if sns call fails', async () => {
        let s3HeadObjectFake = fake.resolves(withoutMetadata());
        let snsPublishFake = fake.rejects("reason");
        let underTest = proxyquire('../index.js', {
            './s3Api': {
                headObject: s3HeadObjectFake
            },
            './snsApi': {
                publish: snsPublishFake
            }
        });
        return expect(underTest.handler(event)).be.rejected;

    });


    function withoutMetadata() {
        return {
            AcceptRanges: "bytes",
            ContentLength: 3191,
            ContentType: "image/jpeg",
            ETag: "\"6805f2cfc46c0f04559748bb039d69ae\"",
            LastModified: '',
        }
    }

    function withUnrelatedMetadata() {
        return Object.assign({
            Metadata: {
                "other-stuff": "some-stuff"
            }
        }, withoutMetadata());
    }

    function withMetadata() {
        return Object.assign({
            Metadata: {
                "api-key-id": "another_api_key",
                "pid": "another_pid",
                "transcribe-provider": "aws"
            }
        }, withoutMetadata());
    }


    function expectS3Bucket(param, {expectedBucket = 's2t-base-s2tbucket-19xbw73dypb0s'} = {}) {
        expect(param.Bucket).to.equal(expectedBucket);
    }

    function expectS3Key(param, {expectedKey = 'gcp/not-transcoded/sugr1km8s6/f423fbfb-6381-11e8-a23f-c7cbebde15f2.ogg'} = {}) {
        expect(param.Key).to.equal(expectedKey);
    }

    function expectSNSTopicArn(param, {expectedArn = 'given:arn:from:env'} = {}) {
        expect(param.TopicArn).to.equal(expectedArn);
    }

    function expectSNSMessage(param, {expectedMessage = 'placeholder'} = {}) {
        expect(param.Message).to.equal(expectedMessage);
    }

    function expectStringMessageAttribute(messageAttribute, value) {
        expect(messageAttribute).to.include({
            DataType: 'String',
            StringValue: value
        });
    }

    function getEventData(file) {
        return JSON.parse(fs.readFileSync(`test/${file}`, 'utf8'));
    }
});