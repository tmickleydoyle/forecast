import {exp, e, pow, log, random, multiply, dotMultiply, mean, abs, subtract, transpose, add} from 'mathjs'

export function sigmoid(x, derivative) {
	let fx = 1 / (1 + exp(-x));
  if (derivative)
		return fx * (1 - fx);
	return fx;
}

export function tanh(x, derivative) {
	let fx = 2 / (1 + exp(-2 * x)) - 1;
	if (derivative) 
		return 1 - pow(fx, 2);
	return fx;
}

export function relu(x, derivative) {
	if (derivative)
		return x < 0 ? 0 : 1;
	return x < 0 ? 0 : x;
}

export function softplus(x, derivative) {
	if (derivative)
		return 1 / (1 + exp(-x));
	return log(1 + exp(x), e);
}

function linear(x, derivative = false) {
  return derivative ? 1 : x;
}

export class NeuralNetwork {
    constructor(...args) {
        this.input_nodes = args[0];
        this.hidden_nodes = args[1];
        this.output_nodes = args[2];

        this.epochs = 10000;
        this.activation = relu; 
        this.lr = .0001;
        this.output = Math.random(); 

        this.synapse_zero = random([this.input_nodes, this.hidden_nodes], 0, 1);
        this.synapse_one = random([this.hidden_nodes, this.output_nodes], 0, 1);

    }
    setEpochs(numEpochs) {
        this.epochs = numEpochs;
    }
    setActivation(func) {
        switch (func) {
          case 'sigmoid': {
                this.activation = sigmoid;
                break;
            }
            case 'tanh': {
                this.activation = tanh;
                break;
            }
            case 'relu': {
                this.activation = relu;
                break;
            }
            case 'softplus': {
                this.activation = softplus;
                break;
            }
            case 'linear': {
                this.activation = linear;
                break;
            }
            default: {
                this.activation = sigmoid;
                break;
            } 
        }
    }
    setLearningRate(lr) {
        this.lr = lr;
    }
    train(input, target) {
        for (let i = 0; i < this.epochs; i++) {
            let input_layer = input;
            let hidden_layer_logits = multiply(input_layer, this.synapse_zero);
            let hidden_layer_activated = hidden_layer_logits.map(v => this.activation(v, false));
            let output_layer_logits = multiply(hidden_layer_activated, this.synapse_one);
            let output_layer_activated = output_layer_logits.map(v => this.activation(v, false))

            let output_error = subtract(target, output_layer_activated);
            let output_delta = dotMultiply(output_error, output_layer_logits.map(v => this.activation(v, true)));
            let hidden_error = multiply(output_delta, transpose(this.synapse_one));
            let hidden_delta = dotMultiply(hidden_error, hidden_layer_logits.map(v => this.activation(v, true)));
                
            this.synapse_one = add(this.synapse_one, multiply(transpose(hidden_layer_activated), multiply(output_delta, this.lr)));
            this.synapse_zero = add(this.synapse_zero, multiply(transpose(input_layer), multiply(hidden_delta, this.lr)));
            this.output = output_layer_activated;

            if (i % 10000 == 0)
                console.log(`Error: ${mean(abs(output_error))}`);
        }
    }
    predict(input) {
        let input_layer = input;
        let hidden_layer = multiply(input_layer, this.synapse_zero).map(v => this.activation(v, false));
        let output_layer = multiply(hidden_layer, this.synapse_one).map(v => this.activation(v, false));
        return output_layer;
    }
}

module.exports = NeuralNetwork;