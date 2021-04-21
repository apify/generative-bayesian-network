const path = require("path");
const { platform } = require('os');

const { BayesianNetwork } = require('../src/main');
const testNetworkStructureDefinition = require('./testNetworkStructureDefinition.json');

const testNetworkDefinitionPath = path.join(__dirname, './testNetworkDefinition.json');

describe.skipWindows('Setup test', () => {
    const dfd = require("danfojs-node");
    const fs = require("fs");
    const parse = require('csv-parse/lib/sync');

    console.log(platform());
    let testGeneratorNetwork = new BayesianNetwork(testNetworkStructureDefinition);

    test('Calculates probabilities from data', () => {
        const datasetText = fs.readFileSync(path.join(__dirname, "./testDataset.csv"), {encoding:'utf8'}).replace(/^\ufeff/, '');
        const records = parse(datasetText, {
            columns: true,
            skip_empty_lines: true
        });
        const dataframe = new dfd.DataFrame(records);
        testGeneratorNetwork.setProbabilitiesAccordingToData(dataframe);
        testGeneratorNetwork.saveNetworkDefinition(testNetworkDefinitionPath);
        expect(testGeneratorNetwork.generateSample()).toBeTruthy();
    });
});

const testNetworkDefinition = require(testNetworkDefinitionPath);

describe('Generation tests', () => {
    let testGeneratorNetwork = new BayesianNetwork(testNetworkDefinition);

    test('Generates a sample', () => {
        expect(testGeneratorNetwork.generateSample()).toBeTruthy();
    });

    test('Generates a sample consistent with known values', () => {
        let knownValues = { 
            "ATTR2": "ATTR2_VAL1",
            "ATTR1": "ATTR1_VAL3",
            "ATTR3": "ATTR3_VAL2"
        };
        let sample = testGeneratorNetwork.generateSample(knownValues)
        for(const attribute in knownValues) {
            expect(sample[attribute] == knownValues[attribute]).toBeTruthy();
        }
    });

    test('Generates a sample consistent with the provided value restrictions', () => {
        let valuePossibilities = {
            "ATTR2": [ "ATTR2_VAL1", "ATTR2_VAL2" ],
            "ATTR3": [ "ATTR3_VAL2", "ATTR3_VAL3" ],
            "ATTR5": [ "ATTR5_VAL1", "ATTR5_VAL3" ]
        };
        let sample = testGeneratorNetwork.generateConsistentSampleWhenPossible(valuePossibilities);
        for(const attribute in sample) {
            if(attribute in valuePossibilities) {
                expect(valuePossibilities[attribute].includes(sample[attribute])).toBeTruthy();
            }
        }
    });
});
