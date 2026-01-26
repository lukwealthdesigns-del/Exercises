import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaUser, FaLock, FaSignInAlt, FaRobot } from 'react-icons/fa'
import { GiNigeria } from 'react-icons/gi'
import { loginUser, clearError } from '../authSlice'

const Login = () => {
  const [email, setEmail] = useState('user@example.com')
  const [password, setPassword] = useState('password')
  const dispatch = useDispatch()
  const { loading, error } = useSelector(state => state.auth)
  
  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(loginUser({ email, password }))
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-md transition-colors duration-300">
        <div className="text-center mb-6 md:mb-8">
          <div className="flex items-center justify-center mb-4">
            <GiNigeria className="text-4xl md:text-5xl text-naija-green mr-3" />
            <FaRobot className="text-3xl md:text-4xl text-gray-600 dark:text-gray-400" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Naija AI Assistant
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
            Sign in to access your documents
          </p>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 md:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-naija-green focus:border-transparent text-sm md:text-base"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-3 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 md:py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-naija-green focus:border-transparent text-sm md:text-base"
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-naija-green text-white py-2 md:py-3 px-4 rounded-lg hover:bg-green-700 transition duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 md:h-5 md:w-5 border-b-2 border-white mr-2"></div>
                Signing in...
              </>
            ) : (
              <>
                <FaSignInAlt className="mr-2" />
                Sign In
              </>
            )}
          </button>
          
          <div className="text-center text-xs md:text-sm text-gray-500 dark:text-gray-400">
            <p>Demo Credentials:</p>
            <p className="font-mono text-xs">user@example.com / password</p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login