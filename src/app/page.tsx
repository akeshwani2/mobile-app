'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { generateCode } from '@/utils/generateCode'

// Dynamically import WebContainer to avoid SSR issues
const LivePreview = dynamic(() => import('@/components/Editor/LivePreview'), {
  ssr: false
})

export default function BuilderPage() {
  const [prompt, setPrompt] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')
  const [previewMode, setPreviewMode] = useState<'mobile' | 'tablet' | 'desktop'>('mobile')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      // Here you'll integrate with your chosen AI service
      // For MVP, you could use OpenAI's API directly from the frontend
      const response = await generateCode(prompt)
      setGeneratedCode(response)
    } catch (err) {
      setError('Failed to generate code. Please try again.')
    }
    setIsGenerating(false)
  }

  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr] gap-4 p-4">
      <header className="flex flex-col gap-4">
        <textarea
          className="w-full p-4 rounded-lg border text-black"
          placeholder="Describe your website..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          onClick={handleGenerate}
          className="bg-foreground text-background px-6 py-2 rounded-full"
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate Website'}
        </button>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <LivePreview code={generatedCode} viewportMode={previewMode} />
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            {['mobile', 'tablet', 'desktop'].map((mode) => (
              <button
                key={mode}
                onClick={() => setPreviewMode(mode as any)}
                className={`px-4 py-2 rounded ${
                  previewMode === mode ? 'bg-foreground text-background' : 'bg-gray-100'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
          {error && <div className="text-red-500">{error}</div>}
        </div>
      </main>
    </div>
  )
}
