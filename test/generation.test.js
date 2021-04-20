const dfd = require("danfojs-node");
const fs = require("fs");
const parse = require('csv-parse/lib/sync');
const path = require("path");

const { BayesianNetwork } = require('../src/main');
const testNetworkStructureDefinition = require('./testNetworkStructureDefinition.json');

describe('Generation tests', () => {
    let testGeneratorNetwork = new BayesianNetwork(testNetworkStructureDefinition);
    let records;

    beforeAll(async (done) => {
        const datasetText = fs.readFileSync(path.join(__dirname, "./testDataset.csv"), {encoding:'utf8'}).replace(/^\ufeff/, '');
        records = parse(datasetText, {
            columns: true,
            skip_empty_lines: true
        });
        let dataframe = new dfd.DataFrame(records);
        testGeneratorNetwork.setProbabilitiesAccordingToData(dataframe);
        done();
    });

    test('Sets up probability distributions from data and generates a sample', () => {
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
