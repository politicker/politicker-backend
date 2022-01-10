resource "aws_iam_role" "graphql_api_task_execution_role" {
  name               = "politicker-graphql-api-task-execution-role"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_assume_role.json
}

data "aws_iam_policy_document" "ecs_task_assume_role" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

data "aws_iam_policy" "ecs_task_execution_role" {
  name = "AmazonECSTaskExecutionRolePolicy"
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role" {
  role       = aws_iam_role.graphql_api_task_execution_role.name
  policy_arn = data.aws_iam_policy.ecs_task_execution_role.arn
}

resource "aws_s3_bucket" "politicker_secrets" {
  bucket = "politicker-secrets"
}

resource "aws_iam_role_policy" "env_var_access" {
  name = "politicker-graphql-api-task-execution-role-env"
  role = aws_iam_role.graphql_api_task_execution_role.id

  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Action" : [
          "s3:GetObject"
        ],
        "Resource" : [
          "${aws_s3_bucket.politicker_secrets.arn}/production/politicker-api.env"
        ]
      },
      {
        "Effect" : "Allow",
        "Action" : [
          "s3:GetBucketLocation"
        ],
        "Resource" : [
          aws_s3_bucket.politicker_secrets.arn
        ]
      }
    ]
  })
}
