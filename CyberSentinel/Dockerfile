# Etapa 1: Construcción (Build)
FROM eclipse-temurin:17-jdk-jammy AS build
WORKDIR /app

# Copiar el wrapper de Maven y el archivo pom
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Dar permisos de ejecución al wrapper (necesario si se subió desde Windows)
RUN chmod +x mvnw

# Descargar dependencias offline
RUN ./mvnw dependency:go-offline

# Copiar el código fuente y compilar
COPY src ./src
RUN ./mvnw clean package -DskipTests

# Etapa 2: Ejecución (Run)
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copiar el .jar compilado desde la etapa anterior
COPY --from=build /app/target/*.jar app.jar

# Exponer el puerto por defecto de Spring Boot
EXPOSE 8080

# Comando para ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]