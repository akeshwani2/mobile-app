interface ValidationResult {
    isValid: boolean
    errors: string[]
    fixedCode?: string
  }
  
  export async function validateAndFixCode(code: string): Promise<ValidationResult> {
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(code, 'text/html')
      const errors: string[] = []
  
      // Check for parsing errors
      const parserErrors = doc.querySelectorAll('parsererror')
      if (parserErrors.length > 0) {
        errors.push('Invalid HTML structure')
        return { isValid: false, errors }
      }
  
      // Basic validation checks
      if (!code.includes('<!DOCTYPE html>')) {
        code = `<!DOCTYPE html>\n${code}`
      }
  
      if (!code.includes('<meta name="viewport"')) {
        const headTag = code.indexOf('</head>')
        if (headTag !== -1) {
          code = code.slice(0, headTag) +
            '<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
            code.slice(headTag)
        }
      }
  
      return {
        isValid: errors.length === 0,
        errors,
        fixedCode: code
      }
    } catch (error) {
      return {
        isValid: false,
        errors: ['Failed to validate code'],
      }
    }
  }