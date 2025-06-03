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
                echo 'Verificando Node y npm...'
                script {
                    if (isUnix()) {
                        sh 'which npm || echo "npm no está en el PATH"'
                        sh 'node -v || echo "Node.js no está instalado"'
                    } else {
                        bat 'where npm || echo "npm no está en el PATH"'
                        bat 'node -v || echo "Node.js no está instalado"'
                    }
                }
            }
        }

        stage('Instalacion de dependencias') {
            steps {
                echo 'Instalando dependencias...'
                script {
                    if (isUnix()) {
                        // En la Mac de Harold se requiere implementar este registry adicional
                        // Para otros usuarios no sería necesario
                        sh 'npm install --registry=https://registry.npmjs.org/'
                    } else {
                        bat 'rmdir /s /q node_modules'
                        bat 'del package-lock.json'
                        bat 'npm install'
                    }
                }
            }
        }

        stage('Pruebas Unitarias') {
            steps {
                echo 'Ejecutando pruebas unitarias...'
                script {
                    if (isUnix()) {
                        sh 'npm test'
                    } else {
                        bat 'npm test'
                    }
                }
            }
        }

        stage('Build container') {
            steps {
                echo 'Compilando la aplicación...'
                script {
                    if (isUnix()) {
                        echo 'Sistema operativo: macOS o Linux'
                        sh 'colima stop || true'
                        sh 'colima start'
                        sh 'docker build -t clonex .'
                        sh 'docker run --rm -d -p 3016:3015 clonex'
                    } else {
                        echo 'Sistema operativo: Windows'
                        bat 'docker build -t clonex .'
                        bat 'docker run --rm -d -p 3016:3015 clonex'
                    }
                }
            }
        }

        stage('Deploy con Terraform') {
            environment {
                AWS_ACCESS_KEY_ID     = credentials('aws-access-key-id')
                AWS_SECRET_ACCESS_KEY = credentials('aws-secret-access-key')
                TF_VAR_key_name       = 'ElectivaIII'
            }
            steps {
                echo 'Desplegando infraestructura con Terraform...'
                script {
                    if (isUnix()) {
                        sh 'terraform --version'
                        sh 'terraform init'
                        sh 'terraform validate'
                        sh 'terraform plan -out=tfplan'
                        sh 'terraform apply -auto-approve tfplan'
                    } else {
                        bat 'terraform --version'
                        bat 'terraform init'
                        bat 'terraform validate'
                        bat 'terraform plan -out=tfplan'
                        bat 'terraform apply -auto-approve tfplan'
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
            echo 'Pipeline ejecutado con éxito'
        }
        failure {
            echo 'Pipeline falló'
        }
    }
}