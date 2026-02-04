
//zip up  js files for the pipeline
data "archive_file" "lambda" {
  type        = "zip"
  source_dir  = "../lambda/"
  output_path = "../temp/${var.function_name}.zip"
}

resource "aws_lambda_function" "mailsenderLambda" {
  filename         = data.archive_file.lambda.output_path
  function_name    = "${var.function_name}-${terraform.workspace}"
  role             = var.role
  handler          = "${var.function_name}.handler"
  runtime          = var.runtime
  timeout          = var.timeout
  layers           = [var.nodeLayer]
  source_code_hash = data.archive_file.lambda.output_base64sha256
}

resource "aws_cloudwatch_log_group" "mailsenderLG" {
  name              = "/aws/lambda/${var.function_name}-${terraform.workspace}"
  retention_in_days = 7
}

resource "aws_lambda_function_url" "mailsenderFunctionUrl" {
  function_name      = aws_lambda_function.mailsenderLambda.function_name
  authorization_type = "NONE"
  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["*"]
    allow_headers     = ["*"]
    max_age           = 86400
  }
}

output "url" {
  value = aws_lambda_function_url.mailsenderFunctionUrl.function_url
}
