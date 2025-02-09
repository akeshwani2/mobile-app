import { useEffect, useRef } from 'react'

interface LivePreviewProps {
  code: string
  viewportMode: 'mobile' | 'tablet' | 'desktop'
}

const viewportSizes = {
  mobile: 'w-[375px]',
  tablet: 'w-[768px]',
  desktop: 'w-full'
}

export default function LivePreview({ code, viewportMode }: LivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (iframeRef.current && code) {
      const iframe = iframeRef.current
      const doc = iframe.contentDocument || iframe.contentWindow?.document
      
      if (doc) {
        // Wrap the generated code with necessary head content
        const wrappedCode = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1">
              <script src="https://cdn.tailwindcss.com"></script>
              <base target="_blank">
            </head>
            <body>
              ${code}
            </body>
          </html>
        `
        doc.open()
        doc.write(wrappedCode)
        doc.close()
      }
    }
  }, [code])

  return (
    <div className="w-full h-full flex justify-center bg-gray-100 rounded-lg p-4 overflow-auto">
      <iframe
        ref={iframeRef}
        className={`h-[600px] bg-white rounded-lg shadow-lg ${viewportSizes[viewportMode]}`}
        title="Preview"
        sandbox="allow-scripts allow-same-origin allow-forms"
        srcDoc=""
      />
    </div>
  )
}