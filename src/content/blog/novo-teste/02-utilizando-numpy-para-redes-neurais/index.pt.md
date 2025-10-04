---
title: "02. Utilizando numpy para redes neurais"
slug: "02-utilizando-numpy-para-redes-neurais"
date: "2025-10-04"
tags: []
excerpt: "Numpy é uma biblioteca open-source em Python que facilita operações numéricas de maneira eficiente em grandes conjuntos de dados."
cover: "https://images.unsplash.com/photo-1545987796-200677ee1011?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb"
---

Numpy é uma biblioteca open-source em Python que facilita operações numéricas de maneira eficiente em grandes conjuntos de dados.



## Produto escalar (Dot product)

Em matemática, o produto escalar é uma operação algébrica que pega duas sequências de números de comprimento igual e retorna um único número.

Para nosso caso, é interessante entender sobre 3 tipos de produto escalar:

<details >
 <summary> Vetor e vetor </summary>

Suponha dois vetores $a$ e $b$.

$
a = [a_1, a_2, a_3]
$

$
b = [b_1,b_2,b_3]
$

O produto vetorial entre $a $ e $b$ é denotado por: $\sum(a_i \cdot b_i)$

Utilizando numpy, o resultado pode ser obtido através da declaração np.dot(a,b)

Além disso, é interessante notar que np.dot(a,b) = np.dot(b,a)

Esta operação é importante pois é a que será usada em cálculos de neurônios. 

</details>

<details >
 <summary> Vetor e matriz </summary>

Suponha um vetor $a$ e uma matriz b.

$
a = [a_1, a_2, a_3]
$

$
b = \begin{bmatrix}
b_{11} & b_{b12} & b_{b13}\\
b_{b21} & b_{b22} & b_{b23}\\
b_{b31} & b_{32} & b_{33}
\end{bmatrix}
$

Primeiramente, para entender porque o produto escalar pode ser utilizado tanto em vetores quanto em matrizes é interessante notar que um vetor (de uma dimensão) pode ser denotado como uma matriz. Por exemplo, $a$ é uma matriz de dimensões 1X3 → uma linha e 3 colunas.


Além disso, é importante notar que: 


> Uma multiplicação entre duas matrizes só e possível quando o número de colunas da matriz A  (a primeira matriz na operação) for o mesmo que o número de linhas da matriz B (a segunda matriz na operação).



Por fim, a saída esperada da operação entre um vetor e uma matriz (a ordem dos fatores aqui é importante) deve ser um vetor de $n$ valores, sendo $n$ o número de colunas na matriz.


Sendo assim, já que em multiplicação de matrizes em cada linha da matriz $A$ (que em nosso caso é o vetor $a$)  é feito um produto escalar entre $a$ e cada coluna de $b$, resultando em:


```python
= [np.dot(a1,b1), np.dot(a1,b2), np.dot(a1,b3)]
```

sendo cada $b_i$ uma coluna de $b$.

Neste cenário, há uma diferença entre np.dot(a,b)  e np.dot(b,a) .

A operação entre a matriz $b$ e o vetor $a$ possui uma pequena diferença que impacta diretamente no resultado do cálculo proposto.



Para tanto, é possível notar que não se pode simplesmente multiplicar a matriz pelo vetor como estão, pois o número de  colunas na matriz $A$ (agora representada pelo matriz $b$) é diferente do número de linhas na matriz $B$ (agora representada pelo vetor $a)$. Portanto, é aplicada a operação de transposição no vetor.



Neste cenário o resultado será uma matriz de n linhas com uma coluna, sendo n o número de colunas na matriz $A$.


```python
= [np.dot(a1,b1),
		np.dot(a1,b2),
		np.dot(a1,b3)]
```




> Quando você calcula o produto escalar entre duas matrizes, o resultado conterá o número de linhas da 1° matriz com o número de colunas da 2°.



Esta operação é importante pois é a que será usada em cálculos de camadas. 

</details>

<details >
 <summary> Matriz e matriz </summary>

Seguindo o que foi dito anteriormente, calcular o produto escalar entre duas matrizes, resulta numa matriz com o número de linhas da 1° matriz com o número de colunas da 2°.

$
a = \begin{bmatrix}
a_{11} & a_{12} & a_{13} & a_{14}\\
a_{21} & a_{22} & a_{23} & a_{24}\\
a_{31} & a_{32} & a_{33} & a_{34}\\
\end{bmatrix}
$

$
b = \begin{bmatrix}
b_{11} & b_{12} & b_{13}\\
b_{21} & b_{22} & b_{23}\\
b_{31} & b_{32} & b_{33} \\
b_{41} & b_{42} & b_{43}
\end{bmatrix}
$



