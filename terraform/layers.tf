//zip up the directory that has all the node modules
data "archive_file" "apiLayerZip" {
  type        = "zip"
  source_dir  = "../lambda/nodejs"
  output_path = "../lambda/nodejs-${terraform.workspace}.zip"
}

//upload the zips to s3
resource "aws_s3_object" "apiLayerZipObject" {
  bucket = aws_s3_bucket.mailsenderLambdaCode.id
  key    = "nodejs-${terraform.workspace}.zip"
  source = data.archive_file.apiLayerZip.output_path
  source_hash   = filemd5(data.archive_file.apiLayerZip.output_path)
}

# create the nodejs layer for the API
resource "aws_lambda_layer_version" "mailsenderLambdaLayer" {
  layer_name          = "mailsenderLambdaLayer-${terraform.workspace}"
  s3_bucket           = aws_s3_bucket.mailsenderLambdaCode.bucket
  s3_key              = aws_s3_object.apiLayerZipObject.key
  source_code_hash    = data.archive_file.apiLayerZip.output_base64sha256
  compatible_runtimes = ["nodejs22.x"]
  depends_on = [  aws_s3_object.apiLayerZipObject]
}
