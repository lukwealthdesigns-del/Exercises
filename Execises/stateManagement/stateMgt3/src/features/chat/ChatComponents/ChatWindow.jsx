import { useSelector } from 'react-redux'
import { FaUser, FaRobot, FaSpinner } from 'react-icons/fa'

const ChatWindow = () => {
  const { messages, isAgentTyping } = useSelector(state => state.chat)
  const selectedDocument = useSelector(state => state.documents.selectedDocument)
  
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-NG', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
      {/* Chat header */}
      <div className="flex items-center justify-between p-3 md:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex items-center space-x-2 md:space-x-3">
          <div className="p-1.5 md:p-2 bg-naija-green rounded-full">
            <FaRobot className="text-white text-sm md:text-base" />
          </div>
          <div>
            <h3 className="font-medium text-gray-800 dark:text-white text-sm md:text-base">Naija AI Assistant</h3>
            <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm">
              {selectedDocument ? `Analyzing: ${selectedDocument.name.substring(0, 20)}${selectedDocument.name.length > 20 ? '...' : ''}` : 'Ready to assist'}
            </p>
          </div>
        </div>
        <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
          {messages.length} message{messages.length !== 1 ? 's' : ''}
        </div>
      </div>
      
      {/* Chat messages */}
      <div className="h-64 md:h-96 overflow-y-auto p-3 md:p-4 bg-gray-50 dark:bg-gray-900 rounded-lg space-y-3 md:space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8 md:py-12">
            <FaRobot className="text-3xl md:text-4xl text-gray-400 dark:text-gray-600 mx-auto mb-3 md:mb-4" />
            <h3 className="text-base md:text-lg font-medium text-gray-700 dark:text-gray-300 mb-1 md:mb-2">
              Welcome to Naija AI Assistant!
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base max-w-md mx-auto px-2">
              Upload a document or ask me anything. I'm here to help you analyze and understand your documents.
            </p>
            <div className="mt-4 md:mt-6 grid grid-cols-2 gap-2 md:gap-3 max-w-md mx-auto px-2">
              <div className="bg-white dark:bg-gray-800 p-2 md:p-3 rounded-lg text-xs md:text-sm">
                "Summarize my document"
              </div>
              <div className="bg-white dark:bg-gray-800 p-2 md:p-3 rounded-lg text-xs md:text-sm">
                "Extract key points"
              </div>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isAI ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[80%] md:max-w-xs lg:max-w-md rounded-2xl p-3 md:p-4 ${message.isAI ? 'bg-white dark:bg-gray-800 rounded-bl-none' : 'bg-naija-green text-white rounded-br-none'}`}
              >
                <div className="flex items-center mb-1 md:mb-2">
                  {message.isAI ? (
                    <FaRobot className="mr-1 md:mr-2 text-gray-500 dark:text-gray-400 text-xs md:text-sm" />
                  ) : (
                    <FaUser className="mr-1 md:mr-2 text-xs md:text-sm" />
                  )}
                  <span className="text-xs md:text-sm font-medium">
                    {message.isAI ? 'AI Assistant' : 'You'}
                  </span>
                  <span className="text-xs opacity-75 ml-1 md:ml-2">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                <p className={`text-sm md:text-base ${message.isAI ? 'text-gray-700 dark:text-gray-300' : ''}`}>
                  {message.content}
                </p>
                {message.isError && (
                  <div className="mt-1 md:mt-2 text-xs text-red-500">
                    Error occurred
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        
        {/* Typing indicator */}
        {isAgentTyping && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-bl-none p-3 md:p-4 max-w-[80%] md:max-w-xs">
              <div className="flex items-center mb-1 md:mb-2">
                <FaRobot className="mr-1 md:mr-2 text-gray-500 dark:text-gray-400 text-xs md:text-sm" />
                <span className="text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">
                  AI Assistant
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <FaSpinner className="animate-spin text-naija-green text-xs md:text-sm" />
                <span className="text-gray-600 dark:text-gray-400 text-xs md:text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatWindow