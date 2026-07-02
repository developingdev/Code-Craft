import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';

dotenv.config();

const apiKey = process.env.ANTHROPIC_API_KEY;
let client: Anthropic | null = null;

if (apiKey) {
  client = new Anthropic({ apiKey });
  console.log('AI agent service connected to Anthropic Claude');
} else {
  console.log('ANTHROPIC_API_KEY is not set. Agent service is ready but disabled.');
}

export async function generateCode(prompt: string): Promise<string> {
  if (!client) {
    return 'AI features not enabled. Set ANTHROPIC_API_KEY to use this feature.';
  }

  try {
    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `You are a helpful coding assistant. Generate TypeScript code for the following request:\n\n${prompt}`
        }
      ]
    });

    const response = message.content[0];
    if (response.type === 'text') {
      return response.text;
    }
    return 'Failed to generate code';
  } catch (error) {
    console.error('Error generating code:', error);
    return 'Error generating code. Please try again.';
  }
}

export async function analyzeCode(code: string): Promise<string> {
  if (!client) {
    return 'AI features not enabled. Set ANTHROPIC_API_KEY to use this feature.';
  }

  try {
    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `Analyze the following code and provide feedback on quality, performance, and security:\n\n\`\`\`\n${code}\n\`\`\``
        }
      ]
    });

    const response = message.content[0];
    if (response.type === 'text') {
      return response.text;
    }
    return 'Failed to analyze code';
  } catch (error) {
    console.error('Error analyzing code:', error);
    return 'Error analyzing code. Please try again.';
  }
}

export function isReady(): boolean {
  return client !== null;
}
