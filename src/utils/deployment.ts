interface DeploymentResult {
    success: boolean
    url?: string
    error?: string
  }
  
  export async function deployToVercel(code: string): Promise<DeploymentResult> {
    if (!process.env.NEXT_PUBLIC_VERCEL_TOKEN) {
      throw new Error('Vercel token is not configured')
    }
  
    try {
      const response = await fetch('https://api.vercel.com/v1/deployments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_VERCEL_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: `ai-site-${Date.now()}`,
          files: [{
            file: 'index.html',
            data: code
          }],
          projectSettings: {
            framework: null
          }
        })
      })
  
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Deployment failed')
      }
  
      return {
        success: true,
        url: data.url
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }