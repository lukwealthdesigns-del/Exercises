import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaPaperPlane, FaMicrophone, FaImage } from 'react-icons/fa'
import { addMessage } from '../chatSlice'
import { sendQuery } from '../chatSlice'

const ChatInput = () => {
  const [input, setInput] = useState('')
  const dispatch = useDispatch()
  const { isAgentTyping } = useSelector(state => state.chat)
  const { selectedDocument } = useSelector(state => state.documents)
  
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim() || isAgentTyping) return
    
    // Add user message
    dispatch(addMessage({
      content: input,
      isAI: false
    }))
    
    // Send to AI
    dispatch(sendQuery({
      message: input,
      documentId: selectedDocument?.id
    }))
    
    setInput('')
  }
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }
  
  const quickPrompts = [
    "Summarize this document",
    "What are the key points?",
    "Translate to Pidgin English",
    "Analyze for business insights"
  ]

  return (
    <div className="space-y-4">
      {/* Quick prompts */}
      <div className="flex flex-wrap gap-2">
        {quickPrompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => {
              setInput(prompt)
              setTimeout(() => {
                const submitEvent = new Event('submit', { bubbles: true })
                document.querySelector('form')?.dispatchEvent(submitEvent)
              }, 100)
            }}
            className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-200"
            disabled={isAgentTyping}
          >
            {prompt}
          </button>
        ))}
      </div>
      
      {/* Input form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            className="p-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition duration-200"
            title="Attach image"
          >
            <FaImage />
          </button>
          
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask the AI assistant about your document..."
              className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-naija-green focus:border-transparent resize-none"
              rows="2"
              disabled={isAgentTyping}
            />
            
            <button
              type="button"
              className="absolute right-3 top-3 p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition duration-200"
              title="Voice input"
            >
              <FaMicrophone />
            </button>
          </div>
          
          <button
            type="submit"
            disabled={!input.trim() || isAgentTyping}
            className={`p-3 rounded-full transition duration-300 ${!input.trim() || isAgentTyping ? 'bg-gray-400 cursor-not-allowed' : 'bg-naija-green hover:bg-green-700'} text-white`}
            title="Send message"
          >
            <FaPaperPlane />
          </button>
        </div>
        
        <div className="flex justify-between items-center mt-2 px-1">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Press Enter to send • Shift+Enter for new line
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {selectedDocument && `Analyzing: ${selectedDocument.name}`}
          </p>
        </div>
      </form>
    </div>
  )
}

export default ChatInput