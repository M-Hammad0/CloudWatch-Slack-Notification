import { IncomingWebhook, IncomingWebhookResult } from "@slack/webhook";
const zlib = require("zlib");

exports.handler = async (event: any) => {
  let logEventPayload = null;
  const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!slackWebhookUrl) {
    console.error("SLACK_WEBHOOK_URL environment variable is not set!");
    return;
  }

  try {
    if (event.awslogs && event.awslogs.data) {
      const payload = Buffer.from(event.awslogs.data, "base64");

      logEventPayload = JSON.parse(
        zlib.unzipSync(payload).toString()
      )?.logEvents;
      if (!logEventPayload || !logEventPayload.length) {
        console.log("No Log Event", logEventPayload);
        return;
      }
    }

    const message = {
      text: JSON.stringify(logEventPayload),
    };
    const webhook = new IncomingWebhook(slackWebhookUrl);
    const result: IncomingWebhookResult = await webhook.send(message);
    console.log(`Slack notification sent: ${result.text}`);
  } catch (error) {
    console.log("Slack notification ERROR", error);
  }
};
