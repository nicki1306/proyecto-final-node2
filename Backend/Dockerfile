# Usa una imagen base, por ejemplo, Node.js
FROM node:18

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos de tu proyecto al contenedor
COPY package*.json ./
RUN npm install
COPY . .

# Copia las imágenes a la carpeta de activos del contenedor
COPY public/images /usr/src/app/public/images

# Expon el puerto en el que tu aplicación escucha
EXPOSE 8081

# Define el comando para iniciar tu aplicación
CMD ["npm", "start"]
