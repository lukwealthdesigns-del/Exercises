import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { addNotification } from '../ui/uiSlice'

// Mock document upload
export const uploadDocument = createAsyncThunk(
  'documents/upload',
  async (file, { dispatch, rejectWithValue }) => {
    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const mockDocument = {
        id: Date.now().toString(),
        name: file.name,
        size: file.size,
        type: file.type.split('/')[1] || 'document',
        uploadedAt: new Date().toISOString(),
        content: 'This is a mock document content for the AI assistant.'
      }
      
      // Add notification
      dispatch(addNotification({
        id: Date.now().toString(),
        type: 'success',
        message: `Document "${file.name}" uploaded successfully!`,
        timestamp: new Date().toISOString()
      }))
      
      return mockDocument
    } catch (error) {
      dispatch(addNotification({
        id: Date.now().toString(),
        type: 'error',
        message: `Failed to upload "${file.name}"`,
        timestamp: new Date().toISOString()
      }))
      return rejectWithValue(error.message)
    }
  }
)

const documentSlice = createSlice({
  name: 'documents',
  initialState: {
    documents: [],
    selectedDocument: null,
    isUploading: false,
    error: null
  },
  reducers: {
    deleteDocument: (state, action) => {
      state.documents = state.documents.filter(doc => doc.id !== action.payload)
      if (state.selectedDocument?.id === action.payload) {
        state.selectedDocument = null
      }
    },
    selectDocument: (state, action) => {
      state.selectedDocument = state.documents.find(doc => doc.id === action.payload) || null
    },
    clearDocuments: (state) => {
      state.documents = []
      state.selectedDocument = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadDocument.pending, (state) => {
        state.isUploading = true
        state.error = null
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.isUploading = false
        state.documents.unshift(action.payload)
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.isUploading = false
        state.error = action.payload
      })
  }
})

export const { deleteDocument, selectDocument, clearDocuments } = documentSlice.actions
export default documentSlice.reducer