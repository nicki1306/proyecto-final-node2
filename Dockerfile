FROM node:16-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM node:16-alpine AS Backend-build
WORKDIR /app/Backend
COPY Backend/package*.json ./
RUN npm install
COPY Backend/ ./
COPY --from=frontend-build /app/frontend/dist ./public
EXPOSE 8081
CMD ["npm", "start"]
