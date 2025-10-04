---
title: "01. Neurônios e Camadas"
slug: "01-neurnios-e-camadas-"
date: "2025-07-24"
tags: []
excerpt: "Este conteúdo espera que a pessoa leitora saiba o básico de python e o paradigma de orientação a objeto."
cover: "https://images.unsplash.com/photo-1545987796-200677ee1011?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb"
---




Este conteúdo espera que a pessoa leitora saiba o básico de python e o paradigma de orientação a objeto.

<details>
Abaixo vão algumas definições para que seja possível compreender os tópicos descritos a seguir:

- Dados de entrada

- Predição/Inferência

- A predição sempre está certa?

- Como uma rede aprende?
</details>

<details>
  <p>Conteúdo interno visível apenas quando expandido.</p>
</details>



## Teoria histórica sobre neurônios artificiais

Se você por apresentado a imagens de gatos e cachorros, ou então a carros danificados e  outros em perfeito estado é muito provável que você consiga identificar essas diferentes classes em pouquíssimo tempo.

Isto se dá pelo sofisticado funcionamento existente nos nossos cérebros, uma vez que, com ele podemos aprender infinitos padrões diferentes ao mesmo tempo em que temos a habilidade de construí-los também.

### Funcionamento do cérebro e perceptrons

O cérebro humano consiste (resumidamente) em aproximadamente 86 bilhões de pontos interconectados. Pontos estes que conhecemos como neurônios, formando assim uma rede neural biológica. 
Cada neurônio humano possui 3 partes principais: Dentritos, Núcleo e Axônios.

- Os dentritos são responsáveis por receber mensagens de outros atores sensoriais do corpo e/ou outros neurônios;

- O núcleo agir como uma unidade processadora destas informações recebidas pelos dentritos daquele neurônio;

- Os axônios recebem a informação processada pelo núcleo e transmite isso ao próximo neurônio.

