# TIC-TAC_TOE

> Implementação do jogo TicTacToeMP um jogo da velha em rede.

## Instalação

### Clone
- Clone este repositório em sua máquina `https://github.com/HenriqueTome1/TicTacToe-PeerToPeer.git`

### Setup

> Baixe a versão LTS do nodejs em `https://nodejs.org/` e abra o terminal no local salvo

```shell
sudo mkdir /usr/local/lib/nodejs
sudo tar -xJvf NOMEDOARQUIVO.tar.xz -C /usr/local/lib/nodejs 
sudo mv /usr/local/lib/nodejs/NOMEDOARQUIVO /usr/local/lib/nodejs/node-VERSAOBAIXADA
```

> Agora abra seu arquivo de variáveis de ambiente `~/.bashrc` em seu editor preferido, e adicione ao final

```shell
# Nodejs
export NODEJS_HOME=/usr/local/lib/nodejs/node-$VERSION/bin
export PATH=$NODEJS_HOME:$PATH
```

> Atualize o arquivo de variáveis de ambiente no terminal

```shell
. ~/.bashrc
```

> Teste a instalação

```shell
node -v
npm version
```

> Output normal

```shell
➜  node -v
v10.15.0
➜  npm version
{ npm: '6.4.1',
  ares: '1.15.0',
  cldr: '33.1',
  http_parser: '2.8.0',
  icu: '62.1',
  modules: '64',
  napi: '3',
  nghttp2: '1.34.0',
  node: '10.15.0',
  openssl: '1.1.0j',
  tz: '2018e',
  unicode: '11.0',
  uv: '1.23.2',
  v8: '6.8.275.32-node.45',
  zlib: '1.2.11' }
```

> Instale o nodemon

```shell
npm i nodemon
```

> Instale o quasar

```shell
npm install -g @quasar/cli
```

> Inicie o server UDP
```
Dentro da pasta raiz do projeto execute
```
```shell
nodemon server.js
``` 

> Inicie o client da aplicação

```
Este estará localizado na pasta TicTacToeMP/backend do projeto pelo nome de KompJSlator.postman_collection.json
```
```shell
nodemon client.js
```
> Inicie o front-end
```
Acesse a pasta TicTacToeMP
```
```shell
quasar dev
```

>Algum problema não relatado

```shell
sudo killall -9 node 
sudo yarn start
``` 
---

## Time

> Nosso time de desenvolvimento

| <a href="https://github.com/GaMJun" target="_blank">**Gilberto Antunes**</a> | <a href="https://github.com/HenriqueTome1" target="_blank">**Henrique Tomé**</a> |
|:---:|:---:|
| <a href="https://www.linkedin.com/in/gamjun"><img alt="Gilberto Antunes" src="https://avatars0.githubusercontent.com/u/27792876" width="150" height="150"></a> | <a href="https://www.linkedin.com/in/tom%C3%A9/"><img alt="Henrique Tomé" src="https://avatars1.githubusercontent.com/u/27792676" width="150" height="150"></a> |
| <a href="https://github.com/GaMJun" target="_blank">`  github.com/gamjun  `</a> | <a href="https://github.com/HenriqueTome1" target="_blank">`github.com/HenriqueTome1`</a> | 

---

## License

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)

- **[MIT license](http://opensource.org/licenses/mit-license.php)**