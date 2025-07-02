# Use Eclipse Temurin (OpenJDK) as base image
FROM eclipse-temurin:17-jdk-alpine

# Set working directory
WORKDIR /app

# Copy all project files
COPY . /app

# 🔧 Give execute permission to Maven wrapper
RUN chmod +x mvnw

# Build the app
RUN ./mvnw clean install -DskipTests

# Run the built jar (replace with your actual jar name if known)
CMD ["java", "-jar", "target/eventmanagement-0.0.1-SNAPSHOT.jar"]
