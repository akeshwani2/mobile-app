'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { generateCode } from '@/utils/generateCode'
import CodeEditor from '@/components/Editor/CodeEditor'
import { enhancePrompt } from '@/utils/promptEnhancer'

// Dynamically import WebContainer to avoid SSR issues
const LivePreview = dynamic(() => import('@/components/Editor/LivePreview'), {
  ssr: false
})

export default function BuilderPage() {
  const [prompt, setPrompt] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')
  const [previewMode, setPreviewMode] = useState<'mobile' | 'tablet' | 'desktop'>('mobile')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    try {
      setError('')
      setIsGenerating(true)
      setIsEnhancing(true)

      // First, enhance the prompt
      const enhancedPrompt = await enhancePrompt(prompt)
      setIsEnhancing(false)

      // Then generate code with the enhanced prompt
      const code = await generateCode(enhancedPrompt)
      setGeneratedCode(code)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate code')
    } finally {
      setIsGenerating(false)
      setIsEnhancing(false)
    }
  }

  const handlePartialUpdate = async (description: string) => {
    try {
      const prompt = `I have this HTML code:
      ${generatedCode}
      
      ${description}
      Return the complete updated code without any explanations.`

      const updatedCode = await generateCode(prompt)
      setGeneratedCode(updatedCode)
    } catch (err) {
      setError('Failed to update code. Please try again.')
    }
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
          {isEnhancing ? 'Enhancing Prompt...' : 
           isGenerating ? 'Generating...' : 'Generate Website'}
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
          <CodeEditor 
            code={generatedCode}
            onUpdate={setGeneratedCode}
            onPartialUpdate={handlePartialUpdate}
          />
          {error && <div className="text-red-500">{error}</div>}
        </div>
      </main>
    </div>
  )
}
