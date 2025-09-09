import numpy as np
import json
from neural_network.layer.layer import Layer

class NeuralNetwork:
    def __init__(self):
        self.layers = []
        # How wrong it is
        self.loss_list = []

    def add_layer(self, num_neurons, input_size):
        if not self.layers:
            self.layers.append(Layer(num_neurons, input_size))
        else:
            previous_output_size = len(self.layers[-1].neurons)
            self.layers.append(Layer(num_neurons, previous_output_size))

    def forward(self, inputs):
        for layer in self.layers:
            inputs = layer.forward(inputs)
        return inputs

    def backward(self, loss_gradient, learning_rate):
        for layer in reversed(self.layers):
            loss_gradient = layer.backward(loss_gradient, learning_rate)

    def train(self, X, y, epochs=1000, learning_rate=0.1):
        # It trains the weights
        for epoch in range(epochs):
            loss = 0
            for i in range(len(X)):
                output = self.forward(X[i])
                loss += np.mean((y[i]- output)**2)
                loss_gradient = 2 * (output - y[i])
                self.backward(loss_gradient, learning_rate)
            loss /= len(X)
            self.loss_list.append(loss)
            if epoch % 100 == 0:
                print("Epoch: ", epoch, "Loss: ", loss)

    def predict(self, X):
        predictions = []
        for i in range(len(X)):
            predictions.append(self.forward(X[i]))
        return np.array(predictions)

    def save(self, filename="model.json"):
        model_data = {
            "layers": []
        }
        for layer in self.layers:
            layer_data = {
                "num_neurons": len(layer.neurons),
                "input_size": len(layer.neurons[0].weight) if layer.neurons else 0,
                "neurons": layer.to_dict()
            }

            model_data["layers"].append(layer_data)

        with open(filename, "w") as f:
            json.dump(model_data, f)
        print("Saved model to ", filename)

    def load(self, filename="model.json"):
        with open(filename, "r") as f:
            model_data = json.load(f)
        # restart layers
        self.layers = []

        for layer_data in model_data["layers"]:
            num_neurons = layer_data["num_neurons"]
            input_size = layer_data["input_size"]
            neurons = layer_data["neurons"]

            new_layer = Layer(num_neurons, input_size)

            new_layer.from_dict(neurons)

            self.layers.append(new_layer)

        print("Loaded model from ", filename)



if __name__ == "__main__":
    X = np.array([[0.5, 0.2, 0.1],
                  [0.9, 0.7, 0.3],
                  [0.4, 0.5, 0.8],])

    y= np.array([[0.3, 0.6, 0.9]]).T

    nn = NeuralNetwork()

    # nn.add_layer(3, 3)
    # nn.add_layer(3, 3)
    # nn.add_layer(1, 4)
    #
    # # Train network
    # nn.train(X, y, epochs=10000, learning_rate=0.1)
    #
    # nn.save("model1.json")
    nn.load(filename="model1.json")

    predictions = nn.predict(X)
    print(f"Predictions: {predictions}")
