# Usar a imagem base oficial do Node.js
FROM node:20

# Criar diretório de trabalho
WORKDIR /usr/src/app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o restante do código da aplicação
COPY . .

# Expor a porta da aplicação
EXPOSE 8000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
#CMD ["/bin/bash", "./wait-for-it.sh", "mysql:3306", "--", "./wait-for-it.sh", "rabbitmq:5672", "--", "npm", "start"]

