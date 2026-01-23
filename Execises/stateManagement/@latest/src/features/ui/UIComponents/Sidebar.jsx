import { useDispatch, useSelector } from 'react-redux'
import { FaHome, FaFileAlt, FaComments, FaHistory, FaCog, FaBars, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { toggleSidebar } from '../uiSlice'

const Sidebar = () => {
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

  return (
    <aside className={`fixed left-0 top-0 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40 ${sidebarOpen ? 'w-64' : 'w-16'}`}>
      {/* Toggle button */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {sidebarOpen ? (
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">Navigation</h2>
        ) : (
          <div></div>
        )}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition duration-200"
        >
          {sidebarOpen ? <FaChevronLeft /> : <FaBars />}
        </button>
      </div>
      
      {/* Menu items */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`w-full flex items-center p-3 rounded-lg transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${index === 1 ? 'bg-green-50 dark:bg-green-900/20 text-naija-green' : 'text-gray-700 dark:text-gray-300'}`}
          >
            <span className="text-xl">{item.icon}</span>
            {sidebarOpen && (
              <>
                <span className="ml-3 flex-1 text-left">{item.label}</span>
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
      
      {/* Stats section */}
      {sidebarOpen && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
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