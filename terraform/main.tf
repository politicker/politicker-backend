terraform {
  backend "remote" {
    hostname     = "app.terraform.io"
    organization = "whos-home"

    workspaces {
      name = "politicker-backend"
    }
  }
}

provider "aws" {
  region = "us-east-2"

  default_tags {
    tags = {
      Application = "politicker"
    }
  }
}

output "env_file" {
  value = "${aws_s3_bucket.politicker_secrets.arn}/production/politicker-api.env"
}
