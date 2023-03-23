import {matrix} from 'mathjs'

const NeuralNetwork = require('../../utils/nn');

const windowSize = 5;

const nn = new NeuralNetwork(windowSize, windowSize * 2, windowSize * 2, 1);

function normalizeData(input, target) {
  const normalizedData = {};

  // normalize input data
  const inputMin = Math.min(...input.flat());
  const inputMax = Math.max(...input.flat());
  const normalizedInput = input.map(row =>
    row.map(val => (val - inputMin) / (inputMax - inputMin))
  );

  // normalize target data
  const targetMin = Math.min(...target.flat());
  const targetMax = Math.max(...target.flat());
  const normalizedTarget = target.map(row =>
    row.map(val => (val - targetMin) / (targetMax - targetMin))
  );

  normalizedData.input = normalizedInput;
  normalizedData.target = normalizedTarget;
  return normalizedData;
}

function denormalizeData(data, min, max) {
  const denormalizedData = data.map(val => val * (max - min) + min);
  return denormalizedData;
}

export default async function handler(req, res) {
    const { method, body } = req;

    const inputData = body.inputData.split(',').map(x => Number(x.trim()));
    const input = [];

    const target = inputData.slice(windowSize).map((x) => [x]);

    for (let i = 0; i < inputData.length - windowSize + 1; i++) {
      const newArray = [];
      for (let j = 0; j < windowSize; j++) {
        newArray.push(inputData[i + j]);
      }
      input.push(newArray); // Add the new array to the input array
    }

    const normalizedData = normalizeData(input, target);

    const predictInput = normalizedData.input.pop();
    nn.train(matrix(normalizedData.input), matrix(normalizedData.target));

    const outputPredict = nn.predict(predictInput)
    const denormalizedOutput = denormalizeData(outputPredict.toArray(), Math.min(...target), Math.max(...target));

    res.status(200).json({ prediction: denormalizedOutput[0]});
};
