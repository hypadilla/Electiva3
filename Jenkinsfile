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

        /*stage('Build container') {
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
        }*/

        stage('Instalar Terraform') {
            steps {
                echo 'Instalando Terraform...'
                script {
                    if (isUnix()) {
                        // Instalación de Terraform en macOS/Linux
                        sh '''
                            if ! command -v terraform &> /dev/null; then
                                echo "Terraform no está instalado. Instalando..."
                                # Descargar Terraform
                                curl -O https://releases.hashicorp.com/terraform/1.5.7/terraform_1.5.7_darwin_amd64.zip
                                # Descomprimir
                                unzip -o terraform_1.5.7_darwin_amd64.zip
                                # Mover a un directorio en el PATH
                                chmod +x terraform
                                sudo mv terraform /usr/local/bin/
                                # Limpiar
                                rm -f terraform_1.5.7_darwin_amd64.zip
                            else
                                echo "Terraform ya está instalado"
                                terraform --version
                            fi
                        '''
                    } else {
                        // Instalación de Terraform en Windows
                        bat '''
                            where terraform >nul 2>&1
                            if %errorlevel% neq 0 (
                                echo Terraform no esta instalado. Instalando...
                                powershell -Command "Invoke-WebRequest -Uri https://releases.hashicorp.com/terraform/1.5.7/terraform_1.5.7_windows_amd64.zip -OutFile terraform.zip"
                                powershell -Command "Expand-Archive -Path terraform.zip -DestinationPath C:\terraform -Force"
                                powershell -Command "[Environment]::SetEnvironmentVariable('PATH', $env:PATH + ';C:\terraform', 'Machine')"
                                set PATH=%PATH%;C:\terraform
                                del terraform.zip
                            ) else (
                                echo Terraform ya esta instalado
                                terraform --version
                            )
                        '''
                    }
                }
            }
        }

        stage('Deploy con Terraform') {
            steps {
                echo 'Desplegando infraestructura con Terraform...'
                script {
                    if (isUnix()) {
                        sh 'terraform init'
                        sh 'terraform validate'
                        sh 'terraform plan -out=tfplan'
                        sh 'terraform apply -auto-approve tfplan'
                    } else {
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