![Neurônio.](https://res.cloudinary.com/dekxrmlbg/image/upload/v1753372693/zdrrevpdgxudqvtqnoge.png)



A troca de sinais via sinapses (impulsos nervosos) é o fator responsável por uma das características mais importante para um ser vivo, o aprendizado. Esta construção que  de redes neurais existente em nossos cérebros proporciona a capacidade de assimilarmos fatos e informações a fim de traçar possíveis generalizações e construção de conhecimento sobre o mundo ao nosso redor. 

Os neurônios artificiais (e por consequência também, as redes neurais) tentam “imitar” o funcionamento nervoso humano através de construções puramente matemáticas de processamento de informação afim de construir modelos para resolver tarefas como classificação, agrupamento, entre outras.



### Neurônios artificiais e Perceptrons

O neurônio artificial é um modelo matemático, que mapeia entradas e saídas. A primeira tentativa de ser realizado um modelo deste tipo aconteceu em 1943 através do chamado modelo McCulloch-Pitts (pois foi idealizado através de um estudo entre Warren Sturgis McCulloch e Harry Pitts Jr.) baseado em matemática e algoritmos denominados lógica de limiar . Em 1958, Frank Rosenblatt introduziu a ideia de um modelo com mudanças cruciais para o desenvolvimento desta tecnologia presentes no artigo “The perceptron: A probabilistic Model for Information Storage and Organization in the Brain”, que tenta replicar o comportamento de um neurônio biológico. 

Nos neurônios reais, o dendrito recebe sinais elétricos provenientes dos axônios de outros neurônios. Esses sinais elétricos são transmitidos ao longo do neurônio e influenciam seu comportamento. No Perceptron, esses sinais elétricos são representados por valores numéricos, permitindo uma interpretação mais precisa e matemática dos processos biológicos.

Nas sinapses, que são as junções entre os dendritos e os axônios, os sinais elétricos são modulados em várias quantidades para transmitir a informação corretamente. Este processo de modulação é feito no Perceptron através da multiplicação de cada valor de entrada por um coeficiente específico, chamado de peso. Os pesos determinam a importância de cada entrada e ajudam a ajustar o comportamento do Perceptron.

Além disso, um neurônio real dispara um sinal de saída apenas quando a força total dos sinais de entrada supera um determinado limiar, o que é crucial para o funcionamento do sistema neural. No Perceptron, modelamos esse fenômeno calculando a soma ponderada das entradas, que representa a força total dos sinais recebidos. Em seguida, aplicamos uma função de ativação a essa soma para determinar se a saída será ativada ou não. Essa função de ativação pode variar, mas seu propósito é simular o comportamento de disparo do neurônio real, garantindo que o Perceptron funcione de maneira similar a um neurônio biológico.

A função principal do Perceptron é realizar cálculos para detectar features ou padrões nos dados de entrada, tornando-se uma ferramenta fundamental no aprendizado de máquina.

## Neurônio (neurons)

Um neurônio funciona como uma unidade matemática que aceita um número pré-definido de inputs (entradas) e tem um ou mais outputs (saídas) associadas a ele. 

A conta relacionada a um perceptron consiste numa camada de entrada e um valor de saída. Os dados (que a este ponto já devem estar em formato numérico) são passados através da camada de entrada e multiplicados por cada peso (weight) associado e adicionado a um valor de viés (bias).

É válido notar que o número de inputs  não possui necessariamente um limite, ou seja, você pode dar quantos de entrada quiser, considerando que eles estejam de acordo com o resto da estrutura da rede.

O neurônio abaixo possui 3 entradas (cada $w_i$) e uma saída $(\sum x_i \cdot w_i) + b$

![Imagem](https://res.cloudinary.com/dekxrmlbg/image/upload/v1753372693/nyvc2hkepw05vouf2tff.png)




```python
inputs = [1, 2, 3]
weights = [0.2, 0.8, -0.5] # cada 'coluna' no vetor é um peso relacionado ao neurônio 
bias = 2

output = (inputs[0] * weights[0] + inputs[1] * weights[1] + inputs[2] * weights[2]) + bias
#output: 2.3
```



O peso associado a uma entrada pode ser entendido como a importância daquela entrada, isto é, quanto maior o peso, mais importante aquele parâmetro é para prever o resultado de maneira correta.

O resultado dessa saída é então passado para uma função de ativação, decidindo se o neurônio será ativado ou não. 

Por exemplo, suponha que você tenha criado uma função que considera que sempre que um valor de entrada for maior ou igual a 3, a função de ativação mapeia a sua saída para 1, em caso contrário resulta em zero.



$f(x) =\begin{cases} 1 & \text{se } x \geq 3 \\0 & \text{se } x < 3 \end{cases}$



No caso do exemplo de código, o output seria 0, já que a soma ponderada somada ao viés resulta num valor inferior a 3 (2.3 < 3). 



O perceptron clássico utiliza uma função de ativação conhecida como função degrau (step function), adequada para tarefas de classificação binária. 



$f(x) =\begin{cases} 1 & \text{se } z \geq 0 \\0 & \text{se } z < 0 \end{cases}$



Neste caso, $z$ é a soma ponderada das entradas somada ao viés. Neste sentido, a função mapeia os valores de entrada para uma saída binária de 0 ou 1.

No entanto, o conceito de “Perceptron” pode ser estendido para abarcar funções de ativação diversas. Essas outras funções de ativação permitem ao modelo lidar com problemas mais complexos e introduzir não linearidades essenciais para aprender representações ricas dos dados.

### Camadas (layers)

O grande poder em redes neurais artificiais está na possibilidade de arranjar diferentes neurônios em camadas. Ao adicionar alguns neurônios numa camada única.

Abaixo é possível observar uma camada de 3 neurônios, cada neurônio possuindo 4 entradas e uma saída.

![Imagem](https://res.cloudinary.com/dekxrmlbg/image/upload/v1753372695/l2gihdmskac4esd0yymu.png)




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



Perceba que cada neurônio possui a mesma conta citada anteriormente $(\sum x_i \cdot w_i) + b$, mas com os pesos relativos somente àquele neurônio. 

Portanto agora a conta apropriada seria $(\sum x_{ij} \cdot w_i) + b)$ → agora o valor dos pesos pode ser acessado numa estrutura de matriz.


```python
# Outro formato de calcular a somatória utilizando a função sum()
for weight, bias in zip(weights, biases):
    output = sum(i * w for i, w in zip(inputs, weight)) + bias
    layer_outputs.append(output)
```



Além disso, é extremamente importante perceber como o vetor de pesos está posicionado, já que a i-ésima linha na matriz é (por enquanto) um peso relacionado ao i-ésimo neurônio.



$B = \begin{bmatrix}
w_{11} & w_{12} & w_{13}\\
w_{21} & w_{22} & w_{11}\\
w_{31} & w_{32} & w_{33}
\end{bmatrix}$



Isso poderá gerar erros ao multiplicar a matriz de entrada pela de pesos.