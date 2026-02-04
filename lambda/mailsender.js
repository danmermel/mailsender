const headers = { "Content-type": "application/json" }
const {
  BedrockRuntimeClient,
  InvokeModelCommand
} = require("@aws-sdk/client-bedrock-runtime");

const AWS_REGION = "eu-west-1";

const MODEL_ID = "openai.gpt-oss-safeguard-20b";

const handler = async function (event, context) {
  if (!event.body) {
    return {
      headers,
      statusCode: 400,
      body: JSON.stringify({ "ok": false, "message": "Missing body" })
    }
  }

  event.body = JSON.parse(event.body)
  const prompt = event.body.prompt
  if (!prompt) {
    return {
      headers,
      statusCode: 400,
      body: JSON.stringify({ "ok": false, "message": "Missing required prompt" })
    }
  }

  console.log(`Prompt: ${prompt}\n`);
  console.log("Invoking model...\n");


  // Create a new Bedrock Runtime client instance.
  const client = new BedrockRuntimeClient({ region: AWS_REGION });

  // Prepare the payload for the model.
  const payload = {
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 1000,
    messages: [
      {
        role: "user",
        content: [{ type: "text", text: prompt }],
      },
    ],
  };

  // Invoke Claude with the payload and wait for the response.
  const command = new InvokeModelCommand({
    contentType: "application/json",
    body: JSON.stringify(payload),
    modelId: MODEL_ID,
  });

  const apiResponse = await client.send(command);

  // Decode and return the response(s)
  const decodedResponseBody = new TextDecoder().decode(apiResponse.body);
  const responseBody = JSON.parse(decodedResponseBody);
  const responsetxt = responseBody.choices[0].message.content.replace(/^<reasoning>.*<\/reasoning>/,"")


  return {
    headers,
    statusCode: 200,
    body: JSON.stringify({ "ok": true, "message": responsetxt })
  }

};



module.exports = {
  handler: handler
}