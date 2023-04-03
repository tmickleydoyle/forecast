import {
    exp,
    e,
    pow,
    log,
    random,
    multiply,
    dotMultiply,
    mean,
    abs,
    subtract,
    transpose,
    add,
    norm
} from 'mathjs';

export function sigmoid(x, derivative) {
    let fx = 1 / (1 + exp(-x));
    if (derivative) return fx * (1 - fx);
    return fx;
}

export function tanh(x, derivative) {
    let fx = 2 / (1 + exp(-2 * x)) - 1;
    if (derivative) return 1 - pow(fx, 2);
    return fx;
}

export function relu(x, derivative) {
    if (derivative) return x < 0 ? 0 : 1;
    return x < 0 ? 0 : x;
}

export function softplus(x, derivative) {
    if (derivative) return 1 / (1 + exp(-x));
    return log(1 + exp(x), e);
}

function linear(x, derivative = false) {
    return derivative ? 1 : x;
}

export class MLP {
    constructor(...args) {
        this.input_nodes = args[0];
        this.hidden_nodes = args[1];
        this.hidden_nodes2 = args[2];
        this.hidden_nodes3 = args[3];
        this.output_nodes = args[4];

        this.epochs = 2500;
        this.activation = relu;
        this.lr = 0.005;
        this.l2 = 0.01;
        this.output = Math.random();

        this.all_zeros = random([this.hidden_nodes3, this.output_nodes], 1, 2);

        this.synapse_zero = random([this.input_nodes, this.hidden_nodes], 0, 1);
        this.synapse_one = random([this.hidden_nodes, this.hidden_nodes2], 0, 1);
        this.synapse_two = random([this.hidden_nodes2, this.hidden_nodes3], 0, 1);
        this.synapse_three = random([this.hidden_nodes3, this.output_nodes], 0, 1);
    }

    train(input, target, lambda = 0.001) {
        let prev_output_error = null;
        for (let i = 0; i < this.epochs; i++) {
            let input_layer = input;
            let hidden_layer_logits = multiply(input_layer, this.synapse_zero);
            let hidden_layer_activated = hidden_layer_logits.map(v => this.activation(v, false));

            let hidden_layer2_logits = multiply(hidden_layer_activated, this.synapse_one);
            let hidden_layer2_activated = hidden_layer2_logits.map(v => this.activation(v, false));

            let hidden_layer3_logits = multiply(hidden_layer2_activated, this.synapse_two);
            let hidden_layer3_activated = hidden_layer3_logits.map(v => this.activation(v, false));

            let output_layer_logits = multiply(hidden_layer3_activated, this.synapse_three);
            if (Math.random() < 0.15) {
                output_layer_logits = multiply(hidden_layer3_activated, this.all_zeros);
            }
            let output_layer_activated = output_layer_logits.map(v => this.activation(v, false))

            let output_error = subtract(target, output_layer_activated);
            let output_delta = dotMultiply(output_error, output_layer_logits.map(v => this.activation(v, true)));
            let hidden_error3 = multiply(output_delta, transpose(this.synapse_three));
            let hidden_delta3 = dotMultiply(hidden_error3, hidden_layer3_logits.map(v => this.activation(v, true)));
            let hidden_error2 = multiply(hidden_delta3, transpose(this.synapse_two));
            let hidden_delta2 = dotMultiply(hidden_error2, hidden_layer2_logits.map(v => this.activation(v, true)));
            let hidden_error = multiply(hidden_delta2, transpose(this.synapse_one));
            let hidden_delta = dotMultiply(hidden_error, hidden_layer_logits.map(v => this.activation(v, true)));

            let reg_three = multiply(this.synapse_three, lambda);
            let reg_two = multiply(this.synapse_two, lambda);
            let reg_one = multiply(this.synapse_one, lambda);
            let reg_zero = multiply(this.synapse_zero, lambda);

            this.synapse_three = add(add(this.synapse_three, reg_three), multiply(transpose(hidden_layer3_activated), multiply(output_delta, this.lr)));
            this.synapse_two = add(add(this.synapse_two, reg_two), multiply(transpose(hidden_layer2_activated), multiply(hidden_delta3, this.lr)));
            this.synapse_one = add(add(this.synapse_one, reg_one), multiply(transpose(hidden_layer_activated), multiply(hidden_delta2, this.lr)));
            this.synapse_zero = add(add(this.synapse_zero, reg_zero), multiply(transpose(input_layer), multiply(hidden_delta, this.lr)));
            this.output = output_layer_activated;

            if (i >= 100 && prev_output_error !== null && prev_output_error <= mean(abs(output_error))) {
                console.log(`Early Stop at Epoch ${i} - Error: ${mean(abs(output_error))} - Previous Error: ${prev_output_error}`);
                break;
            }

            prev_output_error = mean(abs(output_error));

            if (i % 100 == 0)
                console.log(`Epoch ${i} - Error: ${mean(abs(output_error))}`);
        }
    }
    predict(input) {
        let input_layer = input;
        let hidden_layer = multiply(input_layer, this.synapse_zero).map(v => this.activation(v, false));
        let output_layer = multiply(hidden_layer, this.synapse_one).map(v => this.activation(v, false));
        return output_layer;
    }
}

module.exports = MLP;