$$
a \cdot b = \begin{bmatrix}
L_1 \cdot C_1  & L_1 \cdot C_2 & L_1 \cdot C_3\\
L_2 \cdot C_1 & L_2 \cdot C_2 & L_2 \cdot C_3 \\
L_3 \cdot C_1 & L_3 \cdot C_2 & L_3 \cdot C_3 \\
\end{bmatrix}
$$



Onde os $L_i$s são as linhas de $a$ e os $C_i$s são as colunas de $b$.

Esta operação é importante pois é a que será usada em cálculos de batches de dados. 

</details>

Em numpy, essas 3 contas são feitas com a mesma função: np.dot()



## Neurônios com numpy

Apenas para relembrar, a soma dos pesos junto ao viés em um neurônio foi feita anteriormente desta maneira:


```python
output = (inputs[0] * weights[0] + inputs[1] * weights[1] + inputs[2] * weights[2]) + bias
```



Aproveitando que estamos fazendo uma conta que é literalmente o produto escalar entre dois vetores, é possível simplificar o código, com o uso do de numpy, para:


```python
output = np.dot(inputs,weights) + bias
# ou
#output = np.dot(weights,inputs) + bias
```





## Camadas com numpy

O cálculo envolvendo camadas é um pouco mais complicado, já que a ordem dos fatores irá alterar tanto o resultado quando a dimensão do produto final.

### O que acontece se fizer np.dot(inputs, weights)?

Suponha que inputs é representado pelo vetor $A$, onde



$$
A = [0,2,3.5]
$$



Além disso, suponha que weights é representado pela matriz $B$, onde



$$
B = \begin{bmatrix}
5 & 6 & 9\\
2 & 1.5 & 4\\
20 & 0.2 & 1
\end{bmatrix}
$$



Anteriormente, vimos que, o produto escalar entre $A$ e $B$ (quando $A$ for uma matriz com shape $(1,n)$) resultará num vetor de $n$ valores, sendo $n$ o número de colunas na matriz.

Portanto,



$$
A \cdot B = [0,2,3.5] \cdot \begin{bmatrix}
5 & 6 & 9\\
2 & 1.5 & 4\\
20 & 0.2 & 1
\end{bmatrix} = C
$$





$$
C = [(0\times5 + 2\times2+3.5\times20),(0\times6 + 2\times1.5+3.5\times0.2),(0\times9 + 2\times4+3.5\times1)]
$$





$$
C=[74,3.7,11.5]
$$



Reparou que esse resultado não faz sentido nenhum? Ele considerou que multiplicássemos o pesos coluna por coluna. É como se, em vez de pegar os pesos relativos somente àquele nó pegássemos um peso de cada nó, para cada nó diferente.

### O que acontece se fizer np.dot(weights, inputs)?

Agora sim podemos chegar num resultado correto, veja. Considere a mesma matriz e o vetor do exemplo acima.



$$
B \cdot A = C =  \begin{bmatrix}
5 & 6 & 9\\
2 & 1.5 & 4\\
20 & 0.2 & 1 
\end{bmatrix} \cdot [0,2,3.5]
$$



Epa, isso não pode né… O número de colunas na primeira matriz (3) é diferente do número de linhas da segunda matriz (1). Basta transpormos o vetor $A$ então.



$$
B \cdot A^T = C =  \begin{bmatrix}
5 & 6 & 9\\
2 & 1.5 & 4\\
20 & 0.2 & 1 
\end{bmatrix} 
\cdot 
\begin{bmatrix}
0\\
2\\
3.5
\end{bmatrix}
$$





$$
C = \begin{bmatrix}
5\times0+6\times2+9\times3.5\\
2\times0+1.5\times2+4\times3.5\\
20\times0+0.2\times2+1\times3.5
\end{bmatrix} 
=
\begin{bmatrix}
43.5\\
17\\
3.9
\end{bmatrix} 
$$



Aqui, você não precisa explicitar para o numpy que $A$ é transposto.

### O que acontece se fizer np.dot(inputs, weights.T)?

Olha que bacana, transpor a matriz de pesos e realizar a primeira conta que vimos dá no mesmo resultado que np.dot(weights,inputs).



## Batches de dados

Um lote (batche) de dados pode ser definido como um conjunto de dados que foram agrupados num intervalo específico.
Por exemplo, suponha que o seu modelo irá aprender por meio de aprendizado supervisionado com base nos seguintes dados:


<table class="custom-table">
 <thead>
  <tr>
   <th>Nome do bairro</th>
   <th>Tamanho da casa (m2)</th>
   <th>Preço da casa</th>
  </tr>
 </thead>
 <tbody>
  <tr>
   <td>Bairro1</td>
   <td>450</td>
   <td>500.000,00</td>
  </tr>
  <tr>
   <td>Bairro2</td>
   <td>370</td>
   <td>575.000,00</td>
  </tr>
  <tr>
   <td>Bairro2</td>
   <td>420</td>
   <td>668.000,00</td>
  </tr>
  <tr>
   <td>Bairro1</td>
   <td>400</td>
   <td>390.000,00</td>
  </tr>
