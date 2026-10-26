# ==============================================================================
# Multi-stage Dockerfile for SpendWise Personal Expense Tracker
# Packages both React.js frontend and Java Spring Boot backend into a single image
# ==============================================================================

# Stage 1: Build the React Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# Stage 2: Build the Spring Boot Backend with Maven
FROM maven:3.9.6-eclipse-temurin-17-alpine AS backend-builder
WORKDIR /app/backend

COPY backend/pom.xml ./
RUN mvn dependency:go-offline -B

COPY backend/src ./src

# Copy built frontend assets into Spring Boot's static resources
COPY --from=frontend-builder /app/frontend/dist ./src/main/resources/static/

RUN mvn clean package -DskipTests

# Stage 3: Slim Production Runtime Image
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Create directory for persistent H2 database files
RUN mkdir -p /app/data && chown -R 1000:1000 /app

COPY --from=backend-builder /app/backend/target/expense-tracker-api-1.0.0.jar /app/app.jar

ENV PORT=8081
EXPOSE 8081

# Persistent volume for H2 database
VOLUME ["/app/data"]

ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "/app/app.jar"]
