# CataBoi WebApp

Aplicacao web do CataBoi para gerenciamento de rebanhos, animais, propriedades, eventos, usuarios e relatorios.

# DEMO

https://paulovargas.github.io/webapp-cataboi/home

O projeto foi criado com Angular CLI 19.2.15.

## Requisitos

- Node.js
- npm
- Angular CLI

Instale as dependencias com:

```bash
npm install
```

## Desenvolvimento local

Para rodar a aplicacao localmente:

```bash
npm start
```

Acesse:

```text
http://localhost:4200/
```

Por padrao, o ambiente local aponta para a API em:

```text
http://localhost:8080
```

## Login de demonstracao

Quando a API nao responder, o sistema aceita automaticamente o login de demonstracao:

```text
Email: cataboi@cataboi.com.br
Senha: cataboi
```

Esse login cria uma sessao local mockada e direciona para o dashboard. Algumas informacoes de rebanhos e propriedades tambem possuem fallback mockado para a demonstracao funcionar sem backend.

## Build

Para gerar a versao de demonstracao:

```bash
npm run build:pages
```

Para gerar o build padrao do Angular:

```bash
npm run build
```

Observacao: o build padrao pode falhar caso o bundle ultrapasse o budget configurado em `angular.json`.

## Testes

Para executar os testes unitarios:

```bash
npm test
```