</tbody>
</table>



A cada época de treinamento uma linha poderia representar uma instância do lote. Dessa forma, o modelo ajusta seus parâmetros com base em diferentes subconjuntos de dados, fornecendo uma melhor generalização.

Mas, além disso, mais de uma linha “ao mesmo tempo” poderia ser usada para representar uma instância de lote. O termo em inglês que se refere ao tamanho de um lote é batch size.

### Calculando batches de dados com numpy

Vamos supor que temos um batch de n instâncias. As entradas x ara um batch seriam representadas como uma matriz X onde cada coluna é uma instância de dados. Se cada instância de dados tem 2 features (como no exemplo acima Bairro1 e 450), a matriz X teria a seguinte forma:



$$
X = \begin{bmatrix}
x_{11} & x_{12} & \cdots & x_{1n} \\ 
x_{21} & x_{22} & \cdots & x_{2n}
\end{bmatrix}
$$



Considerando o exemplo acima, se quiséssemos fazer a passagem dos valores para a rede treinar de 2 em dois poderíamos considerar que isso seria uma multiplicação de matrizes, sendo cada linha da primeira matriz uma instância de dados e seus respectivos atributos e a outra matriz os pesos associados a cada tipo de atributo.


Para ilustrar melhor nosso caso, vamos considerar que o Bairro1 é representado pelo número 0 e Bairro2 pelo número 1 e que estamos numa primeira interação de treinamento → o resultado da multiplicação não precisa acertar o preço da casa certinho, as etapas de treinamento serão explicadas posteriormente.

Portanto, considere 3 matrizes sendo $A$ a matriz com o batch de dados do treinamento atual, $B$ a matriz com os pesos atuais e $C$ a matriz de vieses (que em sua essência é um vetor).



$$
A = \begin{bmatrix}
0 & 450\\
1 & 370\\
\end{bmatrix}
\
B = \begin{bmatrix}
2.7 & 9.1 \\
4.1 & 0.2 \\
2.9 & 4.7 
\end{bmatrix}
\
C = [2,3,9]
$$



Estão sendo postas 2 instâncias de dados para uma camada na rede que possui 3 neurônios

É possível notar que o produto escalar das duas primeiras matrizes não é possível, uma vez que o número de colunas da matriz $A$ é diferente do número de linhas na matriz $B$.

Para tanto, a matriz de pesos é transposta



$$
B^T = \begin{bmatrix}
2.7 & 4.1 & 2.9\\
9.1 & 0.2 & 4.7\\
\end{bmatrix}
$$





$$
A \cdot B^T = 
\begin{bmatrix}
0\times2.7 + 450 \times 9.1 & 0\times4.1 + 450 \times 0.2 & 0\times2.9 + 450 \times 4.7 \\

1\times2.7 + 370 \times 9.1 & 1\times4.1 + 370 \times 0.2 & 1\times2.9 + 370 \times 4.7 \\
\end{bmatrix} 
\ = 
\begin{bmatrix}
4095 & 90 & 2115\\
3369.7 & 78.1 & 1741.9
\end{bmatrix} 
$$



O i-ésimo elemento nesta matriz é relativa a saída do neurônio para j-ésimo batch de dados. Sendo assim, o elemento [0][0] aqui é a saída do 1° neurônio no 1° batch de dados. 



$$
(A \cdot B^T) + C = 
\begin{bmatrix}
2 + 4095  & 3 + 90  & 9 + 2115\\
2 + 3369.7 & 3 + 78.1 & 9 + 1741.9
\end{bmatrix}
\ = 
\begin{bmatrix}
4097  & 93  & 2124\\
3371.7 & 81.1 & 1750.9
\end{bmatrix}
$$




```python
inputs = [[0.0, 450.0], # 1° batch
          [1.0, 370.0]] # 2° batch

weights = [[2.7, 9.1], # pesos do 1° neurônio
           [4.1, 0.2], # pesos do 2° neurônio
           [2.9, 4.7]] # pesos do 3° neurônio

biases = [2.0, 3.0, 9.0]

layer_outputs = []

layer_outputs = np.dot(inputs, np.array(weights).T)

print(layer_outputs)
# [[4095.    90.  2115. ]
# [3369.7   78.1 1741.9]]

print(layer_outputs + biases)
# [[4097.    93.  2124. ]
# [3371.7   81.1 1750.9]]
```



[https://youtu.be/ocrXqFCW3WE](https://youtu.be/ocrXqFCW3WE)

