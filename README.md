# Curso de Tuning Java

## Instalación

- [JDK](https://www.oracle.com/java/technologies/downloads/)
- [Eclipse IDE for Enterprise Java and Web Developers](https://www.eclipse.org/downloads/download.php?file=/technology/epp/downloads/release/2025-09/R/eclipse-jee-2025-09-R-win32-x86_64.zip)
  - Help > Eclipse Marketplace ... > [Spring Tools 4 (aka Spring Tool Suite 4)](https://marketplace.eclipse.org/content/spring-tools-4-aka-spring-tool-suite-4)
  - [Project Lombok](https://projectlombok.org/downloads/lombok.jar)
    - **Instalación:** javaw -jar lombok.jar

## Contenedores

### Instalación Docker Desktop

- [WSL 2 feature on Windows](https://learn.microsoft.com/es-es/windows/wsl/install)
- [Docker Desktop](https://www.docker.com/get-started/)

#### Alternativas a Docker Desktop

- [Podman](https://podman.io/docs/installation)
- [Rancher Desktop](https://rancherdesktop.io/)

#### Configuración de puertos dinámicos en Windows

    netsh int ipv4 set dynamic tcp start=51000 num=14536

### Crear una red en Docker

    docker network create devops

### Desplegar contenedores

#### Bases de datos

##### MySQL

    docker run -d --name mysql-sakila -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 jamarton/mysql-sakila

#### Testing

##### Control de calidad

    docker run -d --name sonarQube --publish 9000:9000 --network devops sonarqube:latest

#### Monitorización y supervisión

##### Prometheus (Monitorización)

    docker run -d -p 9090:9090 --name prometheus -v ./config-dir/prometheus.yml:/etc/prometheus/prometheus.yml prom/prometheus

##### Grafana (Monitorización)

    docker run -d -p 3000:3000 --name grafana grafana/grafana

### Contenedores efímeros (Comandos)

#### Maven

    docker run --rm -it -v .:/local -v maven-repository:/root/.m2 maven:3.8.6-eclipse-temurin-8 bash

#### SonarQube Scanner

    docker run --rm -v .:/usr/src -e SONAR_HOST_URL="http://host.docker.internal:9000"  sonarsource/sonar-scanner-cli

## Herramientas de monitorización, perfilado y pruebas

- [Eclipse Memory Analyzer Tool (MAT)](https://eclipse.dev/mat/download/)
- [VisualVM](https://visualvm.github.io/)
- [JDK Mission Control (JMC)](https://www.oracle.com/java/technologies/javase/products-jmc9-downloads.html)
- [JITWatch](https://github.com/AdoptOpenJDK/jitwatch)
- [Apache JMeter](https://jmeter.apache.org/download_jmeter.cgi)

## Documentación (Oficial)

- [JDK Documentation](https://docs.oracle.com/en/java/javase/25/)
- [JDK Tool Specifications](https://docs.oracle.com/en/java/javase/25/docs/specs/man/index.html)
- [Monitoring and Management Guide](https://docs.oracle.com/en/java/javase/25/management/overview-java-se-monitoring-and-management.html)
- [Troubleshooting Guide](https://docs.oracle.com/en/java/javase/25/troubleshoot/general-java-troubleshooting.html)
- [Garbage Collection Tuning](https://docs.oracle.com/en/java/javase/25/gctuning/introduction-garbage-collection-tuning.html)
- [JMX Guide](https://docs.oracle.com/en/java/javase/25/jmx/introduction-jmx-technology.html)

## Repositorios

- <https://github.com/jmagit/demos-devops>
- <https://github.com/spring-projects/spring-petclinic>
- <https://github.com/spring-petclinic/spring-petclinic-rest>

## Laboratorios

- [Eclipse Memory Analyzer: Getting Started](https://help.eclipse.org/latest/topic/org.eclipse.mat.ui.help/gettingstarted/basictutorial.html?cp=50_1_0)
- [Using JConsole](https://docs.oracle.com/en/java/javase/25/management/using-jconsole.html)
- [Getting Started with VisualVM](https://htmlpreview.github.io/?https://raw.githubusercontent.com/visualvm/visualvm.java.net.backup/master/www/gettingstarted.html)
- [jvmperf: JVM Performance Workshop](https://jvmperf.net/)
