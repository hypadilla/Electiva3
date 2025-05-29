terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    null = {
      source  = "hashicorp/null"
      version = "~> 3.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.0"
    }
    local = {
      source  = "hashicorp/local"
      version = "~> 2.0"
    }
  }
}

# Proveedor AWS
provider "aws" {
  region     = var.aws_region
  # NOTA: Esta configuración es temporal para pruebas
  # En un entorno de producción, usa variables de entorno o ~/.aws/credentials
  access_key = "AKIA5BZGUA6YIFYLPWOJ"
  secret_key = "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"
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

# Recurso AWS - instancia EC2 (referencia a instancia existente)
data "aws_instance" "ubuntu_ec2" {
  instance_id = "i-05f023259fb4cc983" # ID de la instancia existente
}

# Output para mostrar información de la instancia existente
output "existing_instance_info" {
  description = "Información de la instancia EC2 existente"
  value = {
    id         = data.aws_instance.ubuntu_ec2.id
    public_ip  = data.aws_instance.ubuntu_ec2.public_ip
    public_dns = data.aws_instance.ubuntu_ec2.public_dns
    state      = data.aws_instance.ubuntu_ec2.instance_state
    type       = data.aws_instance.ubuntu_ec2.instance_type
    ami        = data.aws_instance.ubuntu_ec2.ami
  }
}

# Recurso para crear un archivo de configuración local para el backend
resource "local_file" "backend_env" {
  content  = <<-EOT
    PORT=${var.app_port}
    NODE_ENV=${var.environment}
  EOT
  filename = "${path.module}/.env"
}

# Recurso para comprimir el código fuente del backend
data "archive_file" "backend_code" {
  type        = "zip"
  source_dir  = path.module
  output_path = "${path.module}/backend.zip"
  excludes    = [
    ".git", ".terraform", "terraform.tfstate", "terraform.tfstate.backup", 
    "node_modules", ".DS_Store", "backend.zip"
  ]
  depends_on = [local_file.backend_env]
}

# Recurso para desplegar el backend en la instancia EC2
resource "null_resource" "deploy_backend" {
  # Trigger para forzar la ejecución en cada apply
  triggers = {
    always_run = timestamp()
    code_hash  = data.archive_file.backend_code.output_base64sha256
  }

  # Copiar el archivo zip a la instancia EC2
  provisioner "file" {
    source      = data.archive_file.backend_code.output_path
    destination = "/tmp/backend.zip"

    connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = file("${path.module}/${var.key_name}.pem")
      host        = data.aws_instance.ubuntu_ec2.public_ip
    }
  }

  # Ejecutar comandos en la instancia EC2 para desplegar el backend
  provisioner "remote-exec" {
    inline = [
      "echo 'Instalando dependencias necesarias...'",
      "sudo apt-get update",
      "sudo apt-get install -y unzip",
      
      "echo 'Verificando si Docker está instalado...'",
      "if ! command -v docker &> /dev/null; then",
      "  echo 'Instalando Docker...'",
      "  sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common",
      "  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -",
      "  sudo add-apt-repository -y \"deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable\"",
      "  sudo apt-get update",
      "  sudo apt-get install -y docker-ce docker-ce-cli containerd.io",
      "  sudo usermod -aG docker ubuntu",
      "  sudo systemctl enable docker",
      "  sudo systemctl start docker",
      "fi",
      
      "echo 'Deteniendo servicios existentes...'",
      "sudo docker stop ${var.app_name}-container || true",
      "sudo docker rm ${var.app_name}-container || true",
      
      "echo 'Preparando directorio de la aplicación...'",
      "mkdir -p ~/${var.app_name}",
      "rm -rf ~/${var.app_name}/*",
      "unzip -o /tmp/backend.zip -d ~/${var.app_name}",
      "cd ~/${var.app_name}",
      
      "echo 'Construyendo imagen Docker...'",
      "sudo docker build -t ${var.app_name}:latest ~/${var.app_name}",
      
      "echo 'Iniciando contenedor Docker...'",
      "sudo docker run -d --name ${var.app_name}-container -p ${var.app_port}:3015 -e PORT=${var.app_port} -e NODE_ENV=${var.environment} ${var.app_name}:latest",
      
      "echo 'Backend desplegado correctamente en http://${data.aws_instance.ubuntu_ec2.public_ip}:${var.app_port}'"
    ]

    connection {
      type        = "ssh"
      user        = "ubuntu"
      private_key = file("${path.module}/${var.key_name}.pem")
      host        = data.aws_instance.ubuntu_ec2.public_ip
    }
  }

  depends_on = [data.archive_file.backend_code]
}
