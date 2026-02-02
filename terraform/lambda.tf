# cryptario
module "mailsender" {
  source        = "./modules/apicall"
  function_name = "mailsender"
  role          = aws_iam_role.mailsenderLambdaRole.arn
}


output "mailsenderFunctionUrl" {
  value = module.mailsender.url
}