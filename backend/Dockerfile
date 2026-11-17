
# Etapa 1: Compilação do projeto
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

# Copia os arquivos do Maven
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# Prepara o Maven Wrapper
RUN chmod +x mvnw

# Baixa as dependências
RUN ./mvnw dependency:go-offline

# Copia o código-fonte
COPY src/ src/

# Compila o projeto
RUN ./mvnw clean package -DskipTests

# Etapa 2: Execução da aplicação
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copia o JAR gerado
COPY --from=build /app/target/*.jar app.jar

# Inicia o Spring Boot
CMD ["sh", "-c", "java -Dserver.port=${PORT:-8080} -jar app.jar"]
