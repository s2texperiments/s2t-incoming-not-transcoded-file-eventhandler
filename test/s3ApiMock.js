const expect = require('chai').expect;

let expectedParams = {};

module.exports = {
    expectedHeadObjectParams: (_) => expectedParams = _,
    reset: () => {
        expectedParams = {};
    },
    headObject: async (params) => {
        expect(params).to.deep.equal(expectedParams);
        console.log(`expected head params: ${JSON.stringify(expectedParams)}`);
        return new Promise((resolve, rejected) =>
            resolve({
                AcceptRanges: "bytes",
                ContentLength: 3191,
                ContentType: "image/jpeg",
                ETag: "\"6805f2cfc46c0f04559748bb039d69ae\"",
                LastModified: '',
                Metadata: {},
                VersionId: "null"
            }))
    }
};