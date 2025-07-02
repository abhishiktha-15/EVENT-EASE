# Use Eclipse Temurin (OpenJDK) as base image
FROM eclipse-temurin:17-jdk-alpine

# Set working directory
WORKDIR /app

# Copy project files
COPY . /app

# Build the app using Maven Wrapper
RUN ./mvnw clean install -DskipTests

# Run the application
CMD ["java", "-jar", "target/eventmanagement-0.0.1-SNAPSHOT.jar"]
