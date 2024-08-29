# Usa una imagen base, por ejemplo, Node.js
FROM node:18

# Establece el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copia los archivos de tu proyecto al contenedor
COPY package*.json ./
RUN npm install
COPY . .

# Expon el puerto en el que tu aplicación escucha
EXPOSE 8081

# Define el comando para iniciar tu aplicación
CMD ["npm", "start"]
