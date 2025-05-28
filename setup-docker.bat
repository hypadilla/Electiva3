@echo off
REM Script para configurar Docker en Windows y preparar el entorno para Terraform

echo Sistema operativo detectado: Windows

REM Verificar si Docker está en ejecución
docker info > nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ADVERTENCIA: Docker no parece estar en ejecución. Por favor, inicia Docker Desktop.
    echo Después de iniciar Docker Desktop, ejecuta este script nuevamente.
    exit /b 1
) else (
    echo Docker está en ejecución.
    
    REM Crear archivo tfvars con la configuración para Windows
    echo docker_host = "npipe:////.//pipe//docker_engine" > docker-host.auto.tfvars
    echo Creado archivo docker-host.auto.tfvars con la configuración para Windows
)

echo Configuración completada. Ahora puedes ejecutar: terraform init ^&^& terraform plan
