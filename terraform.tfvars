# Valores de las variables para el proyecto Electiva3
# Este archivo puede ser modificado según las necesidades específicas del entorno

# user_name ya no se usa
aws_region         = "us-east-2"
# Las credenciales de AWS deben configurarse usando variables de entorno o el archivo ~/.aws/credentials
# aws_access_key     = "AKIA5BZGUA6YIFYLPWOJ" # NO incluir credenciales en archivos versionados
# aws_secret_key     = "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" # NO incluir credenciales en archivos versionados
app_name           = "electiva3-app"
environment        = "dev"
vpc_cidr           = "10.0.0.0/16"
subnet_cidr        = "10.0.1.0/24"
instance_type      = "t2.micro"
ami_id             = "ami-04f167a56786e4b09"  # Ubuntu 24.04 en us-east-2
key_name           = "ElectivaIII"           # Tu key pair creado en AWS
ssh_allowed_cidr   = "0.0.0.0/0"             # Reemplazar con IPs específicas en producción
docker_image       = "nginx:alpine"
docker_container_name = "nginx-container"
docker_host_port   = 8080
docker_container_port = 80
