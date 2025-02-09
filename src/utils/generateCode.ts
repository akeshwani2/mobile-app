import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT = `You are an expert web developer. Generate clean, responsive HTML using Tailwind CSS.
Follow these rules strictly:
- Return ONLY the HTML code that goes inside the body tag
- Do not include any explanations or comments
- Use semantic HTML5 elements
- Make the design mobile-first and responsive
- Include necessary JavaScript functionality inline
- Use Tailwind CSS classes for all styling
- Ensure the code is complete and functional

Example format of your response:
<div class="container mx-auto p-4">
  <!-- Your HTML here -->
</div>`

export async function generateCode(prompt: string): Promise<string> {
  if (!process.env.NEXT_PUBLIC_GEMINI_KEY) {
    throw new Error('Gemini API key is not configured')
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const result = await model.generateContent([
      { text: SYSTEM_PROMPT },
      { text: `Generate only the HTML code for: ${prompt}. Do not include any explanations or comments.` }
    ]);

    const response = await result.response;
    const text = response.text();
    
    // Clean up any markdown code blocks if present
    return text.replace(/```html/g, '').replace(/```/g, '').trim();
  } catch (error) {
    console.error('Code generation error:', error)
    throw error
  }
}