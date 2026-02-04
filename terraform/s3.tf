resource "aws_s3_bucket" "mailsenderLambdaCode" {
  bucket = "mailsender-lambda-code-${terraform.workspace}"
}