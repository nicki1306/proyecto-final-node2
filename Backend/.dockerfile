#Usa una imagen base oficial de Node.js
FROM node:20.10.0

#Establece el directorio de trabajo
WORKDIR /app

#Copia los archivos package.json y package-lock.json
COPY package*.json ./

#Instala las dependencias
RUN npm install

#Copia el resto del código fuente
COPY . .

#Expone el puerto que usa tu aplicación
EXPOSE 8081

#Comando para ejecutar la aplicación
CMD ["npm", "start"]