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
                script {
                    sh 'npm install --registry=https://registry.npmjs.org/'
                }
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
                script {
                    def isWindows = isUnix() == false
                    if (!isWindows) {
                        echo 'Sistema operativo: macOS o Linux'
                        sh 'colima stop || true'
                        sh 'colima start'
                        sh 'docker build -t clonex .'
                        sh 'docker run --rm -p 3015:3015 clonex -d'
                    } else {
                        echo 'Sistema operativo: Windows'
                        bat '''
                            docker build -t clonex .
                            docker run --rm -p 3015:3015 clonex -d
                        '''
                    }
                }
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