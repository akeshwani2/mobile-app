import { useState } from 'react'

interface CodeEditorProps {
  code: string
  onUpdate: (newCode: string) => void
  onPartialUpdate: (description: string) => void
}

export default function CodeEditor({ code, onUpdate, onPartialUpdate }: CodeEditorProps) {
  const [changeDescription, setChangeDescription] = useState('')

  const handleUpdate = () => {
    onPartialUpdate(changeDescription)
    setChangeDescription('')
  }

  return (
    <div className="flex flex-col gap-4 bg-gray-50 p-4 rounded-lg">
      <textarea
        value={code}
        onChange={(e) => onUpdate(e.target.value)}
        className="w-full h-[200px] font-mono text-sm p-2 border rounded text-black"
      />
      <input
        placeholder="Describe what you want to change (e.g., 'make the delete button a red trash icon')"
        value={changeDescription}
        onChange={(e) => setChangeDescription(e.target.value)}
        className="w-full p-3 border rounded-lg text-sm text-black" 
      />
      <button
        onClick={handleUpdate}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Update Design
      </button>
    </div>
  )
}