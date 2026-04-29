# Stage 1: Maven baut das JAR
FROM maven:3.9-eclipse-temurin-21-alpine AS builder

WORKDIR /app

# Abhängigkeiten zuerst cachen (nur neu laden wenn pom.xml sich ändert)
COPY pom.xml .
RUN mvn dependency:go-offline -q

COPY src ./src
RUN mvn package -DskipTests -q

# Stage 2: Nur das fertige JAR im schlanken Image
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

# Healthcheck für Docker (Kubernetes nutzt die readinessProbe)
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
