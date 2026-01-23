import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// Mock AI response
export const sendQuery = createAsyncThunk(
  'chat/sendQuery',
  async ({ message, documentId }, { getState, rejectWithValue }) => {
    try {
      const state = getState()
      const selectedDoc = state.documents.selectedDocument
      
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const responses = [
        "Based on the document you provided, I can help you analyze the content. What specific aspect would you like me to focus on?",
        "I've reviewed your document. Here are the key points I extracted...",
        "This document appears to be well-structured. Would you like me to summarize it for you?",
        "I notice some important patterns in your document. Let me help you understand them better.",
        "As your Naija AI Assistant, I'm ready to help you work with this document. What would you like to know?"
      ]
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      
      let enhancedResponse = randomResponse
      if (selectedDoc) {
        enhancedResponse = `${randomResponse} I'm analyzing "${selectedDoc.name}" - a ${selectedDoc.type.toUpperCase()} file.`
      }
      
      return {
        id: Date.now().toString(),
        content: enhancedResponse,
        timestamp: new Date().toISOString(),
        isAI: true
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
    isAgentTyping: false,
    error: null
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push({
        id: Date.now().toString(),
        ...action.payload,
        timestamp: new Date().toISOString()
      })
    },
    clearChat: (state) => {
      state.messages = []
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendQuery.pending, (state) => {
        state.isAgentTyping = true
        state.error = null
      })
      .addCase(sendQuery.fulfilled, (state, action) => {
        state.isAgentTyping = false
        state.messages.push(action.payload)
      })
      .addCase(sendQuery.rejected, (state, action) => {
        state.isAgentTyping = false
        state.error = action.payload
        state.messages.push({
          id: Date.now().toString(),
          content: "Sorry, I encountered an error. Please try again.",
          timestamp: new Date().toISOString(),
          isAI: true,
          isError: true
        })
      })
  }
})

export const { addMessage, clearChat } = chatSlice.actions
export default chatSlice.reducer