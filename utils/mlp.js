import {
    exp,
    e,
    pow,
    log,
    random,
    multiply,
    dotMultiply,
    dotDivide,
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

export function linear(x, derivative = false) {
    return derivative ? 1 : x;
}

export class MLP {
    constructor(...args) {
        this.input_nodes = args[0];
        this.hidden_nodes = args[1];
        this.output_nodes = args[2];

        this.epochs = 1200;
        this.activation = relu;
        this.lr = args[3];
        this.l2 = args[4];
        this.dropout_prob = 0.03;
        this.lambda = 0.000001;

        this.bad_model = false;

        this.synapse_zero = random([this.input_nodes, this.hidden_nodes], 0, 1);
        this.synapse_one = random([this.hidden_nodes, this.output_nodes], 0, 1);
    }

    train(input, target) {
        let prev_output_error = null;
        let num_lower = 0;
        let num_same_error = 0;
        for (let i = 0; i <= this.epochs; i++) {
            let input_layer = input;
            let hidden_layer_logits = multiply(input_layer, this.synapse_zero);
            let hidden_layer_activated = hidden_layer_logits.map(v => this.activation(v, false));

            if (this.dropout_prob > 0) {
                let dropout_mask = random([this.hidden_nodes], 0, 1);
                dropout_mask = dropout_mask.map(v => v >= this.dropout_prob ? 1 : 0);
                hidden_layer_activated = dotMultiply(hidden_layer_activated, dropout_mask);
                hidden_layer_activated = dotDivide(hidden_layer_activated, 1 - this.dropout_prob);
            }

            let output_layer_logits = multiply(hidden_layer_activated, this.synapse_one);
            let output_layer_activated = output_layer_logits.map(v => this.activation(v, false))

            let output_error = subtract(target, output_layer_activated);
            let output_delta = dotMultiply(output_error, output_layer_logits.map(v => this.activation(v, true)));
            let hidden_error = multiply(output_delta, transpose(this.synapse_one));
            let hidden_delta = dotMultiply(hidden_error, hidden_layer_logits.map(v => this.activation(v, true)));

            let reg_one = multiply(this.synapse_one, this.lambda);
            let reg_zero = multiply(this.synapse_zero, this.lambda);

            this.synapse_one = add(add(this.synapse_one, reg_one), multiply(transpose(hidden_layer_activated), multiply(output_delta, this.lr)));
            this.synapse_zero = add(add(this.synapse_zero, reg_zero), multiply(transpose(input_layer), multiply(hidden_delta, this.lr)));

            if (i % 100 == 0) {
                // console.log(`Epoch ${i} - Error: ${mean(abs(output_error))}`);
                if (prev_output_error !== null && prev_output_error <= mean(abs(output_error))) {
                    if (prev_output_error == mean(abs(output_error))) {
                        num_same_error++;
                    }
                    if (num_same_error >= 5) {
                        this.bad_model = true;
                    }
                    num_lower++;
                    if (num_lower >= 5) {
                        console.log(`Early Stop at Epoch ${i} - Current Error: ${mean(abs(output_error))} - Previous Error: ${prev_output_error}`);
                        break;
                    }
                }
            }

            prev_output_error = mean(abs(output_error));
        }
    }

    low_model_quality() {
        return this.bad_model;
    }

    predict(input) {
        let input_layer = input;
        let hidden_layer = multiply(input_layer, this.synapse_zero).map(v => this.activation(v, false));
        let output_layer = multiply(hidden_layer, this.synapse_one).map(v => this.activation(v, false));
        return output_layer;
    }
}

module.exports = MLP;