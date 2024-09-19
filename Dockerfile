# Etapa 1: Construcción del frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./

# Instalar dependencias para el frontend
RUN npm install

# Copiar el resto del código fuente del frontend
COPY frontend/ ./

# Construir el frontend
RUN npm run build

# Etapa 2: Construcción del backend
FROM node:18-alpine AS backend-build
WORKDIR /app/Backend

# Copiar solo el package.json y package-lock.json para evitar reinstalaciones innecesarias
COPY Backend/package*.json ./

# Instalar dependencias del backend
RUN npm install

# Copiar el código fuente del backend
COPY Backend/ ./

# Instalar bcrypt específicamente desde el código fuente (por compatibilidad)
RUN npm install bcrypt --build-from-source

# Copiar los archivos construidos del frontend al backend (public directory)
COPY --from=frontend-build /app/frontend/dist /app/Backend/public

# Exponer el puerto del backend
EXPOSE 8081

# Comando para ejecutar el backend
CMD ["npm", "start"]
