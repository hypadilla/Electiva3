# Infraestructura como Código para Electiva3

Este proyecto utiliza Terraform para gestionar infraestructura en AWS, creando un entorno completo para desplegar aplicaciones.

## Estructura del Proyecto

- **main.tf**: Configuración principal con recursos AWS (VPC, subred, EC2)
- **variables.tf**: Definición de variables incluyendo credenciales AWS, regiones, AMIs
- **outputs.tf**: Configuración de outputs para recursos AWS
- **terraform.tfvars**: Valores de variables
- **.terraform-version**: Versión de Terraform (1.5.7)
- **EC2-INFO.md**: Información detallada sobre la instancia EC2 desplegada
- **connect-ec2.sh**: Script para facilitar la conexión SSH a la instancia EC2

## Infraestructura Desplegada

- **Proveedor AWS**: Configurado para la región us-east-2
- **VPC**: Red virtual privada con CIDR 10.0.0.0/16
- **Subred Pública**: Configurada para permitir acceso desde Internet
- **Grupo de Seguridad**: Reglas para permitir tráfico HTTP, HTTPS y SSH
- **Instancia EC2**: Ubuntu 24.04 con Docker preinstalado
- **Internet Gateway**: Permite la comunicación entre la VPC e Internet
- **Tabla de Rutas**: Configurada para dirigir el tráfico correctamente

## Requisitos Previos

- Terraform v1.5.7 o superior
- Cuenta de AWS con permisos adecuados
- AWS CLI configurado localmente

## Configuración de Credenciales AWS

Para configurar las credenciales de AWS de forma segura, utiliza uno de estos métodos:

### Método 1: Variables de Entorno

```bash
export AWS_ACCESS_KEY_ID="tu_access_key"
export AWS_SECRET_ACCESS_KEY="tu_secret_key"
export AWS_DEFAULT_REGION="us-east-2"
```

### Método 2: Archivo de Credenciales AWS

```bash
mkdir -p ~/.aws
cat > ~/.aws/credentials << EOF
[default]
aws_access_key_id = tu_access_key
aws_secret_access_key = tu_secret_key
region = us-east-2
EOF
```

## Uso

### Inicializar Terraform

```bash
terraform init
```

### Ver el Plan de Ejecución

```bash
terraform plan
```

### Aplicar los Cambios

```bash
terraform apply
```

### Destruir la Infraestructura

```bash
terraform destroy
```

## Solución de Problemas

### Error de Permisos

Si encuentras este error:
```
UnauthorizedOperation: You are not authorized to perform this operation. User: arn:aws:iam::897192298416:user/ElectivaIII is not authorized to perform: ec2:RunInstances
```

Sigue estos pasos:

1. Inicia sesión en la consola de AWS
2. Ve a IAM > Usuarios > ElectivaIII
3. Añade la política `AmazonEC2FullAccess` para dar permisos completos sobre EC2

## Conexión a la Instancia EC2

Usa el script `connect-ec2.sh` proporcionado:

```bash
./connect-ec2.sh ruta/a/tu/archivo.pem
```

O conéctate manualmente:

```bash
ssh -i "ruta/a/ElectivaIII.pem" ubuntu@ec2-3-19-222-58.us-east-2.compute.amazonaws.com
```

## Mejores Prácticas de Seguridad

1. **No incluir credenciales en archivos versionados**
2. **Usar roles IAM con privilegios mínimos**
3. **Rotar regularmente las credenciales de AWS**
4. **Restringir el acceso SSH solo a IPs conocidas**
5. **Mantener actualizado el sistema operativo y Docker**

## Próximos Pasos

1. Configurar un sistema de CI/CD para automatizar el despliegue
2. Implementar monitoreo y alertas
3. Configurar backups automáticos
4. Mejorar la seguridad con grupos de seguridad más restrictivos
