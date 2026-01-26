import { createSlice } from '@reduxjs/toolkit'

// Get initial theme from localStorage or system preference
const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme) return savedTheme
  
  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  
  return 'light'
}

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: true,
    theme: getInitialTheme(),
    notifications: []
  },
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload
    },
    setTheme: (state, action) => {
      state.theme = action.payload
      // Save to localStorage
      localStorage.setItem('theme', action.payload)
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload)
      // Keep only last 5 notifications
      if (state.notifications.length > 5) {
        state.notifications.pop()
      }
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(notif => notif.id !== action.payload)
    },
    clearNotifications: (state) => {
      state.notifications = []
    }
  }
})

export const { 
  toggleSidebar, 
  setSidebarOpen,
  setTheme, 
  addNotification, 
  removeNotification, 
  clearNotifications 
} = uiSlice.actions

export default uiSlice.reducer