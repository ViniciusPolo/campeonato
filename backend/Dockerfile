# Usando imagem base do Node.js
FROM node:16

# Instala o Python no container
RUN apt-get update && apt-get install -y python3 python3-pip

# Diretório de trabalho dentro do container
WORKDIR /backend

# Copia o package.json e instala as dependências
COPY package.json ./
RUN npm install

# Copia o código da aplicação para dentro do container
COPY . .

# Expõe a porta que o servidor irá rodar
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["node", "src/app.js"]
