---
title: "01. Neurons and Layers"
slug: "01-neurons-and-layers"
date: "2025-07-24"
tags: []
excerpt: "This content expects the reader to know the basics of Python and the object-oriented paradigm."
cover: "https://images.unsplash.com/photo-1545987796-200677ee1011?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb"
---

This content expects the reader to know the basics of Python and the object-oriented paradigm.

<details>
Below are some definitions to help understand the topics described below:

- Input data

- Prediction/Inference

- Is prediction always correct?

- How does a network learn?
</details>

<details>
  <p>Internal content visible only when expanded.</p>
</details>

## Historical theory about artificial neurons

If you are presented with images of cats and dogs, or damaged cars and others in perfect condition, it is very likely that you will be able to identify these different classes in a very short time.

This is due to the sophisticated functioning of our brains, since with it we can learn infinite different patterns while also having the ability to construct them.

### Brain functioning and perceptrons

The human brain consists (briefly) of approximately 86 billion interconnected points. These points are known as neurons, thus forming a biological neural network.  
Each human neuron has 3 main parts: Dendrites, Nucleus, and Axons.

- The dendrites are responsible for receiving messages from other sensory actors in the body and/or other neurons;

- The nucleus acts as a processing unit for the information received by the dendrites of that neuron;

- The axons receive the information processed by the nucleus and transmit it to the next neuron.

![Neuron.](https://res.cloudinary.com/dekxrmlbg/image/upload/v1753372693/zdrrevpdgxudqvtqnoge.png)

The exchange of signals via synapses (nerve impulses) is the factor responsible for one of the most important characteristics of a living being: learning. This construction of neural networks in our brains provides the ability to assimilate facts and information in order to draw possible generalizations and build knowledge about the world around us.

Artificial neurons (and consequently, neural networks) attempt to “imitate” human nervous functioning through purely mathematical constructions of information processing in order to build models to solve tasks such as classification, clustering, among others.

### Artificial neurons and Perceptrons

The artificial neuron is a mathematical model that maps inputs and outputs. The first attempt at such a model happened in 1943 through the so-called McCulloch-Pitts model (since it was devised through a study by Warren Sturgis McCulloch and Harry Pitts Jr.), based on mathematics and algorithms called threshold logic. In 1958, Frank Rosenblatt introduced the idea of a model with crucial changes for the development of this technology in the article “The perceptron: A probabilistic Model for Information Storage and Organization in the Brain,” which tries to replicate the behavior of a biological neuron.

In real neurons, the dendrite receives electrical signals coming from the axons of other neurons. These electrical signals are transmitted along the neuron and influence its behavior. In the Perceptron, these electrical signals are represented by numerical values, allowing a more precise and mathematical interpretation of biological processes.

In synapses, which are the junctions between dendrites and axons, electrical signals are modulated in various amounts to correctly transmit the information. This modulation process is done in the Perceptron by multiplying each input value by a specific coefficient, called a weight. The weights determine the importance of each input and help adjust the behavior of the Perceptron.

Furthermore, a real neuron fires an output signal only when the total strength of the input signals exceeds a certain threshold, which is crucial for the functioning of the neural system. In the Perceptron, we model this phenomenon by calculating the weighted sum of the inputs, which represents the total strength of the signals received. Then, we apply an activation function to this sum to determine whether the output will be activated or not. This activation function can vary, but its purpose is to simulate the firing behavior of the real neuron, ensuring that the Perceptron works similarly to a biological neuron.

The main function of the Perceptron is to perform calculations to detect features or patterns in input data, making it a fundamental tool in machine learning.

## Neuron

A neuron functions as a mathematical unit that accepts a predefined number of inputs and has one or more outputs associated with it.

The calculation related to a perceptron consists of an input layer and an output value. The data (which at this point should already be in numeric format) are passed through the input layer and multiplied by each associated weight and added to a bias value.

It is worth noting that the number of inputs does not necessarily have a limit, that is, you can give as many inputs as you want, as long as they match the rest of the network structure.

The neuron below has 3 inputs (each $w_i$) and one output $(\sum x_i \cdot w_i) + b$

![Image](https://res.cloudinary.com/dekxrmlbg/image/upload/v1753372693/nyvc2hkepw05vouf2tff.png)

```python
inputs = [1, 2, 3]
weights = [0.2, 0.8, -0.5] # each 'column' in the vector is a weight related to the neuron 
bias = 2

output = (inputs[0] * weights[0] + inputs[1] * weights[1] + inputs[2] * weights[2]) + bias
#output: 2.3
```

The weight associated with an input can be understood as the importance of that input, that is, the higher the weight, the more important that parameter is to correctly predict the result.

The result of this output is then passed to an activation function, deciding whether the neuron will be activated or not.

For example, suppose you have created a function that considers that whenever an input value is greater than or equal to 3, the activation function maps its output to 1, otherwise it results in zero.

$f(x) =\begin{cases} 1 & \text{if } x \geq 3 \\0 & \text{if } x < 3 \end{cases}$

In the case of the code example, the output would be 0, since the weighted sum plus the bias results in a value less than 3 (2.3 < 3).

The classic perceptron uses an activation function known as the step function, suitable for binary classification tasks.

$f(x) =\begin{cases} 1 & \text{if } z \geq 0 \\0 & \text{if } z < 0 \end{cases}$

In this case, $z$ is the weighted sum of the inputs plus the bias. In this sense, the function maps the input values to a binary output of 0 or 1.

However, the concept of “Perceptron” can be extended to encompass various activation functions. These other activation functions allow the model to deal with more complex problems and introduce essential nonlinearities to learn rich representations of the data.

### Layers

The great power of artificial neural networks lies in the possibility of arranging different neurons in layers. By adding some neurons in a single layer.

Below you can see a layer of 3 neurons, each neuron having 4 inputs and one output.

![Image](https://res.cloudinary.com/dekxrmlbg/image/upload/v1753372695/l2gihdmskac4esd0yymu.png)

```python
inputs = [1, 4.1, 3, 3.2]

weights = [[0.2, 0.8, -0.5, 1.0],
           [0.5, 0.91, 0.26, -0.5],
           [-0.26, -0.27, 0.17, 0.87],
           [0.5, -0.91, 0.26, 0.5]]

biases = [2.0, 3.0, 0.5, 1.0]

layer_outputs = []

for neuron_weights, neuron_bias in zip(weights, biases):
    neuron_output = 0
    
    for n_input, n_weight in zip(inputs, neuron_weights):
        neuron_output += n_input * n_weight

    neuron_output += neuron_bias
    
    layer_outputs.append(neuron_output)

#output: [7.18, 6.411, 2.4270000000000005, 0.14900000000000047]
```

Notice that each neuron has the same calculation mentioned earlier $(\sum x_i \cdot w_i) + b$, but with weights relative only to that neuron.

Therefore, the appropriate calculation would now be $(\sum x_{ij} \cdot w_i) + b)$ → now the weight values can be accessed in a matrix structure.

```python
# Another way to calculate the summation using the sum() function
for weight, bias in zip(weights, biases):
    output = sum(i * w for i, w in zip(inputs, weight)) + bias
    layer_outputs.append(output)
```

In addition, it is extremely important to notice how the weight vector is positioned, since the i-th row in the matrix is (for now) a weight related to the i-th neuron.

$B = \begin{bmatrix}
w_{11} & w_{12} & w_{13}\\
w_{21} & w_{22} & w_{11}\\
w_{31} & w_{32} & w_{33}
\end{bmatrix}$

This may cause errors when multiplying the input matrix by the weight matrix.
