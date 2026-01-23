import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaRobot, FaFileAlt, FaComments, FaCog } from 'react-icons/fa'
import { GiNigeria } from 'react-icons/gi'
import Login from './features/auth/AuthComponents/Login'
import UserMenu from './features/auth/AuthComponents/UserMenu'
import DocumentUpload from './features/documents/DocumentComponents/DocumentUpload'
import DocumentList from './features/documents/DocumentComponents/DocumentList'
import DocumentViewer from './features/documents/DocumentComponents/DocumentViewer'
import ChatWindow from './features/chat/ChatComponents/ChatWindow'
import ChatInput from './features/chat/ChatComponents/ChatInput'
import Sidebar from './features/ui/UIComponents/Sidebar'
import ThemeToggle from './features/ui/UIComponents/ThemeToggle'
import Notifications from './features/ui/UIComponents/Notifications'
import { logout, clearError } from './features/auth/authSlice'
import { clearDocuments } from './features/documents/documentSlice'
import { clearChat } from './features/chat/chatSlice'

function App() {
  const dispatch = useDispatch()
  const { user, isAuthenticated } = useSelector(state => state.auth)
  const { theme, sidebarOpen } = useSelector(state => state.ui)
  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])
  
  const handleLogout = () => {
    dispatch(logout())
    dispatch(clearDocuments())
    dispatch(clearChat())
  }
  
  if (!isAuthenticated) {
    return <Login />
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <GiNigeria className="text-3xl text-naija-green" />
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">
                  Naija AI Document Assistant
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-xs lg:text-sm">
                  Intelligent document analysis powered by AI
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Notifications />
              <UserMenu user={user} onLogout={handleLogout} />
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <div className="container mx-auto px-4 lg:px-6 py-8">
            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Left Column - Documents */}
              <div className="lg:col-span-2 space-y-6 lg:space-y-8">
                {/* Document Upload */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <div className="flex items-center mb-6">
                    <FaFileAlt className="text-2xl text-naija-green mr-3" />
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                      Upload Document
                    </h2>
                  </div>
                  <DocumentUpload />
                </div>
                
                {/* Document List */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <FaFileAlt className="text-2xl text-naija-green mr-3" />
                      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Your Documents
                      </h2>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                      All Files
                    </span>
                  </div>
                  <DocumentList />
                </div>
              </div>
              
              {/* Right Column - Chat */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 h-full">
                  <div className="flex items-center mb-6">
                    <FaComments className="text-2xl text-naija-green mr-3" />
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                      AI Assistant Chat
                    </h2>
                  </div>
                  <ChatWindow />
                  <ChatInput />
                </div>
              </div>
            </div>
            
            {/* Document Viewer Modal */}
            <DocumentViewer />
          </div>
        </main>
      </div>
      
      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <FaRobot className="text-2xl text-naija-green" />
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Powered by AI • Made in Nigeria 🇳🇬
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center text-gray-600 dark:text-gray-400 hover:text-naija-green transition duration-200">
                <FaCog className="mr-2" />
                Settings
              </button>
              <span className="text-sm text-gray-500 dark:text-gray-500">
                v1.0.0 • Redux Toolkit
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App