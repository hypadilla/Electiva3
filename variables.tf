# Variables para el proyecto Electiva3

variable "aws_region" {
  description = "Región de AWS donde se desplegarán los recursos"
  type        = string
  default     = "us-east-2"
}

variable "aws_access_key" {
  description = "Clave de acceso de AWS (para desarrollo, en producción usar variables de entorno)"
  type        = string
  default     = "AKIA5BZGUA6YIFYLPWOJ"
  sensitive   = true
}

variable "aws_secret_key" {
  description = "Clave secreta de AWS (para desarrollo, en producción usar variables de entorno)"
  type        = string
  default     = "s4GiQX6X/ogKPwY9kooGuxZJD7USQD7hUYbabtEV"
  sensitive   = true
}

variable "app_name" {
  description = "Nombre de la aplicación"
  type        = string
  default     = "electiva3-app"
}

variable "environment" {
  description = "Entorno de despliegue (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "vpc_cidr" {
  description = "CIDR block para la VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "subnet_cidr" {
  description = "CIDR block para la subred pública"
  type        = string
  default     = "10.0.1.0/24"
}

variable "instance_type" {
  description = "Tipo de instancia EC2"
  type        = string
  default     = "t2.micro"
}

variable "ami_id" {
  description = "ID de la AMI para la instancia EC2"
  type        = string
  default     = "ami-04f167a56786e4b09"  # Ubuntu 24.04 en us-east-2
}

variable "key_name" {
  description = "Nombre del key pair para acceder a las instancias EC2"
  type        = string
  default     = "ElectivaIII"
}

variable "ssh_allowed_cidr" {
  description = "CIDR block para permitir conexiones SSH"
  type        = string
  default     = "0.0.0.0/0"  # En producción, limitar a IPs específicas
}

variable "docker_image" {
  description = "Imagen de Docker a utilizar"
  type        = string
  default     = "ubuntu:latest"
}

variable "docker_container_name" {
  description = "Nombre del contenedor Docker"
  type        = string
  default     = "ubuntu-container"
}

variable "docker_host" {
  description = "Host de Docker, depende del sistema operativo (unix:///var/run/docker.sock para Linux/macOS, npipe:////.//pipe//docker_engine para Windows)"
  type        = string
  default     = "unix:///var/run/docker.sock"
}

variable "docker_host_port" {
  description = "Puerto expuesto en el host para Docker"
  type        = number
  default     = 8080
}

variable "docker_container_port" {
  description = "Puerto expuesto por el contenedor Docker"
  type        = number
  default     = 80
}
