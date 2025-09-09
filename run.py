import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from neural_network.neural_network import NeuralNetwork

df = pd.read_csv("data/winequality-white.csv", header=0, sep=";")

X = df.drop(columns=["quality"])
y = df["quality"]

# Normalizes the values
for col in X.columns:
    X[col] = X[col]/X[col].max()

y = y/10

n_train = 500
n_test = 200

X_train = X[:n_train].values
y_train = y[:n_train].values.T

X_test = X[n_train:n_test+n_train].values
y_test = y[n_train:n_test+n_train].values.T

nn = NeuralNetwork()
#
# nn.add_layer(3, X.shape[1])
# nn.add_layer(3, X.shape[1])
# nn.add_layer(1, X.shape[1])
#
# nn.train(X_train, y_train, epochs=2000, learning_rate=0.5)
#
# nn.save("models/wine_quality.json")

nn.load("models/wine_quality.json")

y_pred = nn.predict(X_test)

y_test = np.round(y_test * 10)
y_pred = np.round(y_pred * 10)

print(y_test[:5], y_pred[:5])

error = abs(y_test - y_pred).mean()
print(f"error: {error}")

plt.plot(nn.loss_list)
plt.show()

plt.plot(y_pred)
plt.plot(y_test)
plt.show()