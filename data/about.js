const about = `
# MLP models

Multi-Layer Perceptron models, are a type of artificial neural network that can be used for supervised learning tasks,
such as regression or classification problems. MLP models are good for finding general trends in data for several reasons.

MLP models are highly flexible and can learn complex non-linear relationships between input features and output targets. 
his makes them suitable for a wide range of tasks, including forecasting.

# Input data

The input data is a list of numbers, separated by commas. The input data is used to train the model, and the model will
predict the next value in the sequence.

Example: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10

# Lookback window

The lookback window size is the number of values that the model will use to predict the next value in the sequence. The
lookback size must be less than the number of values in the input data.

Lookback window example
Input Data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

Lookback Window: 1 (Default)
[[1], [2], [3], [4], [5], [6], [7], [8], [9], [10]]

Lookback Window: 2
[[1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10]]

Lookback Window: 3
[[1, 2, 3], [2, 3, 4], [3, 4, 5], [4, 5, 6], [5, 6, 7], [6, 7, 8], [7, 8, 9], [8, 9, 10]]

# Prediction range

The prediction range is the number of values that the model will predict. The forecast range must be less than the number of
values in the input data.

Example: 5

# L1 regularization

The L1 regularization is a regularization technique that can be used to prevent overfitting. The L1 regularization is a
penalty that is added to the loss function. The penalty is a sum of the absolute values of the model weights. The penalty
is added to the loss function during training. The penalty is used to prevent the model from learning complex relationships
between the input features and the output target. The penalty is also used to prevent the model from learning the noise in
the input data.

## More about L1 regularization

L1 regularization is a technique used in machine learning and statistics to help prevent overfitting of a model to the data
it is trained on. When we train a model, we want it to be able to generalize well to new data, not just memorize the training
data. Overfitting occurs when a model becomes too complex and starts to fit the training data too closely, making it less
accurate when it encounters new data.

L1 regularization works by adding a penalty term to the loss function used to train the model. This penalty term is proportional
to the absolute value of the model's weights, which are the coefficients that the model uses to make predictions. By penalizing
large weights, L1 regularization encourages the model to focus on the most important features and ignore irrelevant ones, making
the model simpler and more robust.

In simpler terms, L1 regularization helps the model to focus on the most important features while ignoring the less important
ones. This can make the model more accurate and less likely to memorize the training data.

In the case of two values, 0.1 and 0.000001, they represent the strength of the L1 regularization. A higher value of L1
regularization, such as 0.1, means that the model will try to set more weights to zero, which leads to a simpler model with fewer
features. A smaller value of L1 regularization, such as 0.000001, means that the model will try to set fewer weights to zero,
which allows the model to use more features.

So, using 0.1 for L1 regularization would result in a simpler model with fewer features, while using 0.000001 for L1 regularization
would allow the model to use more features.


# L2 regularization

The L2 regularization is a regularization technique that can be used to prevent overfitting. The L2 regularization is a
penalty that is added to the loss function. The penalty is a sum of the squared values of the model weights. The penalty is
added to the loss function during training. The penalty is used to prevent the model from learning complex relationships
between the input features and the output target. The penalty is also used to prevent the model from learning the noise in
the input data.

## More about L2 regularization

L2 regularization is a technique used in machine learning to help prevent overfitting. Overfitting happens when a model
learns too much from the training data and becomes too specialized to that data, so that it doesn't perform well on new data.
L2 regularization helps to prevent this by adding a term to the model's loss function that penalizes large weights in the model.

Imagine you're trying to fit a curve to a set of points on a graph. You might try to fit the curve exactly to each point, but
that could result in a curve that's too complex and doesn't generalize well to new points. Instead, you could use L2 regularization
to encourage the curve to be smoother, which can help it to fit the points better overall.

So, you should use L2 regularization when you want to prevent overfitting in your model and improve its ability to generalize to
new data.

When the regularization parameter is set to 0.1, it means that the model will try to minimize the sum of squared weights, but with a
larger emphasis on reducing larger weights. In other words, it will try to make sure that none of the weights become too large, which
could lead to overfitting.

On the other hand, when the regularization parameter is set to 0.000001, the penalty term will be much smaller, and the model will be
less concerned with keeping the weights small. This could lead to the model overfitting the training data and performing poorly on
new data.

So, in short, a larger value for the regularization parameter (like 0.1) will tend to produce simpler models that are less likely to
overfit, while a smaller value (like 0.000001) will allow the model to fit more closely to the training data, but with a greater risk
of overfitting.

# Chart

The chart shows the input data, and the predicted values. The predicted values are the values that the model predicts for
the next values in the sequence. The predicted values are shown in shades of orange, and many predicted values can be shown
at once.
`

export default about