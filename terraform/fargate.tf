# credit to https://section411.com/2019/07/hello-world/ for
# guide on creating these resources

data "aws_ecs_task_definition" "graphql_api" {
  task_definition = "graphql-api"
}

resource "aws_ecs_service" "graphql_api" {
  name            = "graphql-api"
  cluster         = aws_ecs_cluster.main.id
  launch_type     = "FARGATE"
  desired_count   = 1
  task_definition = "graphql-api:${data.aws_ecs_task_definition.graphql_api.revision}"

  network_configuration {
    assign_public_ip = false

    security_groups = [
      aws_security_group.egress_all.id,
      aws_security_group.ingress_api.id,
      aws_security_group.db_access.id
    ]

    subnets = [
      aws_subnet.private_a.id,
      aws_subnet.private_b.id,
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
