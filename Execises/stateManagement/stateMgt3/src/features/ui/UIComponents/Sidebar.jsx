import { useDispatch, useSelector } from 'react-redux'
import { FaHome, FaFileAlt, FaComments, FaHistory, FaCog, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { toggleSidebar } from '../uiSlice'

const Sidebar = ({ onMobileClose }) => {
  const dispatch = useDispatch()
  const { sidebarOpen } = useSelector(state => state.ui)
  const { documents } = useSelector(state => state.documents)
  const { messages } = useSelector(state => state.chat)
  
  const menuItems = [
    { icon: <FaHome />, label: 'Dashboard', count: null },
    { icon: <FaFileAlt />, label: 'Documents', count: documents.length },
    { icon: <FaComments />, label: 'Chat', count: messages.length },
    { icon: <FaHistory />, label: 'History', count: null },
    { icon: <FaCog />, label: 'Settings', count: null },
  ]

  const handleItemClick = (index) => {
    // Close mobile sidebar on item click
    if (onMobileClose && window.innerWidth < 768) {
      onMobileClose()
    }
    
    // For demonstration, you could add navigation logic here
    if (index === 0) {
      // Navigate to dashboard
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <aside className={`h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'} md:block`}>
      {/* Toggle button - Desktop only */}
      <div className="hidden md:flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {sidebarOpen ? (
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">Navigation</h2>
        ) : (
          <div></div>
        )}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200 text-gray-600 dark:text-gray-300"
        >
          {sidebarOpen ? <FaChevronLeft /> : <FaChevronRight />}
        </button>
      </div>
      
      {/* Mobile header */}
      <div className="md:hidden p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">Menu</h2>
          <button
            onClick={onMobileClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200 text-gray-600 dark:text-gray-300"
          >
            <FaChevronLeft />
          </button>
        </div>
      </div>
      
      {/* Menu items */}
      <nav className="p-2 md:p-4 space-y-1 md:space-y-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => handleItemClick(index)}
            className={`w-full flex items-center p-3 rounded-lg transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${index === 1 ? 'bg-green-50 dark:bg-green-900/20 text-naija-green' : 'text-gray-700 dark:text-gray-300'}`}
          >
            <span className="text-xl">{item.icon}</span>
            {(sidebarOpen || onMobileClose) && (
              <>
                <span className="ml-3 flex-1 text-left text-sm md:text-base">{item.label}</span>
                {item.count !== null && (
                  <span className={`px-2 py-1 text-xs rounded-full ${index === 1 ? 'bg-naija-green text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                    {item.count}
                  </span>
                )}
              </>
            )}
          </button>
        ))}
      </nav>
      
      {/* Stats section - Desktop only */}
      {sidebarOpen && !onMobileClose && (
        <div className="hidden md:block absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Storage</span>
              <span className="text-sm font-medium text-gray-800 dark:text-white">1.2 GB / 5 GB</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-naija-green h-2 rounded-full" style={{ width: '24%' }}></div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              🇳🇬 AI Assistant v1.0
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}

export default Sidebar