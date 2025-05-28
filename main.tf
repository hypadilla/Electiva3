terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Proveedor AWS
provider "aws" {
  region = var.aws_region
  # NOTA: Para producción, usa variables de entorno o el archivo ~/.aws/credentials
  # en lugar de hardcodear las credenciales
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
}

# Recurso AWS - VPC
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name        = "${var.app_name}-vpc"
    Environment = var.environment
  }
}

# Recurso AWS - Subred pública
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.subnet_cidr
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true

  tags = {
    Name        = "${var.app_name}-public-subnet"
    Environment = var.environment
  }
}

# Recurso AWS - Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name        = "${var.app_name}-igw"
    Environment = var.environment
  }
}

# Recurso AWS - Tabla de rutas
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name        = "${var.app_name}-public-route-table"
    Environment = var.environment
  }
}

# Recurso AWS - Asociación de tabla de rutas a subred
resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

# Recurso AWS - Grupo de seguridad
resource "aws_security_group" "app" {
  name        = "${var.app_name}-sg"
  description = "Security group for the application"
  vpc_id      = aws_vpc.main.id

  # Regla de entrada para HTTP
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Acceso HTTP"
  }

  # Regla de entrada para HTTPS
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Acceso HTTPS"
  }

  # Regla de entrada para SSH
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.ssh_allowed_cidr]
    description = "Acceso SSH"
  }

  # Regla de salida
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound traffic"
  }

  tags = {
    Name        = "${var.app_name}-sg"
    Environment = var.environment
  }
}

# Recurso AWS - instancia EC2
resource "aws_instance" "ubuntu_ec2" {
  ami                    = var.ami_id
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.app.id]
  key_name               = var.key_name

  root_block_device {
    volume_size = 20
    volume_type = "gp3"
    encrypted   = true
  }

  tags = {
    Name        = "${var.app_name}-instance"
    Environment = var.environment
  }

  # Script de inicialización
  user_data = <<-EOF
              #!/bin/bash
              apt-get update
              apt-get install -y docker.io
              systemctl start docker
              systemctl enable docker
              usermod -aG docker ubuntu
              
              # Crear directorio para la aplicación
              mkdir -p /app
              
              # Crear un archivo de registro para la IP
              echo "Instancia creada con éxito" > /app/deployment.log
              echo "IP pública: $(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)" >> /app/deployment.log
              
              # Ejecutar un contenedor de prueba
              docker run -d -p 80:80 --name nginx nginx:latest
              EOF

  # Ejecutar un comando local después de crear la instancia
  provisioner "local-exec" {
    command = "echo 'Instancia EC2 creada con IP: ${self.public_ip}' >> deployment_info.txt"
  }
}
