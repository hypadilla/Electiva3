pipeline {
    agent any

    environment {
        APP_NAME = 'Electiva3'
        BUILD_DIR = 'build'
    }

    options {
        skipStagesAfterUnstable()
        timestamps()
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Clonando el repositorio...'
                checkout scm
            }
        }

        stage('Instalación de dependencias') {
            steps {
                echo 'Instalando dependencias...'
                sh 'npm install'
            }
        }

        stage('Pruebas Unitarias') {
            steps {
                echo 'Ejecutando pruebas unitarias...'
                sh 'npm test'
            }
        }

        stage('Build container') {
            steps {
                echo 'Compilando la aplicación...'
                sh 'colima stop'
                sh 'colima start'
                sh 'docker '
            }
        }

        /*stage('Análisis de Código (SonarQube)') {
            steps {
                echo 'Ejecutando análisis estático con SonarQube...'
                // Cambia los parámetros según tu configuración
                withSonarQubeEnv('SonarQube') {
                    sh 'sonar-scanner -Dsonar.projectKey=MiApp -Dsonar.sources=src'
                }
            }
        }

        stage('Esperar análisis (opcional)') {
            steps {
                waitForQualityGate abortPipeline: true
            }
        }*/

        stage('Empaquetado') {
            steps {
                echo 'Empaquetando artefacto...'
                sh 'zip -r ${APP_NAME}.zip ${BUILD_DIR}' // o `dotnet publish`
            }
        }

        stage('Deploy a ambiente de prueba') {
            steps {
                echo 'Desplegando a entorno de pruebas...'
                // Comando para copiar archivos, usar scripts de despliegue, etc.
                sh './scripts/deploy.sh'
            }
        }

    }

    post {
        always {
            echo 'Pipeline finalizado.'
            cleanWs()
        }
        success {
            echo 'Pipeline ejecutado con éxito ✅'
        }
        failure {
            echo 'Pipeline falló ❌'
        }
    }
}
