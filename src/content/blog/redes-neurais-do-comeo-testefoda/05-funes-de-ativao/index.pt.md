---
title: "05. Funções de ativação"
slug: "05-funes-de-ativao"
date: "2025-10-04"
tags: []
excerpt: "Funções de ativação auxiliam redes neurais a modelarem relações complexas entre os dados de entrada e as saídas esperadas relativas, ou seja, ajudam a alcançar padrões não lineares em suas previsões."
cover: "https://images.unsplash.com/photo-1545987796-200677ee1011?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb"
---

Funções de ativação auxiliam redes neurais a modelarem relações complexas entre os dados de entrada e as saídas esperadas relativas, ou seja, ajudam a alcançar padrões não lineares em suas previsões.

Em suma, cada função de ativação mapeia o resultado da soma ponderada (provinda dos pesos dos neurônios e do vetor de vieses) para um valor de saída através de uma função matemática de maneira diferente.

Abaixo é possível observar a estrutura de dois cenários distintos



1. Dados de entrada → pesos + vieses → função de ativação sobre o resultado da soma ponderada → saída

1. Dados de entrada → pesos + vieses → função de ativação sobre o resultado da 1° soma  → pesos da 2° camada + vies →  função de ativação sobre o resultado da 2° soma → saída



Pensando matematicamente, suponha uma rede neural com 2 camadas intermediárias em que a função de ativação sigmoide ($\sigma$) é aplicada para todas as equações parciais. O resultado da primeira conta (dados de entrada passando pela primeira camada intermediária) seria:



$$
f = \sigma((w_1\cdot x) + b_1)
$$



Onde $x$ é o vetor de entrada.

Em seguida, o resultado é passado adiante para a segunda camada intermediária:



$$
g = \sigma((f\cdot w_2) + b_2)
$$



Por fim, o resultado é passado para a camada de saída:



$$
y = \sigma(g \cdot w_3)+b_3)
$$





As funções de ativação mais frequentemente utilizadas são as seguintes:



$$
sigmoide(x) = \frac {1}  {1+e^{-x}} \\
ReLU(x) = \begin{cases} x & \text{se } x > 0 \\0 & \text{se } x \leq 0 \end{cases}
\\
Tanh(x) = \frac {e^x - e^{-x}} {e^x + e^{-x}}
\\
Linear(x) = x
$$



## Por que o uso de funções de ativação auxiliam nisso?

Ao utilizar uma função de ativação linear (na rede toda), a saída de cada neurônio seria simplesmente uma combinação linear das entradas. Ao fazer uso de várias camadas de neurônios com funções de ativação linear, a solução ainda não pode ser encontrada, uma vez que o resultado final ainda seria uma combinação linear das entradas originais. Em outras palavras, independentemente de quantas camadas existissem na rede, ela só seria capaz de representar relações lineares entre os dados de entrada e saída.

Ao aplicar uma função de ativação não linear após cada camada, a rede neural pode "curvar" o espaço de características, tornando possível separar e identificar padrões não lineares nos dados.

