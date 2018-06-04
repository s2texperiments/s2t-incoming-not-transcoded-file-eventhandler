const expect = require('chai').expect;

let expectedParams = {};

module.exports = {
    expectedPublishParams: (_) => expectedParams = _,
    reset: () => {
        expectedParams = {};
    },
    publish: async (params) => {
        expect(params).to.deep.equal(expectedParams);
        console.log(`expected head params: ${JSON.stringify(expectedParams)}`);
        return new Promise((resolve, rejected) => resolve());
    }
};