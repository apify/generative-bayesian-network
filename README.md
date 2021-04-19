# Generative bayesian network
NodeJs package containing a bayesian network capable of randomly sampling from a distribution defined by a json object.

<!-- toc -->

- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)

<!-- tocstop -->

## Installation
Run the `npm i generative-bayesian-network` command. No further setup is needed afterwards.
## Usage
To use the network, you need to create an instance of the `BayesianNetwork` class which is exported from this package. Constructor of this class accepts a JSON object containing the network definition, including the conditional probability distributions from the nodes. An example of such a definition saved in a JSON file could look like:
```json
{
    "nodes": [
        {
            "name": "ParentNode",
            "values": ["A", "B", "C"],
            "parentNames": [],
            "conditionalProbabilities": {
                "A": 0.1,
                "B": 0.8,
                "C": 0.1
            }
        },
        {
            "name": "ChildNode",
            "values": [".", ",", "!", "?"],
            "parentNames": ["ParentNode"],
            "conditionalProbabilities": {
                "A": {
                    ".": 0.7,
                    "!": 0.3
                },
                "B": {
                    ",": 0.3,
                    "?": 0.7
                },
                "C": {
                    ".": 0.5,
                    "?": 0.5
                }
            }
        }
    ]
}
```
Once you have the network definition ready, you can create an instance simply by executing:
```js
let generatorNetwork = new BayesianNetwork(networkDefinition);
```
Afterwards, you can use two methods of this class - `generateSample` and `generateConsistentSampleWhenPossible`. The first one generates a sample of all node values given (optionally) the values we already know in the form of an object. The second does much the same thing, with two differences - firstly, the object you can give it as an argument can contain multiple possible values for each node, not just one. And secondly, it cannot generate combinations not present in the original data. You could run them for example like this:
```js
let sample = generatorNetwork.generateSample({ "ParentNode": "A" });
let consistentSample = generatorNetwork.generateSample({ "ParentNode": ["A","B"], "ChildNode": [",","!"] });
```
## API Reference
All public classes, methods and their parameters can be inspected in this API reference.

<a name="BayesianNetwork"></a>

### BayesianNetwork
BayesianNetwork is an implementation of a bayesian network capable of randomly sampling from the distribution
represented by the network.


* [BayesianNetwork](#BayesianNetwork)
    * [`new BayesianNetwork(networkDefinition)`](#new_BayesianNetwork_new)
    * [`.generateSample(inputValues)`](#BayesianNetwork+generateSample)
    * [`.generateConsistentSampleWhenPossible(valuePossibilities)`](#BayesianNetwork+generateConsistentSampleWhenPossible)


* * *

<a name="new_BayesianNetwork_new"></a>

#### `new BayesianNetwork(networkDefinition)`

| Param | Type | Description |
| --- | --- | --- |
| networkDefinition | <code>object</code> | object defining the network structure and distributions |


* * *

<a name="BayesianNetwork+generateSample"></a>

#### `bayesianNetwork.generateSample(inputValues)`
Randomly samples from the distribution represented by the bayesian network.
Can generate samples not found in the data used to create the definition file.


| Param | Type | Description |
| --- | --- | --- |
| inputValues | <code>object</code> | node values that are known already |


* * *

<a name="BayesianNetwork+generateConsistentSampleWhenPossible"></a>

#### `bayesianNetwork.generateConsistentSampleWhenPossible(valuePossibilities)`
Randomly samples from the distribution represented by the bayesian network.
Cannot generate samples not found in the data used to create the definition file,
so it only generates samples when it is possible to be consistent with the data.


| Param | Type | Description |
| --- | --- | --- |
| valuePossibilities | <code>object</code> | a dictionary of lists of possible values for nodes                                      (if a node isn't present in the dictionary, all values are possible) |


* * *

