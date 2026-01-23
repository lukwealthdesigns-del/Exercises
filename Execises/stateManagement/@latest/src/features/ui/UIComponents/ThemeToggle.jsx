import { useDispatch, useSelector } from 'react-redux'
import { FaSun, FaMoon } from 'react-icons/fa'
import { setTheme } from '../uiSlice'

const ThemeToggle = () => {
  const dispatch = useDispatch()
  const { theme } = useSelector(state => state.ui)
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    dispatch(setTheme(newTheme))
  }
  
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition duration-200"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? <FaMoon /> : <FaSun />}
    </button>
  )
}

export default ThemeToggle