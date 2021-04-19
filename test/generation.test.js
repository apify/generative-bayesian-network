const { BayesianNetwork } = require('../src/main');
const testNetworkDefinition = require('./testNetworkDefinition.json');


describe('Generation tests', () => {
    let testGeneratorNetwork = new BayesianNetwork(testNetworkDefinition);

    test('Generates a sample', () => {
        expect(testGeneratorNetwork.generateSample()).toBeTruthy();
    });

    test('Generates a sample consistent with known values', () => {
        let knownValues = { "ATTR2": "ATTR2_VAL1", "ATTR1": "ATTR1_VAL3", "ATTR3": "ATTR3_VAL2" };
        let sample = testGeneratorNetwork.generateSample(knownValues)
        for(const attribute in knownValues) {
            expect(sample[attribute] == knownValues[attribute]).toBeTruthy();
        }
    });
});
