# Aluguel de Filmes

## Começando

Essas instruções farão com que você tenha uma cópia do projeto em sua máquina local.

### Pré Requisitos

Para que esta API REST possa funcionar, tanto nos modos de produção e desenvolvedor, quanto no modo de teste, primeiramente deve-se executar os dois scripts de criação do banco dados MySQL: "*movierentaldb.sql*" e "*movierentaldb_test.sql*".

### Instalando

Clone o repositório

```
$ git clone https://github.com/vinicius1924/MovieRental.git
```

Entre na pasta do projeto e vá até config/database.js. Dentro deste arquivo você deve modificar as seguintes variáveis de acordo com a sua configuração do MySQL:

**connectionHost** - onde o MySQL está hospedado  
**connectionPort** - a porta usada para conectar no MySQL  
**userName** - o nome do usuário para acessar o banco de dados  
**password** - a senha do usuário para acessar o banco de dados  

Dentro do arquivo "*package.json*" temos os seguintes scripts:

**build** - cria uma pasta chamada dist com os arquivos .js na versão ES5  
**debug** - inicia a aplicação em modo debug. Mais informações em [node debugging guide](https://nodejs.org/en/docs/guides/debugging-getting-started/)  
**dev** - inicia a aplicação em modo de desenvolvimento com o nodemon que monitora alterações feitas nos arquivos da aplicação e reinicia automaticamente o servidor quando necessário  
**prod** - inicia a aplicação em modo produção. Para iniciar a aplicação neste modo, primeiro deve-se executar o script "*build*" e depois deve-se copiar o arquivo "*.env*", que se encontra na pasta "*config/.env*", para dentro da pasta "*dist/config*"  
**test** - executa os testes que foram escritos utilizando [mocha](https://mochajs.org/) e [chai](http://chaijs.com/). Lembrando que, para esse script ser executado com sucesso deve-se executar o script de criação do banco dados "*movierentaldb_test.sql*"

Para executar os scripts devemos estar dentro da pasta do projeto e digitar no terminal:

```bash
$ npm run {script}
```

## Informações
* O arquivo package.json tem definido jshintConfig que é uma opção para configurar o JSHint(foi instalado como uma extensao do visual studio code) que é uma ferramenta que interpreta os arquivos javascript e busca erros como varáveis não utilizadas, espaços em branco no final de linha, ausência de ponto-e-vírgula (um ponto polêmico) entre outros.

* O modulo "mysql2" no packages.json serve para o sequelize funcionar com o MySQL.

* O arquivo .npmrc é o arquivo de configuração do npm. Quando formos usar o npm no projeto ele irá usar as configurações contidas nesse arquivo.

## Observações

Esta API foi desenvolvida e testada no sistema operacional Ubuntu.  
Pode ser que haja algum problema ao tentar executar o script "*test*" no Windows. Caso haja algum problema, tente usar a linha abaixo no script "*test*":  
"SET NODE_ENV=test ./node_modules/.bin/mocha --timeout 10000 --reporter spec"