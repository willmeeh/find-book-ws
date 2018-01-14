
Projeto criado para um trabalho da disciplina de programação para dispositivos móveis.

Consistem em uma API desenvolvida em Node.js que possui 2 rotas:

* dominio/book/find/:book-name/:count?: 

  A partir de um titulo informado, retorna uma lista(JSON) de livros, com a quantidade disponível no acervo e outros dados que são extraídos do retorno de uma busca feita no site da biblioteca da UNISC. O parâmetro count é opcional, utilizado para limitar a quantidade de itens retornados, e caso não informado, por padrão retorna 20 itens.

* dominio/shelf/find/:nLivro

  A partir do código do livro, retorna uma imagem do mapa da biblioteca da UNISC com a localização da estante em que se encontra o livro informado.

Repositório do projeto android: github.com/expoure/FindBook
