# Multi-stage build for StockSmart Backend (Java 21)
# Stage 1: Build artifact with Maven and OpenJDK 21
FROM maven:3.9.6-eclipse-temurin-21 AS builder
WORKDIR /app

# Copy dependency descriptors and cache layer
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build jar
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Production JRE 21 runtime
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Create non-root application user for container security
RUN groupadd -r appgroup && useradd -r -g appgroup -s /bin/false appuser

# Copy compiled jar
COPY --from=builder /app/target/*.jar app.jar
RUN chown -R appuser:appgroup /app

USER appuser

# Default port (Render injects PORT at runtime)
ENV PORT=5656
EXPOSE 5656

# Start application
ENTRYPOINT ["sh", "-c", "java -Djava.security.egd=file:/dev/./urandom -jar app.jar"]
