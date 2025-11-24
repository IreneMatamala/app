# Este archivo le dice a Docker cómo EMPAQUETAR tu backend
# Crea una imagen que puede ejecutarse en cualquier computadora
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
