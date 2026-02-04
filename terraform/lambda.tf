# mailsender
module "mailsender" {
  source        = "./modules/apicall"
  function_name = "mailsender"
  role          = aws_iam_role.mailsenderLambdaRole.arn
  nodeLayer     = aws_lambda_layer_version.mailsenderLambdaLayer.arn
}


output "mailsenderFunctionUrl" {
  value = module.mailsender.url
}
