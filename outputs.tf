# Outputs para el proyecto Electiva3

# Outputs de AWS
output "vpc_id" {
  description = "ID de la VPC creada"
  value       = aws_vpc.main.id
}

output "public_subnet_id" {
  description = "ID de la subred pública"
  value       = aws_subnet.public.id
}

output "security_group_id" {
  description = "ID del grupo de seguridad"
  value       = aws_security_group.app.id
}

output "instance_id" {
  description = "ID de la instancia EC2"
  value       = aws_instance.ubuntu_ec2.id
}

output "instance_public_ip" {
  description = "IP pública de la instancia EC2"
  value       = aws_instance.ubuntu_ec2.public_ip
}

output "instance_public_dns" {
  description = "DNS público de la instancia EC2"
  value       = aws_instance.ubuntu_ec2.public_dns
}

output "app_url" {
  description = "URL para acceder a la aplicación"
  value       = "http://${aws_instance.ubuntu_ec2.public_dns}"
}

output "ssh_command" {
  description = "Comando SSH para conectarse a la instancia"
  value       = "ssh -i ${var.key_name}.pem ubuntu@${aws_instance.ubuntu_ec2.public_dns}"
}
