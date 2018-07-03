FROM openjdk:10-jdk as builder
RUN mkdir src
WORKDIR src

COPY gradlew /src/
COPY gradle /src/gradle
RUN ./gradlew --no-daemon #just so that we download gradle in its own layer

COPY . /src/
RUN ./gradlew --no-daemon
RUN mkdir jars
RUN cp build/libs/autoplaylist-backend.jar jars

FROM openjdk:10-jre-slim
RUN mkdir app
WORKDIR app
COPY --from=builder /src/jars .

# the urandom thing reduces tomcat startup time, no idea if it's smart or not
CMD ["java","-Djava.security.egd=file:/dev/./urandom","-jar","autoplaylist-backend.jar"]
