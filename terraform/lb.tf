resource "aws_lb_target_group" "graphql_api" {
  name        = "politicker-graphql-api"
  port        = 3000
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = aws_vpc.main.id

  health_check {
    enabled = true
    path    = "/health"
  }

  depends_on = [aws_alb.graphql_api]
}

resource "aws_alb" "graphql_api" {
  name               = "politicker-graphql-api-lb"
  internal           = false
  load_balancer_type = "application"

  subnets = [
    aws_subnet.public_d.id,
    aws_subnet.public_e.id,
  ]

  security_groups = [
    aws_security_group.http.id,
    aws_security_group.https.id,
    aws_security_group.egress_all.id,
  ]

  depends_on = [aws_internet_gateway.igw]
}

resource "aws_alb_listener" "graphql_api_http" {
  load_balancer_arn = aws_alb.graphql_api.arn
  port              = "443"
  protocol          = "HTTPS"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.graphql_api.arn
  }
}

resource "aws_lb_listener" "internal_http_redirect" {
  load_balancer_arn = aws_lb.graphql_api.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    order = 1
    type  = "redirect"

    redirect {
      host        = "#{host}"
      path        = "/#{path}"
      port        = "443"
      protocol    = "HTTPS"
      query       = "#{query}"
      status_code = "HTTP_302"
    }
  }
}
