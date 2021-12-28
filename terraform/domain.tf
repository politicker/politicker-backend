data "aws_route53_zone" "internal" {
  name = "politicker-internal.net"
}

resource "aws_acm_certificate" "internal" {
  domain_name       = "politicker-internal.net"
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "internal" {
  for_each = {
    for dvo in aws_acm_certificate.internal.domain_validation_options : dvo.domain_name => {
      name    = dvo.resource_record_name
      record  = dvo.resource_record_value
      type    = dvo.resource_record_type
      zone_id = data.aws_route53_zone.internal.zone_id
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = each.value.zone_id
}

resource "aws_acm_certificate_validation" "internal" {
  certificate_arn         = aws_acm_certificate.internal.arn
  validation_record_fqdns = [for record in aws_route53_record.internal : record.fqdn]
}
