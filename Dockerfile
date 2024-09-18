# Etapa 1: Construcción del frontend
FROM node:16-alpine AS frontend-build
WORKDIR /app/frontend

# Copiar el archivo package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Construir el frontend
RUN npm run build

# Etapa 2: Configuración del backend (si lo combinas con el backend)
FROM node:16-alpine AS backend-build
WORKDIR /app/Backend

COPY Backend/package*.json ./
RUN npm install

# Copiar los archivos del backend y del build del frontend
COPY Backend/ ./
COPY --from=frontend-build /app/frontend/dist ./public

# Exponer el puerto
EXPOSE 8081

# Comando para iniciar el backend
CMD ["npm", "start"]
