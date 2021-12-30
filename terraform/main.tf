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
