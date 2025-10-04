---
title: "07. Backpropagation "
slug: "07-backpropagation-"
date: "2025-07-24"
tags: []
excerpt: "Até agora vimos como uma rede neural é capaz de produzir uma resposta, dado uma entrada, aplicamos diversas somas, multiplicações por pesos, e até diferentes funções de ativação para chegar em uma resposta."
cover: ""
---

Até agora vimos como uma rede neural é capaz de produzir uma resposta, dado uma entrada, aplicamos diversas somas, multiplicações por pesos, e até diferentes funções de ativação para chegar em uma resposta.

Mas não é qualquer combinação de números de somas e multiplicações que vão nos dar a resposta correta, muito pelo contrário, a maioria das combinações de números aleatória dará resultados bem decepcionantes. Mas, mesmo errando, com um pouquinho de matemática conseguimos aprender com esse erro e, a partir desse aprendizado, ajustar esses números para nos aproximarmos da resposta correta. Esse processo é o que chamamos de backpropagation.

## Analogia

Pense no seguinte cenário:

1.  Você e mais dois amigos (Jorge e João) ficaram de recuperação em uma matéria, e o professor decidiu aplicar uma prova bem diferente. Ele faria a mesma pergunta de verdadeiro ou falso para duas pessoas que falariam para a terceira a resposta, e esta responderia pelos três. O professor então falaria se a resposta estava certa ou não.

1. Como você era o que tinha menos estudado, você ficou responsável por responder enquanto que seus colegas iriam ouvir as perguntas.

1. Na primeira pergunta Jorge falou verdadeiro e João falou falso, de forma meio aleatória, você decidiu confiar em Jorge, mas o professor falou que infelizmente, vocês erraram a questão.

1. Nesse momento, você que não é bobo nem nada, aumentou a sua confiança em João, já que ele acertou e começa a duvidar um pouco de Jorge para as questões que estão por vir. Ao mesmo tempo, Jorge analisa o porquê errou e se prepara melhor para tentar acertar nas próximas ajustando a sua confiança em diferentes livros que estudou ou até mesmo na sua intuição, enquanto João sente um arzinho de superioridade e relaxa, sem fazer nada.

Esse processo continua para as próximas questões, até que você consiga ponderar em relação as respostas de Jorge e João a medida que elas vem chegando a fim de conseguir acertar o máximo de perguntas possíveis. 



É importante notar neste exemplo a semelhança dessa prova à uma rede neural. 

- Você é o último neurônio, que dará as respostas 

- João e Jorge são os neurônios internos (hidden layer), 

- A confiança que você tem na resposta de cada um, inicialmente aleatória, são os pesos relacionados àqueles neurônios

- Os conhecimentos prévios de João e Jorge e a pergunta do professor são a camada de entrada

- A importância que eles dão a cada fonte são os seus pesos

- Os processos de João e Jorge analisarem a pergunta e te darem uma resposta  seria a etapa de forward 

- Tanto o seu processo de ajustar as confianças, quanto o de Jorge e João ajustarem seus conhecimentos, são vistos como o processo de backpropagation.




<NotionToggle title="Ajustando pesos" id="toggle-07-backpropagation--0">

Agora precisamos saber como fazer para ajustar os pesos de forma que nossa rede neural consiga acertar mais, sem gastarmos muito processamento nisso.

1. Estratégia 1: A cada iteração, aleatoriamente escolher novos pesos até dar certo. Essa é uma das formas mais simples, bem fácil de codar e visualizar, mas apenas com muita sorte e muito tempo, pode acabar dando certo, ou seja, não é útil para nós.

1. Estratégia 2: Começar com pesos aleatórios e aleatoriamente aumentar ou diminuir eles. Caso essa alteração melhore o seu acerto, mantenha a mudança, caso não, descarte. Essa estratégia ainda continua relativamente simples, mas já tem um desempenho muito superior à primeira, pois ao menos o progresso adquirido em iterações anteriores é aproveitado, mas ainda é possível melhorar.

1. Estratégia 3: Começar com pesos aleatórios e aumentar ou diminuir eles de acordo com o seu gradiente. Como as redes neurais, e principalmente a função de erro, não passam de aglomerados de funções matemáticas, fazemos usando de uma de suas propriedades, o gradiente, para descobrir quais pesos aumentar e quais diminuir para diminuir o valor do erro. Essa é a estratégia no qual o backpropagation que conhecemos se baseia.



</NotionToggle>


<NotionToggle title="Gradientes, derivadas e regra da cadeia, a matemática por trás do backpropagation" id="toggle-07-backpropagation--1">

Como vimos, o backpropagation faz uso do gradiente para saber a melhor forma de se ajustar os pesos de uma rede neural, então agora, precisamos entender o funcionamento, a lógica por trás desse tal do gradiente, que nada mais é do que um conjunto de derivadas de uma função.


