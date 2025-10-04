---
title: "06. Funções de perda "
slug: "06-funes-de-perda-"
date: "2025-07-24"
tags: []
excerpt: "Imagine que você acabou de construir uma rede neural."
cover: "https://images.unsplash.com/photo-1545987796-200677ee1011?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb"
---

# Intuição para loss em classificação

Imagine que você acabou de construir uma rede neural. Definiu o formato de entrada dos dados, configurou a arquitetura com camadas intermediárias e atribuiu funções de ativação a cada uma delas. Nesse ponto, a rede está pronta para fazer previsões a partir dos dados de entrada. No entanto, como os pesos e vieses foram inicialmente definidos de forma aleatória, é altamente improvável que as primeiras previsões sejam corretas.



Isso acontece porque, com valores aleatórios, a rede não "aprendeu" quais pesos e vieses são mais adequados para mapear corretamente a entrada aos resultados esperados. Para que a rede possa melhorar suas previsões, é fundamental ter uma métrica que quantifique o quão distante ou "errada" está a saída da rede em relação ao valor real.

É para isso que serve a loss function (função de perda). Ela mede o erro entre a previsão da rede e o valor correto, fornecendo uma espécie de feedback que indica o quanto a rede precisa ajustar seus pesos. Assim, a função de perda "mostra" para a rede o quão incorretas estão suas previsões, orientando o processo de aprendizado durante o treinamento.

# Entropia Cruzada Categórica 

A função de perda Categorical Cross-Entropy (ou Entropia Cruzada Categórica) é amplamente utilizada em redes neurais para problemas de classificação multi-classe, onde a tarefa é prever a probabilidade de uma amostra pertencer a uma entre várias categorias. Essa função mede a diferença entre a distribuição de probabilidade prevista pela rede e a verdadeira distribuição de rótulos.



Em problemas de classificação, a rede neural gera uma saída que representa as probabilidades associadas a cada classe. Isso geralmente é feito após a aplicação de uma função de ativação softmax na camada final, o que transforma as saídas da rede em probabilidades que somam 1.


Por exemplo, para um problema de classificação com três classes (como o que foi visto no capítulo anterior), a saída da rede pode ser algo como [0.1, 0.7, 0.2], indicando que a rede estima que a classe mais provável é a segunda. O rótulo verdadeiro, por outro lado, é representado como [0, 1, 0], que indica que a amostra pertence de fato à classe 2.




A entropia cruzada categórica é calculada usando a seguinte fórmula:



$-\sum_{i=1}^Cy_i\log(p_i)$



Onde:

- $C$ é o número de classes possíveis

- $log$ é o log natural

- $y_i$ é valor real (1 para a classe correta, 0 para as demais) – correspondente ao vetor one-hot.

- $p_i$ é a probabilidade prevista pela rede para a classe $i$

Deste modo, a entropia cruzada categórica consegue punir a rede conforme o quanto ela está errando. Neste cenário, se a rede está muito confiante em uma previsão errada (por exemplo, prevê uma classe com 90% de confiança quando a verdadeira classe está em outra categoria), o valor da perda será alto. Por outro lado, se a rede prevê corretamente ou se aproxima da classe correta, o valor da perda será menor. Esse erro é então retropropagado pela rede, ajustando os pesos para melhorar as previsões. A retropropagação será vista com maiores detalhes em conteúdos posteriores a esse.