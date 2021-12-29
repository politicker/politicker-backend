# credit to https://section411.com/2019/07/hello-world/ for
# guide on creating these resources

resource "aws_ecs_service" "graphql_api" {
  name            = "graphql-api"
  task_definition = aws_ecs_task_definition.graphql_api.arn
  cluster         = aws_ecs_cluster.graphql_api.id
  launch_type     = "FARGATE"
  desired_count   = 1

  network_configuration {
    assign_public_ip = false

    security_groups = [
      aws_security_group.egress_all.id,
      aws_security_group.ingress_api.id,
    ]

    subnets = [
      aws_subnet.private_d.id,
      aws_subnet.private_e.id,
    ]
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.graphql_api.arn
    container_name   = "graphql-api"
    container_port   = "8000"
  }
}

resource "aws_ecs_cluster" "main" {
  name = "politicker"
}

resource "aws_cloudwatch_log_group" "graphql_api" {
  name = "/ecs/politicker-graphql-api"
}

resource "aws_ecs_task_definition" "graphql_api" {
  family             = "graphql-api"
  execution_role_arn = aws_iam_role.graphql_api_task_execution_role.arn

  container_definitions = jsonencode(
    [
      {
        "name" : "graphql-api",
        "image" : "politicker/graphql-api:latest",
        "portMappings" : [
          {
            "containerPort" : 8000
          }
        ],
        "logConfiguration" : {
          "logDriver" : "awslogs",
          "options" : {
            "awslogs-region" : "us-east-2",
            "awslogs-group" : aws_cloudwatch_log_group.graphql_api.name,
            "awslogs-stream-prefix" : "ecs"
          }
        }
      }
    ]
  )

  # These are the minimum values for Fargate containers.
  cpu                      = 256
  memory                   = 512
  requires_compatibilities = ["FARGATE"]

  # This is required for Fargate containers (more on this later).
  network_mode = "awsvpc"
}
