# Aluguel de Filmes

## Começando

Essas instruções farão com que você tenha uma cópia do projeto em sua máquina local.

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
**debug** - inicia a aplicação em modo debug. Mais informações em [node debugging guide](https://github.com/google/gson)  
**dev** - inicia a aplicação em modo de desenvolvimento com o nodemon que monitora alterações feitas nos arquivos da aplicação e reinicia automaticamente o servidor quando necessário  
**prod** - inicia a aplicação em modo produção. Para iniciar a aplicação neste modo, primeiro deve-se executar o script "*build*" e depois deve-se copiar o arquivo "*.env*", que se encontra na pasta "*config/.env*", para dentro da pasta "*dist/config*"

Para executar os scripts devemos estar dentro da pasta do projeto e digitar no terminal:

```bash
$ npm run {script}
```

## Informações
* O arquivo package.json tem definido jshintConfig que é uma opção para configurar o JSHint(foi instalado como uma extensao do visual studio code) que é uma ferramenta que interpreta os arquivos javascript e busca erros como varáveis não utilizadas, espaços em branco no final de linha, ausência de ponto-e-vírgula (um ponto polêmico) entre outros.

* O modulo "mysql2" no packages.json serve para o sequelize funcionar com o MySQL.

* O arquivo .npmrc é o arquivo de configuração do npm. Quando formos usar o npm no projeto ele irá usar as configurações contidas nesse arquivo.