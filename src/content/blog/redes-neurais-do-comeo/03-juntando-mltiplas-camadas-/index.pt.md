---
title: "03. Juntando múltiplas camadas "
slug: "03-juntando-mltiplas-camadas-"
date: "2025-07-24"
tags: []
excerpt: "Até o momento, estivemos olhando apenas para camadas singulares, isto é, não construindo uma rede multicamadas propriamente dita."
cover: "https://images.unsplash.com/photo-1545987796-200677ee1011?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb"
---

Até o momento, estivemos olhando apenas para camadas singulares, isto é, não construindo uma rede multicamadas propriamente dita. 

O que pode ser considerado até um desperdício, pois o real poder de uma rede neural pode vir quando são conectadas camadas horizontalmente na mesma rede. 



### Pra que mais camadas?

Uma camada oculta (hidden layer) no contexto de redes neurais se refere a uma camada de neurônios que não é nem a saída final e nem a camada de entrada. Quanto mais camadas ocultas mais profunda a rede é, daí que vem o termo Deep Learning o que em português é traduzido como aprendizado profundo.

### Papel de camadas ocultas

A função principal das camadas ocultas é transformar as entradas em algo que a camada de saída possa usar. Cada neurônio em uma camada oculta recebe entradas de todos os neurônios da camada anterior, multiplica essas entradas por seus pesos, adiciona um termo de polarização e então passa o resultado por uma função de ativação. A saída de cada neurônio é usada como entrada para a próxima camada. (falarei mais sobre funções de ativação e polarização nos próximos tópicos). Este processo permite que a rede aprenda relações não lineares entre os dados de entrada e saída.

![Exemplo de problema de classificação não linear [Fonte: ](https://res.cloudinary.com/dekxrmlbg/image/upload/v1753372700/grcvnw45mcbvunwyk6yz.png)



### Exemplo de aplicação

A arquitetura analisada agora é uma rede com 3 camadas → 1 de entrada e duas ocultas. 

![Imagem](https://res.cloudinary.com/dekxrmlbg/image/upload/v1753372700/lyhhuuft2qlahjra1rnl.png)



Perceba na imagem acima como se dá o fluxo de dados:

1. Estamos considerando um batch_size de 2, isto é, cada vez que os dados forem calculados serão analisados duas entradas distintas → só que “ao mesmo tempo”;

1. Os dados de entrada então são passados pelos pesos da 1° camada oculta, ponderados e somados ao viés daquela camada.

1. O resultado de cada neurônio da 1° camada oculta é passado para a 2° camada onde enfim, após os respectivos cálculos, é obtida a saída em cada neurônio.

Na imagem, a única conexão explicitamente desenhada está entre os primeiros neurônios de cada camada. Note que isso não será a única conta existente, cada neurônio está conectado com todos os neurônios de cada camada anterior. As reais conexões na rede seriam parecidas com as mostradas na imagem abaixo:

![Rede neural artificial multicamadas [Fonte: ](https://res.cloudinary.com/dekxrmlbg/image/upload/v1753372701/fkmdh7chdckz9nj83el6.png)



O código que explicita o exemplo citada segue abaixo:


```python
inputs = np.array([[0, 450.0, 3, 1],
                    [1, 370, 5, 7]], dtype=float) 

weights_1 = np.array([[0.2, 0.8, -0.5, 1],
                    [0.5, -0.91, 0.26, -0.5],
                    [-0.26, -0.27, 0.17, 0.87]], dtype=float)

biases_1 = np.array([2.0, 3.0, 9.0], dtype=float)

weights_2 = np.array([[0.1, -0.14, 0.5],
                    [-0.5, 0.12, -0.33],
                    [-0.44, 0.73, -0.13]], dtype=float)

biases_2 = np.array([-1, 2, -0.5], dtype=float) 

S1 = np.dot(inputs, np.array(weights_1).T) + biases_1
S2 = np.dot(S1, np.array(weights_2).T) + biases_2

print(S1)
# [[ 361.5  -406.22 -111.12]
# [ 302.7  -335.4   -84.22]]

print(S2)
# [[  36.4608 -190.8268 -441.655 ]
# [  34.116  -161.8054 -367.5814]]
```



