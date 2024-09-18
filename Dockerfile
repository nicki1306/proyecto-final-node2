# Etapa 1: Construcción del frontend
FROM node:16-alpine AS frontend-build
WORKDIR /app/frontend

# Copiar archivos del frontend
COPY ./frontend/package*.json ./
RUN npm install

COPY ./frontend/ ./
RUN npm run build

# Etapa 2: Configuración del backend
FROM node:16-alpine
WORKDIR /app/Backend

# Copiar archivos del backend
COPY ./Backend/package*.json ./
RUN npm install

# Copiar archivos del frontend construidos al backend
COPY --from=frontend-build /app/frontend/dist ./public

# Copiar el resto de los archivos del backend
COPY ./Backend/ ./

# Exponer el puerto
EXPOSE 8081

# Comando para iniciar el backend
CMD ["npm", "start"]
