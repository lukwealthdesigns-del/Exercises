import { createSlice, createSelector } from '@reduxjs/toolkit'

const initialState = {
  expenses: [],
  totalBudget: 500000,
  loading: false,
  error: null
}

const expenseSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    addExpense: (state, action) => {
      state.expenses.push({
        ...action.payload,
        id: Date.now().toString(),
        date: action.payload.date || new Date().toISOString().split('T')[0]
      })
    },
    
    removeExpense: (state, action) => {
      state.expenses = state.expenses.filter(expense => expense.id !== action.payload)
    },
    
    updateExpense: (state, action) => {
      const index = state.expenses.findIndex(expense => expense.id === action.payload.id)
      if (index !== -1) {
        state.expenses[index] = { ...state.expenses[index], ...action.payload.updates }
      }
    },
    
    setBudget: (state, action) => {
      state.totalBudget = action.payload
    },
    
    clearAllExpenses: (state) => {
      state.expenses = []
      state.totalBudget = 500000
    }
  }
})

// Selectors
export const selectAllExpenses = (state) => state.expenses.expenses
export const selectTotalBudget = (state) => state.expenses.totalBudget

// Memoized selectors using createSelector
export const selectTotalSpent = createSelector(
  [selectAllExpenses],
  (expenses) => expenses.reduce((total, expense) => total + expense.amount, 0)
)

export const selectRemainingBudget = createSelector(
  [selectTotalBudget, selectTotalSpent],
  (totalBudget, totalSpent) => totalBudget - totalSpent
)

export const selectExpensesByCategory = createSelector(
  [selectAllExpenses],
  (expenses) => {
    const categories = {}
    expenses.forEach(expense => {
      if (!categories[expense.category]) {
        categories[expense.category] = 0
      }
      categories[expense.category] += expense.amount
    })
    return categories
  }
)

export const { 
  addExpense, 
  removeExpense, 
  updateExpense, 
  setBudget, 
  clearAllExpenses 
} = expenseSlice.actions

export default expenseSlice.reducer