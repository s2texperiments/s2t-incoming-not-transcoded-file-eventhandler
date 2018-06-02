const expect = require('chai').expect;

let expectedParams = {};
let givenResponseHeadObject = {};

module.exports = {
    expectedHeadObjectParams: (_) => expectedParams = _,
    givenResponseHeadObject: (_) => givenResponseHeadObject = _,
    reset: () => {
        expectedParams = {};
        givenResponseHeadObject = {};
    },
    headObject: async (params) => {
        expect(params).to.deep.equal(expectedParams);
        console.log(`expected head params: ${JSON.stringify(expectedParams)}`);
        console.log(`given head reponse: ${JSON.stringify(givenResponseHeadObject)}`);

        return new Promise((resolve, rejected) => resolve(givenResponseHeadObject));

        // }
    }
};