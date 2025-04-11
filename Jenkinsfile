pipeline {
    agent any

    environment {
        APP_NAME = 'Electiva3'
        BUILD_DIR = 'build'
        PATH = "/opt/homebrew/bin:$PATH"
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

        stage('Verificar npm') {
            steps {
                sh 'which npm || echo "npm no está en el PATH"'
                sh 'node -v || echo "Node.js no está instalado"'
            }
        }

        stage('Instalación de dependencias') {
            steps {
                echo 'Instalando dependencias...'
                script{
                    sh 'npm install --registry=https://registry.npmjs.org/'
                }
                //sh 'brew install npm'
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
                sh 'docker build -t clonex .'
                sh 'docker run --rm -p 3015:3015 clonex'
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
            echo 'Pipeline falló  ❌'
        }
    }
}
