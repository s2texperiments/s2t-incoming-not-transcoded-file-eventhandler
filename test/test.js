//setup test enviroment
require('dotenv').config({
    path: "test/.env"
});

const expect = require('chai').expect;
const proxyquire = require('proxyquire').noCallThru();
const fake = require('sinon').fake;

const fs = require('fs');
const event = JSON.parse(fs.readFileSync('test/s3EventData.json', 'utf8'));

describe('eventhandler', () => {

    it('collect head request without meta data', async () => {

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

        await underTest.handler(event);

        let [s3HeadParam] = s3HeadObjectFake.firstCall.args;
        expectS3Bucket(s3HeadParam);
        expectS3Key(s3HeadParam);

        let [snsPublishParam] = snsPublishFake.firstCall.args;
        expect(snsPublishParam).to.have.all.keys('TopicArn', 'Message', 'MessageAttributes');
        expectSNSTopicArn(snsPublishParam);
        expectSNSMessage(snsPublishParam);

        let messageAttributes = snsPublishParam.MessageAttributes;
        expect(messageAttributes).to.have.all.keys('api-key-id', 'bucket', 'key','pid','transcribe-provider');
        expectStringMessageAttribute(messageAttributes['api-key-id'],'sugr1km8s6');
        expectStringMessageAttribute(messageAttributes.bucket,'s2t-base-s2tbucket-19xbw73dypb0s');
        expectStringMessageAttribute(messageAttributes.key,'gcp/not-transcoded/sugr1km8s6/f423fbfb-6381-11e8-a23f-c7cbebde15f2.ogg');
        expectStringMessageAttribute(messageAttributes.pid,'f423fbfb-6381-11e8-a23f-c7cbebde15f2');
        expectStringMessageAttribute(messageAttributes['transcribe-provider'],'gcp');

    });

    it('file without ending', async () => {

    });

    it('file without api key id prefix', async () => {

    });

    it('fail collect', async () => {

    });


    it('fail send', async () => {

    });

    it('delegate collected meta data', async () => {
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
        expect(messageAttributes).to.have.all.keys('api-key-id', 'bucket', 'key','pid','transcribe-provider');
        expectStringMessageAttribute(messageAttributes['api-key-id'],'another_api_key');
        expectStringMessageAttribute(messageAttributes.bucket,'s2t-base-s2tbucket-19xbw73dypb0s');
        expectStringMessageAttribute(messageAttributes.key,'gcp/not-transcoded/sugr1km8s6/f423fbfb-6381-11e8-a23f-c7cbebde15f2.ogg');
        expectStringMessageAttribute(messageAttributes.pid,'another_pid');
        expectStringMessageAttribute(messageAttributes['transcribe-provider'],'aws');
    });


    function withoutMetadata() {
        return {
            AcceptRanges: "bytes",
            ContentLength: 3191,
            ContentType: "image/jpeg",
            ETag: "\"6805f2cfc46c0f04559748bb039d69ae\"",
            LastModified: '',
            //todo remove metadata
            Metadata: {}
        }
    }

    function withMetadata() {
        //todo change order after remove metadata from withoutmetadata
        return Object.assign({}, withoutMetadata(), {
            Metadata: {
                "api-key-id": "another_api_key",
                "pid": "another_pid",
                "transcribe-provider": "aws"
            }
        });
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

    let defaultExpectedSNSMessageAttributes = {
        "api-key-id": {
            DataType: "String",
            StringValue: "sugr1km8s6"
        },
        bucket: {
            DataType: "String",
            StringValue: "s2t-base-s2tbucket-19xbw73dypb0s"
        },
        key: {
            DataType: "String",
            StringValue: "gcp/not-transcoded/sugr1km8s6/f423fbfb-6381-11e8-a23f-c7cbebde15f2.ogg"
        },
        pid: {
            DataType: "String",
            StringValue: "f423fbfb-6381-11e8-a23f-c7cbebde15f2"
        },
        "transcribe-provider": {
            DataType: "String",
            StringValue: "gcp"
        }
    };

    function expectSNSMessage(param, {expectedMessage = 'placeholder'} = {}) {
        expect(param.Message).to.equal(expectedMessage);
    }

    function expectStringMessageAttribute(messageAttribute, value) {

        expect(messageAttribute).to.include({
            DataType: 'String',
            StringValue: value
        });

    }

});