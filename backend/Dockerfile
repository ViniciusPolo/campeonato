# Usando imagem base do Node.js
FROM node:16

# Diretório de trabalho dentro do container
WORKDIR /app

# Copia o package.json e instala as dependências
COPY package.json ./
RUN npm install

# Copia o código da aplicação para dentro do container
COPY . .

# Expõe a porta que o servidor irá rodar
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["node", "src/app.js"]
