import { InferenceClient } from "@huggingface/inference";

const client = new InferenceClient("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");

async function main() {
  const chatCompletion = await client.chatCompletion({
    provider: "fireworks-ai",
    model: "deepseek-ai/DeepSeek-R1",
    messages: [
      {
        role: "user",
        content: `My goal is to lose 2kg of fat by next month.
Create a sample schedule for me.
Outline practical steps for what I should do for this Monday-Sunday.`,
      },
    ],
  });

  console.log(chatCompletion.choices[0].message);
}

main();