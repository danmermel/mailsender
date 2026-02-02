terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.28.0"
    }
  }
  backend "s3" {
    bucket = "danmermel-terraform-state"
    key    = "mailsender/terraform.tfstate"
    region = "eu-west-1"
  }
}
provider "aws" {
  region = "eu-west-1"
}