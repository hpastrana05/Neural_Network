import numpy as np
from neural_network.neuron.neuron import Neuron

class Layer:

    def __init__(self, num_neurons, input_size):
        # Initializes the number of neurons in the layer
        self.neurons = [Neuron(input_size) for _ in range(num_neurons)]

    def forward(self, inputs):
        # returns an array with all the values returned by the neurons
        return np.array([neuron.forward(inputs) for neuron in self.neurons])

    def backward(self, d_output, learning_rate):
        d_inputs = np.zeros(len(self.neurons[0].inputs))

        for i, neuron in enumerate(self.neurons):
            d_inputs += neuron.backward(d_output[i], learning_rate)

        return d_inputs

    def to_dict(self):
        return [neuron.to_dict() for neuron in self.neurons]

    def from_dict(self, d):
        for neuron, neuron_data in zip(self.neurons, d):
            neuron.from_dict(neuron_data)


if __name__ == '__main__':
    layer = Layer(3, 4)
    inputs = np.array([1, 8, 5, 6])

    layer_output = layer.forward(inputs)
    print("Layer output: ",layer_output)