locals {
  functions = toset([
    "import-feeds",
    "parse-and-store-feeds",
    "propublica"
  ])
}

resource "aws_lambda_function" "functions" {
  for_each      = local.functions
  function_name = each.value
  role          = aws_iam_role.lambda.arn
  handler       = "main"
  runtime       = "go1.x"

  vpc_config {
    subnet_ids         = [aws_subnet.private_a.id, aws_subnet.private_b.id]
    security_group_ids = [aws_security_group.db_access.id, aws_security_group.egress_all.id]
  }
}

resource "aws_iam_role" "lambda" {
  name = "politicker-lambda-role"
  path = "/"

  assume_role_policy = jsonencode({
    Version : "2012-10-17",
    Statement : [
      {
        Action : "sts:AssumeRole",
        Principal : {
          Service : [
            "ec2.amazonaws.com",
            "lambda.amazonaws.com"
          ]
        },
        Effect : "Allow",
        Sid : ""
      }
    ]
  })
}
