import OpenAI from 'openai';

// Initialize the OpenAI client with the API key from environment variables
export function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.error('OpenAI API key is not set in environment variables');
    return null;
  }
  
  if (apiKey === 'sk-your-openai-api-key') {
    console.error('OpenAI API key is set to the placeholder value. Please update it with a real API key.');
    return null;
  }
  
  return new OpenAI({
    apiKey,
  });
}

// Available OpenAI models for document generation
export const OPENAI_MODELS = {
  GPT4O: 'gpt-4o',
  GPT4: 'gpt-4-turbo',
  GPT35_TURBO: 'gpt-3.5-turbo',
} as const;

// Default model to use
export const DEFAULT_MODEL = OPENAI_MODELS.GPT4O;

// Generate a document template using OpenAI
export async function generateDocumentTemplate(
  templateType: string,
  details: Record<string, any>,
  model: string = DEFAULT_MODEL
): Promise<string | null> {
  const openai = getOpenAIClient();
  
  if (!openai) {
    throw new Error('OpenAI client initialization failed. Please check your API key.');
  }
  
  try {
    // Create a prompt based on the template type and details
    const prompt = createPromptForTemplate(templateType, details);
    
    // Call the OpenAI API
    const response = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: 'You are a legal document assistant that creates professional document templates. Format your response in Markdown.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });
    
    // Extract and return the generated template
    return response.choices[0]?.message?.content || null;
  } catch (error: any) {
    // Handle specific OpenAI API errors
    if (error.status === 401) {
      throw new Error('Invalid OpenAI API key. Please check your credentials.');
    } else if (error.status === 429) {
      throw new Error('OpenAI API rate limit exceeded. Please try again later.');
    } else if (error.status === 500) {
      throw new Error('OpenAI API server error. Please try again later.');
    }
    
    console.error('Error generating document template with OpenAI:', error);
    throw new Error(`Failed to generate template: ${error.message || 'Unknown error'}`);
  }
}

// Create a prompt for the template generation based on template type and details
function createPromptForTemplate(
  templateType: string,
  details: Record<string, any>
): string {
  const detailsString = Object.entries(details)
    .filter(([_, value]) => value)
    .map(([key, value]) => `- ${key}: ${value}`)
    .join('\n');
  
  return `
Please create a professional ${templateType} document template with the following details:

${detailsString}

The document should be well-structured, comprehensive, and follow standard legal formatting.
Include all necessary sections, clauses, and signature blocks.
Format the response in Markdown with proper headings, lists, and emphasis where appropriate.
`;
} 