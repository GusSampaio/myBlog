---
title: "04. Dados não lineares e camadas densas "
slug: "04-dados-no-lineares-e-camadas-densas-"
date: "2025-07-24"
tags: []
excerpt: "Considere que, ao mencionar “linear” e “não linear” aqui estou falando sobre a possibilidade de separação entre estes dados."
cover: "https://images.unsplash.com/photo-1545987796-200677ee1011?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb"
---

# Linearidade e não linearidade de dados

Considere que, ao mencionar “linear” e “não linear” aqui estou falando sobre a possibilidade de separação entre estes dados.

Veja por exemplo o conjunto de dados abaixo:

![Fonte: ](https://res.cloudinary.com/dekxrmlbg/image/upload/v1753372704/xbsdkk7dvuxwkk73k1ds.png)



Perceba que é evidente que existe uma linha, ou melhor, infinitas linhas que podem separar estes dados de duas maneiras diferentes, sendo elas azul ou laranja. Se essa linha existe, então o dataset é considerado linearmente separável. 

Perceptrons e Redes neurais multicamadas podem aprender as linhas que cortam esse eixo, onde além disso, existem estruturas mais simples que podem também resolver este problema de maneira rápida e ideal, como por exemplo SVMs.



Agora, e se nosso conjunto de dados parecesse com algo assim?

![Conjunto de dados em espiral. Fonte: ](https://res.cloudinary.com/dekxrmlbg/image/upload/v1753372704/vlb9lsqeogyrdo4mcgqw.png)



Não existe uma única linha que possa cortar as duas classes existentes em duas áreas diferentes ao mesmo tempo, ou seja, em qualquer linha traçada nunca haverá um caso em que “de um lado” estejam todas as laranjas e “de outro lado” todas as azuis.



Dados lineares são fáceis de modelar (e de treinar), no entanto, poucas coisas em nossas vidas seguem padrões puramente lineares. Para tanto, redes neurais são estruturas idealmente utilizadas em casos como o de cima (mas não a única estrutura possível).

Além disso, é importante que se comece a trabalhar com estes tipos de dados.



Já que ficar criando conjuntos de dados, instância após instância, demanda tempo e para este caso, é entediante, começarei a trabalhar com conjuntos de dados já existentes. Alguns deles podem ser encontrados através da biblioteca nnfs :


```python
import nnfs
from nnfs.datasets import spiral_data
import numpy as np
import matplotlib.pyplot as plt

nnfs.init()
X, y = spiral_data(samples=100, classes=3)
plt.scatter(X[:, 0], X[:, 1])
plt.show()
```



É para o dataset gerar algo parecido com isso: 

![Imagem](https://res.cloudinary.com/dekxrmlbg/image/upload/v1753372704/iuivmfk8aaoqgl6fgnzr.png)




É também possível observar as cores de cada uma das bolinhas, representando as diferentes classes em cada instância:


```python
plt.scatter(X[:, 0], X[:, 1], c=y, cmap='brg')
plt.show()
```



![Imagem](https://res.cloudinary.com/dekxrmlbg/image/upload/v1753372705/up4qep2qbhuk7caibsie.png)



Note que, do que jeito que se está fazendo agora, a rede neural  não aprenderia essas cores, uma vez que essa informação não estaria sendo passada diretamente.

## Limitação do Perceptron

O objetivo do Perceptron é tentar ajustar os pesos e o bias durante o treinamento para encontrar uma linha (no caso de 2D), um plano (no caso de 3D), ou um hiperplano (em dimensões superiores) que separa as duas classes de dados. Este hiperplano é linear porque ele é descrito pela equação da soma ponderada. Se os dados não são linearmente separáveis, não existe uma linha reta ou hiperplano que consiga separar as duas classes de maneira perfeita. O perceptron, por ser um modelo linear, não é capaz de capturar relações mais complexas entre as variáveis. Ele apenas ajusta uma linha reta, e se os dados estiverem distribuídos de forma não linear (como em um padrão em espiral ou XOR), o perceptron falhará em classificar corretamente.



Se lembra da step function mencionada anteriormente?



$f(x) =\begin{cases} 1 & \text{se } z \geq 0 \\0 & \text{se } z < 0 \end{cases}$



Perceba que, o que o Perceptron precisa aprender, para este caso, é a representação de pesos que satisfazem a equação $z=0$, isto é:



$(\sum x_i \cdot w_i) + b = 0$



Note que essa equação define um hiperplano no espaço de entradas $x_i$. A geometria deste hiperplano é linear por definição, sendo assim, ela só pode separar os dados de entrada em duas “metades” com uma linha reta. Como resultado, o perceptron só pode separar os dados se houver uma única fronteira linear que os divide perfeitamente. Para saber mais sobre, vale a pesquisa sobre o Teorema da Convergência de Novikoff.

# Camada densa

Existem diferentes tipos de camadas que podem ou não serem inseridas numa rede neural. 

Formalmente, uma camada densa (ou fully connected layer) em uma rede neural é uma camada onde cada neurônio está conectado a todos os neurônios da camada anterior, como já visto anteriormente. Isso significa que cada neurônio recebe como entrada todas as saídas dos neurônios da camada anterior, multiplicadas por pesos e, em seguida, passa por uma função de ativação.

## Exemplo de funcionamento

Digamos que você tenha uma camada densa com 3 neurônios, e a camada anterior tenha 4 neurônios. Cada um dos 3 neurônios na camada densa receberá 4 entradas (uma de cada neurônio da camada anterior), além também de associar valores aleatórios de pesos para cada uma dessas conexões e também para os viéses presentes em cada neurônio.

Ao fim, cada neurônio gera uma saída, que se torna a entrada para a próxima camada da rede neural.



Então, o objetivo aqui é criar uma classe capaz de instanciar uma camada densa considerando o número de neurônios na camada anterior e o número de neurônios que é para ter nela.

É importante notar que a partir de agora para evitar reescrever pormenores, o vetor de pesos $W$ será sempre considerado como o vetor de pesos transposto $W^T$. Isto é, $W = W^T$. 
Portanto, cada coluna agora é relativa aos pesos dos neurônios: 



$W = \begin{bmatrix}
w_{11} & w_{21} & w_{31}\\
w_{12} & w_{22} & w_{32}\\
w_{13} & w_{23} & w_{33} \\
w_{14} & w_{24} & w_{34}
\end{bmatrix}$



Então, se possuírmos um neurônio que possui os pesos como na imagem abaixo, $W = \begin{bmatrix}
2.7\\
4.1\\
2.9
\end{bmatrix}$.

![Imagem](https://res.cloudinary.com/dekxrmlbg/image/upload/v1753372705/sjic2mhkjplkb2ov61sr.png)



Por consequência disso, np.dot(inputs, np.array(weights).T) + bi se torna np.dot(inputs, weights) + bi. 


```python
class DenseLayer():
	
	def __init__(self, n_inputs, n_neurons):
		# Criação da matriz no formato inputs x neurons com uma distribuição gaussiana aleatória
		# para cada elemento na matriz
		
		# Inicialização dos pesos
		self.weights = 0.01 * np.random.randn(n_inputs, n_neurons)  
		
		self.biases = np.zeros((1,n_neurons))
	
	# Passagem de pesos calculados
	def forward(self, inputs):
		self.output = np.dot(inputs, self.weights) + self.biases

# Exemplo de camada densa recebendo 3 neurônios e possuindo 4 neurônios
layer = DenseLayer(3, 4) 
```



