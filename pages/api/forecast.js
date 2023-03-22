import {matrix} from 'mathjs'

const NeuralNetwork = require('../../utils/nn');

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

    const target = inputData.slice(2).map((x) => [x]);

    for (let i = 0; i < inputData.length - 1; i++) {
      input.push([inputData[i], inputData[i + 1]]);
    }

    const normalizedData = normalizeData(input, target);

    const predictInput = normalizedData.input.pop();

    const nn = new NeuralNetwork(2, 4, 1);
    nn.train(matrix(normalizedData.input), matrix(normalizedData.target));

    const outputPredict = nn.predict(predictInput)
    const denormalizedOutput = denormalizeData(outputPredict.toArray(), Math.min(...target), Math.max(...target));

    res.status(200).json({ prediction: denormalizedOutput[0]});
};
