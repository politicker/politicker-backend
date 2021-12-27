# We'll eventually want a place to put our logs.
resource "aws_cloudwatch_log_group" "sun_api" {
  name = "/ecs/politicker-graphql-api"
}

# Here's our task definition, which defines the task that will be running to provide
# our service. The idea here is that if the service decides it needs more capacity,
# this task definition provides a perfect blueprint for building an identical container.
#
# If you're using your own image, use the path to your image instead of mine,
# i.e. `<your_dockerhub_username>/sun-api:latest`.
resource "aws_ecs_task_definition" "graphql_api" {
  family = "politicker-graphql-api"

  container_definitions = jsonencode(
    [
      {
        "name" : "politicker-graphql-api",
        "image" : "politicker/graphql-api:latest",
        "portMappings" : [
          {
            "containerPort" : 3000
          }
        ],
        "logConfiguration" : {
          "logDriver" : "awslogs",
          "options" : {
            "awslogs-region" : "us-east-2",
            "awslogs-group" : aws_cloudwatch_log_group.sun_api.name,
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