<NotionToggle title="Derivadas" id="toggle-07-backpropagation--3-0">

Derivada representa a medida de como uma mudança em uma variável afeta uma função, estando diretamente relacionada com a inclinação da reta tangente à função em um determinado ponto.

Muitas palavras complicadas, mas vamos começar simples, utilizando uma equação de reta ax + b. Para quem não lembra, a inclinação de uma reta é dada pelo termo a da equação.

 Temos por exemplo a função 



$$f(x) = 2x +1$$

![Imagem](https://res.cloudinary.com/dekxrmlbg/image/upload/v1753372714/dc5ufqr9gejoayfwfo1t.png)

Sua inclinação é 2, o que indica que para cada aumento no valor de x, y aumentará em dobro. No gráfico por exemplo, aumento x em uma unidade aumentou y em duas.

No caso de funções mais complexas que uma reta, essa relação não se manteria, pois muito provavelmente o valor da derivada se alteraria conforme x aumentasse ao invés de ser constante, mas ainda assim a intuição de que naquele ponto, a função está tendendo a crescer com uma magnitude de 2 ainda vale.

Para encontrar a derivada de funções mais simples, podemos usar a fórmula



$$\frac{d}{dx}ax^n = nax^{n-1}$$

Em que d/dx é a notação de derivada em relação à x.

Assim, para se a função



$$f(x)=x^2$$

teremos uma inclinação que altera em função de 2x (para o ponto de x = 1, a inclinação vale 2 por exemplo, x= 2 vale 4 e por aí vai).

![Inclinação do ponto (1,1) vale um, representada pela reta em vermelho. Inclinação do ponto (2,4) vale 2, representada pela reta verde](https://res.cloudinary.com/dekxrmlbg/image/upload/v1753372716/n5zsoh3qlwziuwjysior.png)

Essa inclinação é muito útil para conseguirmos encontrar o mínimo de uma função. Se ela for positiva, saberemos que ao menos na vizinhança daquele ponto, a função é crescente, ou seja,  incrementos no valor de x aumentarão o valor de f(x), então para achar o mínimo, precisamos diminuir o x. 

No caso de derivadas negativas,  a função é decrescente perto desse ponto, ou seja,  incrementos no valor de x diminuirão o valor de f(x), então para achar o mínimo, precisamos aumentar o x.

Note que com derivada positiva, aumentos no valor de x aumentam a função, enquanto que uma derivada negativa precisamos diminuir o x para ter esse efeito, ou seja, a derivada indica a direção de mudança de x que aumenta a função.

Em uma rede neural, isso seria útil para descobrirmos se queremos aumentar ou diminuir dado peso de forma a minimizar a função de erro.

Além do sinal, o valor dessa derivada nos permite chutar o quanto tempo a tendência de crescimento ou de decrescimento irá durar. Valores em módulo muito alto indicam uma alta inclinação, e para essa tendência mudar(ir de crescimento para decrescimento e vice-versa), teríamos que ir desse valor alto até o 0 para só então trocar o sinal.

 Isso impacta na hora de mudarmos os pesos, com valores altos de derivada, temos mais confiança para fazer maiores alterações nos pesos, enquanto que com valores menores fazemos pequenas mudanças.

Só tem um pequeno probleminha no que vimos até agora, tudo se aplica a uma variável, enquanto que na nossa rede neural normalmente não temos apenas um peso x, mas sim x,y,z,w… . Para tratar isso, fazemos uso do gradiente, e consequentemente de derivadas parciais.



</NotionToggle>

<NotionToggle title="Derivadas parciais e gradiente" id="toggle-07-backpropagation--3-1">

### Derivadas parciais

As derivadas parciais são utilizadas quando a nossa função depende de mais de uma variável, para descobrirmos o impacto individual de uma variável.

No caso da função



$$f(x,y,z)$$

teremos três derivadas parciais, uma para cada variável(note que a notação mudou de d para  δ)



$$\frac{\partial}{\partial x}f(x,y,z), \frac{\partial}{\partial y}f(x,y,z),\frac{\partial}{\partial z}f(x,y,z)$$

Para calcular essas derivadas parciais, simplesmente tratamos os termos que não são dependentes da variável analisada como constantes. Lembrando que para derivadas simples



$$\frac{d}{dx}ax^n = nax^{n-1}$$

E a constante é o termo a


<NotionToggle title="Exemplo" id="toggle-07-backpropagation--2-0">

Temos a função



$$f(x,y) = 2x + 3y^2$$

A derivada parcial em relação a x será



$$\frac{\partial}{\partial x}(2x + 3y^2)$$

![Imagem](https://res.cloudinary.com/dekxrmlbg/image/upload/v1753372727/ilswc1ttzdfijrghb4kf.png)

Aqui o termo 3 y^2 zera, pois está sendo multiplicado por x ^0 que seguindo a regra vira 0 * x ^-1

Já a derivada em relação a y será 



$$\frac{\partial}{\partial y}(2x + 3y^2)$$

![Imagem](https://res.cloudinary.com/dekxrmlbg/image/upload/v1753372728/rmof3vnlzep2ik7eeapj.png)



</NotionToggle>

<NotionToggle title="Exemplo 2" id="toggle-07-backpropagation--2-1">

Temos a função



$$f(x,y,z) = 3x^3z - y^2 + 5z + 2yz$$

A derivada parcial em relação a x será

Note que ainda restou um z no final, o que indica que a variável z tem influência no impacto que alterações em x causam na função. Como quando formos usar essas derivadas, estaremos analisando um ponto fixo para determinado valor de x,y e z (os nossos pesos), isso no fim vira um número. 

![Imagem](https://res.cloudinary.com/dekxrmlbg/image/upload/v1753372730/irgy9dryasd0a5covq50.png)

Faça as outras derivadas para treinar.



</NotionToggle>
Com essas derivadas parciais, conseguimos dizer o impacto que cada variável tem na função, e no caso da rede neural, definir o ajuste que faremos para cada peso individualmente.

Para a função de ativação RELU, que poderia ser usada em uma rede neural, teríamos a seguinte derivada parcial de x

![Imagem](https://res.cloudinary.com/dekxrmlbg/image/upload/v1753372731/kbb4520yvuckjjm9q6cj.png)

### Gradiente

Com o conhecimento de derivadas parciais, o gradiente se torna trivial, nada mais é do que um vetor contendo as derivadas parciais em relação à cada variável.

E ele traz consigo uma informação muito valiosa, ele aponta para a direção de maior crescimento da função que estamos analisando. Assim, como queremos achar o mínimo, fazemos uso do oposto do gradiente para descobrir a direção de maior decrescimento.

Cada elemento desse vetor oposto representa a informação de um peso, tanto se devemos aumentá-lo ou diminuí-lo e o quão drástica deve ser essa mudança.



</NotionToggle>

<NotionToggle title="Regra da cadeia" id="toggle-07-backpropagation--3-2">

Agora, temos um pequeno problema. Toda a matemática até agora funciona perfeitamente para as  redes neurais, só que apenas as de uma camada. Quando temos múltiplas camadas, a primeira camada afeta a segunda, que afeta a terceira e por aí vai. Essa cadeia de interações entre as camadas se reflete nas derivadas, com algo que conhecemos como regra da cadeia.


<NotionToggle title="Definição" id="toggle-07-backpropagation--3-0">

Temos as seguintes funções



$$z = g(x)$$



$$y = f(z)$$

Aqui, podemos reescrever y como f(g(x)). Isso é o que chamamos de função composta.

Notemos que o valor de y, depende do valor de x, mas apenas indiretamente, dado que x, muda z, e assim o z muda o valor de y e, por conta disso, caso queiramos a derivada de y em relação à x, ou seja, como que a mudança em x afeta y, precisaremos lidar com essa composição de funções utilizando a regra da cadeia.

Ela é definida, informalmente, como derivada da de fora vezes a derivada da de dentro.

No caso de f(g(x)), a derivada de f em relação a x seria a derivada de f * derivada de g, simples assim



$$\frac{\partial}{\partial x}f(g(x)) =  f' * g'$$



</NotionToggle>

<NotionToggle title="Exemplo numérico" id="toggle-07-backpropagation--3-1">

Suponha que temos um carro andando à 60km/h. Esse carro consome um litro de combustível a cada 30 km, e queremos saber qual a relação entre o tempo e o consumo de combustível. 

Aqui, temos duas funções, distância percorrida por ele é dada por sua velocidade em função do tempo, a função S, enquanto o consumo de combustível, pela distância em função da autonomia (30km/litro), a função C.



$$S(t) =  v*t = 60*t$$



$$C(s) = s/a = s / 30$$

Embora o C não dependa de t, ainda assim conseguimos achar a relação entre o tempo e o consumo de combustível compondo as duas funções, assim teremos



$$C(S(t)) =  a / S(t)$$

Para encontrar essa relação precisaremos utilizar a derivada, lembrando que essa derivada será a multiplicação das derivadas de C e de S, ou seja



$$S'= 60$$



$$C' = 1/30$$



$$C(S(t))' = 60 * 1/30 = 2$$

Como as unidades estavam em km/h e litros/km, o resultado final estará em litros/h. O que significa que o carro gasta 2 litros a cada hora.

Esse encadeamento de funções ocorre nas redes neurais, com a resposta de cada camada dependendo da anterior, só que em uma escala muito maior. Nesse exemplo dado, S poderia ser a primeira camada, que recebe como entrada o tempo, enquanto que C seria a segunda camada, que recebe a saída de S como entrada e nos diz quanto de combustível foi gasto.





</NotionToggle>


</NotionToggle>




</NotionToggle>


<NotionToggle title="Backpropagation em um único neurônio" id="toggle-07-backpropagation--2">

Relembrando, um neurônio segue mais ou menos essa estrutura

![Imagem](https://res.cloudinary.com/dekxrmlbg/image/upload/v1753372714/ut4f1jga2kgie6gnvewn.png)

Aqui temos apenas uma camada de entrada com três neurônios, que possuem um peso w e um viés b passado para a função de ativação RELU produzindo no fim uma resposta Z

![Imagem](https://res.cloudinary.com/dekxrmlbg/image/upload/v1753372716/fy1h1bg6bmgyaumwjiyn.png)

Reescrevendo isso, temos que a resposta Z, equivale a uma Relu (x[0] w[0] +  x[1] w[1] +  x[2] w[2] + b).

Como a Relu tem esse formato

![Imagem](https://res.cloudinary.com/dekxrmlbg/image/upload/v1753372717/algylwoqpy73gyuvrgfd.png)

No fim isso equivale ao maior valor entre toda essa soma( x[0] w[0] +  x[1] w[1] +  x[2] w[2] + b) e 0

E assim, usando entropia cruzada e supondo que a classe de entrada que estamos analisando é da classe 0, teremos a nossa função de perda(Loss) como



$$(Z - 0)^2$$

O nosso objetivo é otimizar esses pesos e o viés para que Z se torne mais perto de 0, diminuindo o valor da nossa função de perda e para isso, precisamos mover na direção negativa do nosso gradiente.

Ou seja, sendo L nossa função de perda, precisamos calcular

- A derivada de L em relação a w0:

- A derivada de L em relação a w1:

- A derivada de L em relação a w2:

- A derivada de L em relação a b:

Esses valores serão utilizados para atualizar os nossos pesos e viés antigo.

w0, por exemplo será



$$w0 - a\frac{\partial L}{\partial w_0}$$

Sendo esse a um valor pequeno(em torno de 0.1, 0.01) conhecido como taxa de aprendizado, do inglês, learning rate)

Agora, vamos achar esse ∂L/ ∂w0 usando esse exemplo aqui

Com x sendo o vetor [1,-2,3]

w sendo o vetor [-3, -1, 2]

e b 1

![Imagem](https://res.cloudinary.com/dekxrmlbg/image/upload/v1753372719/ts8ap8csal8tysimtj13.png)

A nossa função L é Relu da soma das multiplicação da entrada pelos pesos.

![Imagem](https://res.cloudinary.com/dekxrmlbg/image/upload/v1753372720/br7blonn5xvfgxvn8ejf.png)

Como temos uma cadeia de três funções, precisaremos usar a regra da cadeia. Lembrando, derivada da de fora vezes a de dentro. 

Assim, começamos pela Loss em relação à Relu, Relu em relação à soma, soma em relação à Multiplicação e multiplicação em relação a w0



$$\frac{\partial L}{\partial w_0} = \frac{\partial L}{\partial Relu} * \frac{\partial Relu}{\partial soma} * \frac{\partial soma}{\partial multiplicação} * \frac{\partial multiplicação}{\partial w_0}$$

Mas lembrando, embora por exemplo, seja a Loss em relação à Relu, estamos no fim derivando a função de Loss como se a Relu fosse o seu termo x, o que no fim nada mais é do que sua derivada mesmo

Começando com a função de perda, por ser uma cross entropy



$$y = x^2$$

Sua derivada será 



$$2x$$

Ou em termos de Relu()



$$2 * Relu(soma(...))$$

No fim, esse termo Relu(soma(…)) será substituído pelo valor obtido ao substituir os valores de x, w e b, e podemos calcular isso desde já, como temos esses valores já definidos.

A soma será



$$x0wo + x1w1 +x2w2 +b =$$



$$1 * (-3) + (-2) * 1 + 3 * 2 + 1 = 6$$

A Relu de um número positivo é o próprio número positivo, assim



$$\frac{\partial L}{\partial Relu} = 2 * 6 = 12$$

Derivando a Relu agora



$$y = Relu(x)$$

Lembrando a Relu é x, caso x seja maior que 0, 0 caso contrário, portanto a derivada da Relu é 1 caso x seja maior que 0 e 0, caso contrário.

Lembrando, isso está aplicado em cima do valor da soma, que como já calculamos é 6, um número positivo, portanto essa derivada valerá um.



$$\frac{\partial Relu}{\partial soma} = 1 $$



</NotionToggle>

