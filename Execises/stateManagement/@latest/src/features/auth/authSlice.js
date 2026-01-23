import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Mock API calls
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (email === 'user@example.com' && password === 'password') {
        return {
          user: {
            id: '1',
            name: 'Naija User',
            email: email,
            avatar: '🇳🇬'
          },
          token: 'mock-jwt-token-12345'
        }
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth
      if (!token) throw new Error('No token found')
      
      // Simulate token refresh
      await new Promise(resolve => setTimeout(resolve, 500))
      return { token: `refreshed-${token}` }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null
  },
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.token = action.payload.token
      })
  }
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer