import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, CheckCircle, AlertCircle, Eye } from 'lucide-react';
import { Challenge } from '../types';

interface ChallengeInterfaceProps {
  challenge: Challenge;
  onBack: () => void;
  onComplete: () => void;
}

export default function ChallengeInterface({ challenge, onBack, onComplete }: ChallengeInterfaceProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [showSource, setShowSource] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reset state when challenge changes
    setInput('');
    setOutput('');
    setShowSource(false);
    setIsCompleted(false);
  }, [challenge.id]);

  const processInput = (userInput: string) => {
    // For demonstration, we'll use a simple approach for each level
    switch (challenge.id) {
      case 1: // Basic XSS - no filtering
        return userInput;
        
      case 2: // Only block lowercase <script> tags
        return userInput.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/g, (match) => {
          return match === match.toLowerCase() ? '[BLOCKED]' : match;
        });
        
      case 3: // Filter only exact <script> (case sensitive)
        return userInput.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/g, (match) => {
          return match.includes('<script>') ? '[BLOCKED]' : match;
        });
        
      case 4: // HTML entity encoding for parentheses
        return userInput
          .replace(/\(/g, '&#40;')
          .replace(/\)/g, '&#41;');
          
      case 5: // Image tag with onerror
        // Only block script tags, allow img tags
        return userInput.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, '[BLOCKED]');
        
      default:
        return userInput;
    }
  };

  const checkForXSS = (output: string, level: number): boolean => {
    // Create a temporary div to check the output
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = output;
    
    switch (level) {
      case 1: // Basic XSS - any script execution
        return /<script\b[^>]*>([\s\S]*?)<\/script>|on\w+\s*=|javascript:/i.test(output);
        
      case 2: // Uppercase vs Lowercase
        const hasUppercaseScript = /<script[^>]*>([\s\S]*?)<\/script>/i.test(output) && 
                                 /[A-Z]/.test(output);
        const hasUppercaseEvent = /on\w+\s*=/i.test(output) && /[A-Z]/.test(output);
        return hasUppercaseScript || hasUppercaseEvent;
        
      case 3: // Mixed-case tag injection
        const mixedScripts = tempDiv.querySelectorAll('script, sCrIpT, ScRiPt, SCRIPT');
        return mixedScripts.length > 0;
        
      case 4: // HTML entity encoding
        // Check for script tag and either alert or onerror without parentheses
        const hasScriptTag = /<script\b[^>]*>([\s\S]*?)<\/script>/i.test(output);
        const hasAlertOrOnerror = /alert\s*\(|onerror\s*=/i.test(output);
        const hasEncodedParentheses = output.includes('&#40;') || output.includes('&#41;');
        
        // Success if either:
        // 1. Using template literals: alert`1`
        // 2. Using String.fromCharCode
        // 3. Using onerror without parentheses
        return hasScriptTag && (
          output.includes('alert`1`') || 
          output.includes('String.fromCharCode') ||
          (hasAlertOrOnerror && !hasEncodedParentheses)
        );
               
      case 5: // Image onerror
        const imgs = tempDiv.getElementsByTagName('img');
        for (let i = 0; i < imgs.length; i++) {
          if (imgs[i].onerror !== null) {
            return true;
          }
        }
        return false;
        
      default:
        return false;
    }
  };

  const handleSubmit = () => {
    const processed = processInput(input);
    setOutput(processed);
    
    // Check for XSS
    const hasXSS = checkForXSS(processed, challenge.id);
    
    if (hasXSS && !isCompleted) {
      setIsCompleted(true);
      
      // Show success message
      setTimeout(() => {
        alert('🎉 Challenge completed! XSS payload successfully executed!');
        
        // Execute the payload
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = processed;
        
        // Execute any scripts
        const scripts = tempDiv.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
          try {
            const script = document.createElement('script');
            script.text = scripts[i].text;
            document.body.appendChild(script).parentNode?.removeChild(script);
          } catch (e) {
            console.error('Error executing script:', e);
          }
        }
        
        // Move to next level
        onComplete();
      }, 100);
    }
  };

  const getSourceCode = (level: number): string => {
    const userInput = input || 'your_payload_here';
    const processedOutput = output || processInput(userInput);

    switch (level) {
      case 1:
        return `// Basic XSS - no filtering
<div id="output">${processedOutput}</div>`;
      
      case 2:
        return `// Only lowercase <script> tags are blocked
// Try using uppercase letters in your script tag
<div id="output">${processedOutput}</div>`;
      
      case 3:
        return `// Only exact <script> is filtered, but not case variations
// Try different case variations like <ScRiPt> or <SCRIPT>
<div id="output">${processedOutput}</div>`;
      
      case 4:
        return `// Parentheses ( ) are encoded as HTML entities
// Find a way to execute code without using parentheses
<div id="output">${processedOutput}</div>`;
      
      case 5:
        return `// Image tags are allowed, but script tags are blocked
// Try creating an image with an invalid source and onerror handler
<div id="output">${processedOutput}</div>`;
      
      default:
        return `<div id="output">${processedOutput}</div>`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Challenges
        </button>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Level {challenge.id}: {challenge.title}</h2>
              <p className="text-gray-600 mt-2">{challenge.description}</p>
            </div>
            {isCompleted && (
              <CheckCircle className="h-8 w-8 text-green-500" />
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Input</h3>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter your XSS payload here..."
                className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <button
                onClick={handleSubmit}
                className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Test Payload
              </button>
              <button
                onClick={() => setShowSource(!showSource)}
                className="mt-4 ml-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Eye className="h-4 w-4 mr-2 inline" />
                {showSource ? 'Hide' : 'Show'} Source
              </button>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Output (Reflected)</h3>
              <div 
                className="w-full h-32 p-4 border border-gray-300 rounded-lg bg-gray-50 overflow-auto"
                dangerouslySetInnerHTML={{ __html: output || '<em class="text-gray-400">Output will appear here...</em>' }}
              />
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <div className="flex items-center text-red-600">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span className="text-sm">For educational purposes only</span>
            </div>
          </div>

          {showSource && (
            <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-gray-800 font-medium mb-2">📄 Live HTML Source Code (updates with your input):</p>
              <pre className="text-sm font-mono bg-gray-100 p-4 rounded overflow-x-auto whitespace-pre-wrap">
                <code>{getSourceCode(challenge.id)}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}