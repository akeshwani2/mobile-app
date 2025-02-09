const SYSTEM_PROMPT = `You are an expert web developer. Generate clean, responsive HTML using Tailwind CSS.
Follow these rules strictly:
- Return ONLY the HTML code that goes inside the body tag
- Do not include any explanations or comments
- Use semantic HTML5 elements
- Make the design mobile-first and responsive
- Include necessary JavaScript functionality inline
- Use Tailwind CSS classes for all styling
- Ensure the code is complete and functional
- Ensure complete compatibility with all devices and browsers

Example format of your response:
<div class="container mx-auto p-4">
  <!-- Your HTML here -->
</div>`

export async function generateCode(prompt: string): Promise<string> {
  if (!process.env.NEXT_PUBLIC_OPENAI_KEY) {
    throw new Error('OpenAI API key is not configured')
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { 
            role: "user", 
            content: `Generate only the HTML code for: ${prompt}. Do not include any explanations or comments.`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      throw new Error('Failed to generate code')
    }

    const data = await response.json()
    const code = data.choices[0].message.content.trim()
    
    // Additional cleanup to remove any markdown code blocks if present
    return code.replace(/```html/g, '').replace(/```/g, '').trim()
  } catch (error) {
    console.error('Code generation error:', error)
    throw error
  }
}