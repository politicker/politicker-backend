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
  filename      = "./main.zip"

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

resource "aws_lambda_permission" "allow_cloudwatch" {
  for_each      = local.functions
  function_name = each.value
  statement_id  = "AllowExecutionFromCloudWatch"
  action        = "lambda:InvokeFunction"
  principal     = "events.amazonaws.com"
  source_arn    = "arn:aws:events:eu-west-1:111122223333:rule/RunDaily"
  qualifier     = "${each.value}-alias"
}

resource "aws_lambda_alias" "test_alias" {
  for_each         = local.functions
  function_name    = each.value
  name             = "${each.value}-alias"
  description      = "alias"
  function_version = "$LATEST"
}