Observe este fenômeno nesta animação: [link](https://youtu.be/joA6fEAbAQc)

## Visualizando o impacto das funções nas redes

Para ajudar a visualizar o efeito de funções de ativação em conseguir classificar padrões não lineares, observe os exemplos abaixo:









Com os exemplos acima, é possível observar duas coisas:

1. Funções lineares não auxiliam a encontrar padrões não lineares nos dados

1. A função ReLU é uma das que pode ajudar a solucionar esse tipo de problema, mas não é a única.

Além disso, é válido notar que não foi mencionado quando um resultado deu certo ou não. Esse tipo de definição deve ser considerada (preferencialmente) antes das etapas de treinamento dos modelos.

### Limitações da função ReLU para tarefas de classificação

Em casos de classificação, usualmente o que se busca é um cenário onde a saída dos neurônios de saída resultem na probabilidade que uma entrada pertença a uma classe específica. Neste caso, é importante notar que a ReLU não é limitada superiormente, o que pode levar a problemas de estabilidade numérica em algumas situações, como no caso de se obter uma probabilidade, onde a soma das saídas deveria resultar em 1.

Para solucionar este problema, é possível utilizar função Softmax, que possui este formato:



$$
\sigma(z_i) = \frac{e^{z_{i}}}{\sum_{j=1}^K e^{z_{j}}} \ \ \ para\ i=1,2,\dots,K
$$



Então por exemplo, suponha que sua rede está buscando classificar entre 3 espécies de plantas. Para cada planta, a rede recebe 3 dados: altura, tamanho da pétala e tamanho da sépala (tudo em centímetros) e possui 3 neurônios na camada de saída (um para ajudar a classificar cada espécie). Suponha então que, a rede recebeu o vetor $x = [7,9,2]$ e deu como saída o vetor [9,-2,15] (ignore quantas camadas intermediárias e as funções de ativação que poderiam existir), sendo assim, a função softmax poderia ajudar a encontrar um valor que nos ajuda a identificar a probabilidade daquele exemplo de entrada pertencer a cada uma das espécies.

Para o 1° neurônio,



$$
\sigma(9) = \frac{e^9}{e^9+e^{-2}+e^{15}} \approx 0.0024 \approx 0.3\%
$$



Para o 2° neurônio,



$$
\sigma(-2) = \frac{e^{-2}}{e^9+e^{-2}+e^{15}} \approx 4.1 \cdot 10^{-8}  \approx 0\%
$$



Para o 3° neurônio,



$$
\sigma(15) = \frac{e^{15}}{e^9+e^{-2}+e^{15}} \approx 0.997  \approx 99.7\%
$$



Ao somar estas saídas, você verá que o resultado é 1. Sendo assim, softmax se torna uma ótima função para quando a tarefa é uma classificação multiclasse.

## Implementação de funções de ativação

### ReLU

Se quisermos apenas implementar a função ReLu, basta fazer uso da função maximum da biblioteca numpy.


```python
inputs = [9, -2, 15]
output = np.maximum(0, inputs)
# output: [9, 0, 15]
```



### Softmax

Ao implementar a função softmax, é necessário tomar cuidado com 2 coisas:

1. Manter as dimensões para operações de broadcasting → Quando se trabalha com arrays de maior dimensão, é importante garantir que as operações de soma mantenham a forma original do array. Isso pode ser feito utilizando o parâmetro keepdims=True ao somar as exponenciais. Assim, o array resultante mantém as mesmas dimensões, o que permite que a divisão pelo denominador ocorra corretamente sem problemas de broadcasting.


```python
inputs = np.array([[9, -2, 15],
                  [9, -2, 15]])

exp_values = np.exp(inputs)

denominators = np.sum(exp_values, axis = 1, keepdims=True)

probabilities = exp_values / denominators

print(probabilities)
#[[2.47262305e-03 4.12970104e-08 9.97527336e-01]
# [2.47262305e-03 4.12970104e-08 9.97527336e-01]]
```



1. Overflow de valores exponenciais muito grandes → Uma boa prática para resolver essa questão é subtrair o maior valor presente no vetor de entradas antes de aplicar a exponencial. Isso ajuda a evitar que os valores exponenciais fiquem excessivamente grandes, o que poderia levar a problemas numéricos.


```python
inputs = np.array([[9, -2, 15],
                  [9, -2, 15]])

exp_values = np.exp(inputs - np.max(inputs, axis=1, keepdims=True))

denominators = np.sum(exp_values, axis = 1, keepdims=True)

output = exp_values / denominators

print(probabilities)
#[[2.47262305e-03 4.12970104e-08 9.97527336e-01]
# [2.47262305e-03 4.12970104e-08 9.97527336e-01]]
```



### Exemplo de uso


```python
class DenseLayer():
	def __init__(self, n_inputs, n_neurons):
		self.weights = 0.01 * np.random.randn(n_inputs, n_neurons)  
		self.biases = np.zeros((1,n_neurons))
		
	def forward(self, inputs):
		self.output = np.dot(inputs, self.weights) + self.biases
		
class Activation_ReLU():
    def forward(self, inputs):
        self.output = np.maximum(0, inputs)
		
class Activation_Softmax():
	def forward(self, inputs):
		exp_values = np.exp(inputs - np.max(inputs, axis=1, keepdims=True))
		probabilities = exp_values / np.sum(exp_values, axis=1, keepdims=True)
		self.output = probabilities

# Cria a primeira camada densa com 2 entradas (características) e 4 neurônios
# Nota: As entradas são características dos dados, não neurônios
dense1 = DenseLayer(2, 4)

# Define a função de ativação da primeira camada como ReLU
activation1 = Activation_ReLU()

# Passa os dados de entrada pela primeira camada
dense1.forward(X)

# Aplica a função de ativação ReLU à saída da primeira camada
activation1.forward(dense1.output)

# Cria a segunda camada densa com 4 entradas (saídas da camada anterior) e 3 neurônios
dense2 = DenseLayer(4, 3)

# Define a função de ativação da primeira camada como Softmax
activation2 = Activation_Softmax()

# Passa a saída da primeira camada (após ReLU) pela segunda camada
dense2.forward(activation1.output)

# Aplica a função de ativação Softmax à saída da segunda camada
activation2.forward(dense2.output)

# Imprime as primeiras 5 saídas da função Softmax
print(activation2.output[:5])
```

