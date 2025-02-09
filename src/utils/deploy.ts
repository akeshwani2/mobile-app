export async function deployToVercel(generatedCode: string) {
    // Create a new deployment using Vercel API
    const deployment = await fetch('https://api.vercel.com/v1/deployments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_VERCEL_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'ai-generated-site',
        files: [{
          file: 'index.html',
          data: generatedCode
        }],
        projectSettings: {
          framework: null
        }
      })
    })
  
    return deployment.json()
  }