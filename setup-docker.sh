#!/bin/bash

# Script para configurar Docker según el sistema operativo
# y preparar el entorno para Terraform

# Detectar el sistema operativo
OS=$(uname -s)
echo "Sistema operativo detectado: $OS"

# Configurar Docker según el sistema operativo
if [ "$OS" = "Darwin" ]; then
    echo "Detectado macOS, verificando Colima..."
    
    # Verificar si Colima está instalado
    if command -v colima &> /dev/null; then
        echo "Colima encontrado, verificando estado..."
        
        # Verificar si Colima está en ejecución
        if ! colima status 2>/dev/null | grep -q "Running"; then
            echo "Iniciando Colima..."
            colima start
        else
            echo "Colima ya está en ejecución."
        fi
        
        # Exportar la variable de entorno para Docker
        export DOCKER_HOST="unix://${HOME}/.colima/default/docker.sock"
        echo "DOCKER_HOST configurado a: $DOCKER_HOST"
        
        # Crear archivo tfvars con la configuración correcta
        cat > docker-host.auto.tfvars <<EOF
docker_host = "${DOCKER_HOST}"
EOF
        echo "Creado archivo docker-host.auto.tfvars con la configuración correcta para macOS con Colima"
    else
        echo "Colima no está instalado. Verificando Docker Desktop..."
        
        # Verificar si Docker Desktop está en ejecución
        if ! docker info &> /dev/null; then
            echo "ADVERTENCIA: Docker no parece estar en ejecución. Por favor, inicia Docker Desktop."
            echo "Después de iniciar Docker Desktop, ejecuta este script nuevamente."
            exit 1
        else
            echo "Docker Desktop está en ejecución."
            # Crear archivo tfvars con la configuración estándar
            cat > docker-host.auto.tfvars <<EOF
docker_host = "unix:///var/run/docker.sock"
EOF
            echo "Creado archivo docker-host.auto.tfvars con la configuración estándar para Docker Desktop"
        fi
    fi
elif [ "$OS" = "Linux" ]; then
    echo "Detectado Linux, configurando Docker..."
    
    # Verificar si Docker está en ejecución
    if ! docker info &> /dev/null; then
        echo "ADVERTENCIA: Docker no parece estar en ejecución. Por favor, inicia el servicio Docker."
        echo "Puedes usar: sudo systemctl start docker"
        exit 1
    else
        echo "Docker está en ejecución."
        # Crear archivo tfvars con la configuración estándar
        cat > docker-host.auto.tfvars <<EOF
docker_host = "unix:///var/run/docker.sock"
EOF
        echo "Creado archivo docker-host.auto.tfvars con la configuración estándar para Linux"
    fi
else
    echo "Sistema operativo no reconocido o Windows. Si estás en Windows, ejecuta setup-docker.bat"
fi

echo "Configuración completada. Ahora puedes ejecutar: terraform init && terraform plan"
