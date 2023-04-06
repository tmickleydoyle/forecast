import {matrix} from 'mathjs'

const MLP = require('../../utils/mlp');

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

function windowizeArray(array, windowSize) {
  const windowizedArray = [];
  for (let i = 0; i < array.length - windowSize + 1; i++) {
    const newArray = [];
    for (let j = 0; j < windowSize; j++) {
      newArray.push(array[i + j]);
    }
    windowizedArray.push(newArray); // Add the new array to the input array
  }
  return windowizedArray;
}

export default async function handler(req, res) {
    const { method, body } = req;

    const inputData = body.inputData.split(',').map(x => Number(x.trim()));
    const windowSize = body.windowSize || 1;
    const nn = new MLP(windowSize, 2, 1);
    const forecastRange = body.forecastRange || 5;

    const target = inputData.slice(windowSize).map((x) => [x]);

    const input = windowizeArray(inputData, windowSize);

    const normalizedData = normalizeData(input, target);

    const predictInput = normalizedData.input.pop();
    nn.train(matrix(normalizedData.input), matrix(normalizedData.target));

    const forecastPrections = [];
    let forecastInput = [];
    let forecastInputArray = windowizeArray(predictInput, windowSize);

    for (let i = 0; i < forecastRange; i++) {
      let outputPredict = nn.predict(matrix([forecastInputArray[forecastInputArray.length - 1]]));
      forecastPrections.push(outputPredict.toArray()[0][0]);
      forecastInput = [...predictInput, ...forecastPrections];
      forecastInputArray = windowizeArray(forecastInput, windowSize);
    }

    const denormalizedOutput = denormalizeData(forecastPrections, Math.min(...target), Math.max(...target));
    res.status(200).json({ prediction: denormalizedOutput});
};