# Etapa 1: Construcción del frontend (Vite)
FROM node:16-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Etapa 2: Configuración del backend
FROM node:16-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend/ ./

# Copiar los archivos estáticos del frontend construido al backend
COPY --from=frontend-build /app/frontend/dist ./public

# Exponer el puerto en el que la aplicación escuchará
EXPOSE 8081

# Comando para iniciar el backend
CMD ["npm", "start"]
