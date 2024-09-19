# Etapa 1: Construcción del frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Etapa 2: Construcción del backend
FROM node:18-alpine AS backend-build
WORKDIR /app/Backend
COPY Backend/package*.json ./
RUN npm install
COPY Backend/ ./

RUN npm install bcrypt --build-from-source

# Copiar los archivos construidos del frontend al backend
COPY --from=frontend-build /app/frontend/dist /app/Backend/public


# Exponer el puerto del backend
EXPOSE 8081

# Comando para ejecutar la aplicación
CMD ["npm", "start"]
