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
  if (!event.body.mpname || !event.body.sendername || !event.body.senderaddress || !event.body.sendercomplaint ) {
    return {
      headers,
      statusCode: 400,
      body: JSON.stringify({ "ok": false, "message": "Missing required parameters" })
    }
  }

  let prompt = `Write an html email addressed to ${event.body.mpname}, who is the local MP for ${event.body.sendername}, whose address is ${event.body.senderaddress}. The email should 
                tell the MP that the sender is very unhappy about the new immigration rules that came into force in July 2025. The reasons for the sender's unhappiness are as follows: ${event.body.sendercomplaint}.
                The email should be in a respectful tone. Leave a single empty lines between paragraphs. Make sure to include ${event.body.sendername} and ${event.body.senderaddress} in the signature. Only return the html of the final email`

  // console.log(`Prompt: ${prompt}\n`);
  // console.log("Invoking model...\n");


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
  console.log(decodedResponseBody)
  const responsetxt = responseBody.choices[0].message.content.replace(/^<reasoning>.*<\/reasoning>/s,"").replace(/```html/g, "").replace(/```/g,"")


  return {
    headers,
    statusCode: 200,
    body: JSON.stringify({ "ok": true, "message": responsetxt })
  }

};



module.exports = {
  handler: handler
}