# Descrição do Projeto PG-PP2
O tema do projeto foi a criação de uma cena apresentando um modelo simples de um átomo, com um núcleo e três elétrons.

# Integrantes
- Gabriel Varano
- Gustavo dos Santos da Boa Morte
- Gustavo Rossini Ports
- Vinícius da Silva Lima

# Especificações Atendidas
- Foram adicionados quatro objetos 3D, um por membro do grupo, sendo eles um núcleo e três elétrons, todos redimensionados e posicionados de maneira individual;
- Foi criado e utilizado um shader próprio a partir do RawShaderMaterial, aplicando um efeito de "pulsação" no núcleo (objeto amarelo central). ***Observação**: o efeito do shader criado é pouco evidente na câmera com visão de cima (a definida como inicial), com a segunda possibilitando uma visualização melhor*;
- Foram definidas duas câmeras, ambas focadas no núcleo, uma com vista de cima e outra na "diagonal";
- Todos os três elétrons adicionados na cena realizam um movimento de órbita em volta do núcleo;
- Foi aplicada uma textura utilizando a imagem 'eletron.jpg' em um dos elétrons;

# Modo de Interação
É possível alternar entre as duas câmeras existentes na cena apertando as teclas T ou TAB.

# Principais Características Implementadas
Na cena, existem quatro objetos, um núcleo central amarelo, no qual foi aplicado o shader customizado e três elétrons que o orbitam, nas cores vermelho (o qual utiliza a textura da imagem 'eletron.jpg'), verde e azul, além de ser possível visualizar também o 'anel' do caminho seguido pelos elétrons. 

# Execução/Visualização do Projeto

É possível visualizar o código em execução no link https://gabrielv013.github.io/PG-PP2/, gerado pela ferramenta GitHub Pages.

Para executar o código localmente, é necessário tê-lo instalado (por download direto ou utilizando `git clone`), ir até o diretório em que os arquivos (todos devem estar no mesmo local) se encontram, executar `python -m http.server 8000` e acessar em seu navegador http://localhost:8000/
Outra opção é o uso, por exemplo, da extensão Live Server do VSCode, que permite a execução de um servidor local.
