# Neural Network desde cero

Red neuronal artificial **fully-connected** implementada en Python y NumPy, sin frameworks de deep learning como TensorFlow o PyTorch.

El proyecto implementa:

- Neuronas con pesos, bias y activación sigmoide.
- Capas densas (*fully-connected*).
- Propagación hacia adelante (*forward propagation*).
- Retropropagación (*backpropagation*).
- Descenso de gradiente para actualizar pesos.
- Guardado y carga del modelo en JSON.

## Cómo funciona

La red se organiza en tres niveles:

    NeuralNetwork
     ├── Layer
     │    ├── Neuron
     │    ├── Neuron
     │    └── ...
     └── Layer
          └── ...

### 1. Neurona

Cada `Neuron` recibe un vector de entradas y calcula:

    z = x · w + b
    a = sigmoid(z)

Donde:

- `x` son las entradas.
- `w` son los pesos.
- `b` es el bias.
- `sigmoid` es la función de activación:

    sigmoid(z) = 1 / (1 + e^(-z))

Por tanto, la salida de cada neurona está entre `0` y `1`.

En `neuron.py`:

    weighted_sum = np.dot(inputs, self.weight) + self.bias
    self.output = self.activate(weighted_sum)

### 2. Capa

Una `Layer` contiene varias neuronas. Todas reciben las mismas entradas, pero cada una tiene pesos y bias propios.

    Entradas -> [Neurona 1, Neurona 2, ..., Neurona N] -> Salidas

La salida de una capa es un array con el resultado de cada neurona:

    return np.array([neuron.forward(inputs) for neuron in self.neurons])

### 3. Red neuronal

`NeuralNetwork` conecta varias capas en secuencia.

    nn = NeuralNetwork()
    nn.add_layer(3, 3)  # 3 entradas -> 3 neuronas
    nn.add_layer(3, 3)  # 3 entradas -> 3 neuronas
    nn.add_layer(1, 3)  # 3 entradas -> 1 salida

El método `add_layer` calcula automáticamente el tamaño de entrada de cada capa nueva a partir del número de neuronas de la capa anterior.

    previous_output_size = len(self.layers[-1].neurons)
    self.layers.append(Layer(num_neurons, previous_output_size))

## Forward propagation

Durante la predicción, los datos atraviesan la red capa por capa:

    X -> Capa 1 -> Capa 2 -> ... -> Capa N -> Predicción

    def forward(self, inputs):
        for layer in self.layers:
            inputs = layer.forward(inputs)
        return inputs

Cada capa usa la salida de la anterior como entrada.

## Entrenamiento

El entrenamiento usa:

- **Función de pérdida:** error cuadrático medio, MSE.
- **Optimizador:** descenso de gradiente.
- **Backpropagation:** para calcular cómo afecta cada peso al error.

Para cada ejemplo:

1. Se hace `forward()` para obtener la predicción.
2. Se calcula el error respecto al valor real.
3. Se propaga el gradiente hacia atrás con `backward()`.
4. Se actualizan pesos y bias.

La pérdida utilizada es:

    MSE = (1 / n) * sum((y_i - prediction_i)^2)

El gradiente inicial respecto a la salida es:

    dLoss/dPrediction = 2 * (prediction - y)

En `neural_network.py`:

    output = self.forward(X[i])
    loss += np.mean((y[i] - output) ** 2)
    loss_gradient = 2 * (output - y[i])
    self.backward(loss_gradient, learning_rate)

## Backpropagation

En cada neurona se calcula:

1. El gradiente tras la activación sigmoide:

    sigmoid_derivative(a) = a * (1 - a)

2. El gradiente respecto a los pesos:

    dLoss/dWeight = input * delta

3. El gradiente respecto al bias:

    dLoss/dBias = delta

4. El gradiente que se envía a la capa anterior:

    dLoss/dInput = delta * weight

Después, los parámetros se actualizan así:

    weight = weight - learning_rate * dLoss/dWeight
    bias = bias - learning_rate * dLoss/dBias

En `neuron.py`:

    self.weight -= self.dweight * learning_rate
    self.bias -= learning_rate * self.dbias

## Estructura del proyecto

    Neural_Network/
    ├── data/
    ├── neural_network/
    │   ├── layer/
    │   │   └── layer.py
    │   ├── neuron/
    │   │   └── neuron.py
    │   └── neural_network.py
    ├── run.py
    └── README.md

| Archivo | Responsabilidad |
|---|---|
| `neural_network/neuron/neuron.py` | Define una neurona: pesos, bias, activación y backpropagation. |
| `neural_network/layer/layer.py` | Agrupa neuronas y propaga datos entre capas. |
| `neural_network/neural_network.py` | Define la red completa, entrenamiento, predicción y persistencia. |
| `run.py` | Punto de entrada para ejecutar el modelo. |

## Uso

### Instalar dependencias

    pip install numpy

### Entrenar una red

    import numpy as np
    from neural_network.neural_network import NeuralNetwork

    X = np.array([
        [0.5, 0.2, 0.1],
        [0.9, 0.7, 0.3],
        [0.4, 0.5, 0.8],
    ])

    y = np.array([[0.3], [0.6], [0.9]])

    nn = NeuralNetwork()

    nn.add_layer(3, 3)
    nn.add_layer(3, 3)
    nn.add_layer(1, 3)

    nn.train(X, y, epochs=10000, learning_rate=0.1)

### Hacer predicciones

    predictions = nn.predict(X)
    print(predictions)

### Guardar el modelo

    nn.save("model1.json")

### Cargar un modelo entrenado

    nn = NeuralNetwork()
    nn.load("model1.json")

    predictions = nn.predict(X)
    print(predictions)

## Ejecutar el proyecto

    python run.py

Por defecto, `run.py` carga `model1.json` y realiza predicciones sobre los datos de ejemplo.

## Limitaciones actuales

- Solo admite la activación sigmoide.
- La salida siempre está entre `0` y `1`.
- El entrenamiento procesa los ejemplos uno a uno, no por *mini-batches*.
- No incluye validación, métricas adicionales ni regularización.
- No incluye funciones de activación como ReLU, tanh o softmax.
- No incluye optimizadores avanzados como Adam o RMSProp.

## Posibles mejoras

- Añadir ReLU, tanh y softmax.
- Implementar *mini-batch gradient descent*.
- Añadir *train/test split* y métricas como accuracy, MAE o RMSE.
- Inicializar pesos con Xavier o He.
- Añadir soporte para clasificación multiclase.
- Añadir tests unitarios con `pytest`.
