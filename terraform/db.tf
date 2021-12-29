resource "aws_db_subnet_group" "main" {
  name       = "politicker-db-subnet"
  subnet_ids = ["${aws_subnet.private_a.id}", "${aws_subnet.private_b.id}"]

  tags = {
    Name = "politicker-db-subnet"
    app  = "politicker"
  }
}

resource "random_password" "password" {
  length           = 32
  special          = true
  override_special = "_%@"
}

resource "aws_db_instance" "main" {
  identifier             = "politicker-db"
  allocated_storage      = 10
  engine                 = "postgres"
  instance_class         = "db.t4g.micro"
  username               = "politicker"
  password               = random_password.password.result
  vpc_security_group_ids = [aws_security_group.ingress_db.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name
}
