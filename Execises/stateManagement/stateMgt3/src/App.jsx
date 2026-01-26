import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaRobot, FaFileAlt, FaComments, FaCog, FaBars, FaTimes } from 'react-icons/fa'
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
  const { theme } = useSelector(state => state.ui)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  
  // Apply theme to body
  useEffect(() => {
    const html = document.documentElement
    if (theme === 'dark') {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }, [theme])
  
  // Close mobile sidebar on route change
  useEffect(() => {
    if (window.innerWidth >= 768) {
      setMobileSidebarOpen(false)
    }
  }, [])
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileSidebarOpen(false)
      }
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  const handleLogout = () => {
    dispatch(logout())
    dispatch(clearDocuments())
    dispatch(clearChat())
  }
  
  if (!isAuthenticated) {
    return <Login />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Mobile sidebar backdrop */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
      
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between py-3 md:py-4">
            {/* Left: Logo and mobile menu button */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200"
              >
                {mobileSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
              
              <div className="flex items-center space-x-2 md:space-x-3">
                <GiNigeria className="text-2xl md:text-3xl text-naija-green flex-shrink-0" />
                <div>
                  <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">
                    Naija AI Assistant
                  </h1>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                    Intelligent document analysis
                  </p>
                </div>
              </div>
            </div>
            
            {/* Right: Actions */}
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="hidden md:flex items-center text-sm text-gray-500 dark:text-gray-400">
                <span>Welcome, {user?.name}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <ThemeToggle />
                <Notifications />
                <UserMenu user={user} onLogout={handleLogout} />
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>
        
        {/* Mobile Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 md:hidden ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <Sidebar onMobileClose={() => setMobileSidebarOpen(false)} />
        </div>
        
        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 md:py-8">
            {/* Welcome Card */}
            <div className="mb-6 md:mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-6 lg:p-8 transition-colors duration-300">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="mb-4 md:mb-0 md:mr-8">
                    <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-gray-800 dark:text-white flex items-center mb-2">
                      <FaRobot className="mr-3 text-naija-green" size={24} />
                      Welcome to Your AI Dashboard
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                      Upload documents and chat with your AI assistant for intelligent analysis
                    </p>
                  </div>
                  <div className="hidden md:flex items-center">
                    <FaFileAlt className="text-4xl md:text-5xl text-naija-green opacity-50" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {/* Left Column - Documents Section */}
              <div className="lg:col-span-2 space-y-4 md:space-y-6">
                {/* Document Upload Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-6 transition-colors duration-300">
                  <div className="flex items-center mb-4 md:mb-6">
                    <FaFileAlt className="text-xl md:text-2xl text-naija-green mr-3" />
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
                      Upload Document
                    </h2>
                  </div>
                  <DocumentUpload />
                </div>
                
                {/* Document List Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-6 transition-colors duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 space-y-3 sm:space-y-0">
                    <div className="flex items-center">
                      <FaFileAlt className="text-xl md:text-2xl text-naija-green mr-3" />
                      <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
                        Your Documents
                      </h2>
                    </div>
                    <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                      Recent Files
                    </span>
                  </div>
                  <DocumentList />
                </div>
              </div>
              
              {/* Right Column - Chat Section */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-6 h-full transition-colors duration-300">
                  <div className="flex items-center mb-4 md:mb-6">
                    <FaComments className="text-xl md:text-2xl text-naija-green mr-3" />
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
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
            
            {/* Footer */}
            <footer className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400 text-xs md:text-sm transition-colors duration-300">
              <p className="flex items-center justify-center mb-2">
                <FaCog className="mr-2" />
                <strong>Tip:</strong> Your data is securely stored and processed
              </p>
              <p className="mb-2">Close and reopen to continue where you left off</p>
              <p>Built with React, Redux Toolkit, and Gemini AI</p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App