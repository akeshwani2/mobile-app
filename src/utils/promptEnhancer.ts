import { GoogleGenerativeAI } from '@google/generative-ai';

const ENHANCER_PROMPT = `You are an expert web developer who helps convert simple website requests into detailed specifications.
Take the user's basic request and enhance it with specific details about:
1. Color scheme and design elements
2. Layout and spacing
3. Interactive features
4. Accessibility considerations
5. Mobile responsiveness
6. Micro-interactions and feedback

Format your response as a single, detailed request without explanations or sections.
Example input: "Make a todo list"
Example output: "Create a todo list application with a clean interface using a white background and subtle shadows. Include a prominent input field at the top with a blue accent color (#3B82F6). Add smooth sliding animations when tasks are added or removed. Each todo item should have a checkbox with a satisfying check animation, and a subtle red delete button that reveals on hover. Make the interface fully responsive with comfortable touch targets on mobile. Add visual feedback when tasks are completed with a gentle strikethrough and opacity change."`

export async function enhancePrompt(userPrompt: string): Promise<string> {
  if (!process.env.NEXT_PUBLIC_GEMINI_KEY) {
    throw new Error('Gemini API key is not configured')
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const result = await model.generateContent([
      { text: ENHANCER_PROMPT },
      { text: `Enhance this request: ${userPrompt}` }
    ]);

    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Prompt enhancement error:', error)
    // Fall back to original prompt if enhancement fails
    return userPrompt;
  }
}