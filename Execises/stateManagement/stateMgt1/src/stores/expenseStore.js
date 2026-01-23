import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useExpenseStore = create(
  persist(
    (set, get) => ({
      // State
      expenses: [],
      totalBudget: 500000, // ₦500,000 default budget
      
      // Actions
      addExpense: (expense) => set((state) => ({
        expenses: [...state.expenses, {
          ...expense,
          id: Date.now().toString(), // Simple ID generation
          date: expense.date || new Date().toISOString().split('T')[0]
        }]
      })),
      
      removeExpense: (id) => set((state) => {
        if (!id) return state;
        return {
          expenses: state.expenses.filter(expense => expense.id !== id)
        }
      }),
      
      updateExpense: (id, updatedExpense) => set((state) => {
        if (!id || !updatedExpense) return state;
        return {
          expenses: state.expenses.map(expense => 
            expense.id === id ? { ...expense, ...updatedExpense } : expense
          )
        }
      }),
      
      setBudget: (amount) => set({ totalBudget: amount }),
      
      // Computed values (as getters)
      getTotalSpent: () => {
        const expenses = get().expenses
        return expenses.reduce((total, expense) => total + expense.amount, 0)
      },
      
      getRemainingBudget: () => {
        const totalBudget = get().totalBudget
        const totalSpent = get().getTotalSpent()
        return totalBudget - totalSpent
      },
      
      // Bonus: Get expenses by category
      getExpensesByCategory: () => {
        const expenses = get().expenses
        const categories = {}
        
        expenses.forEach(expense => {
          if (!categories[expense.category]) {
            categories[expense.category] = 0
          }
          categories[expense.category] += expense.amount
        })
        
        return categories
      }
    }),
    {
      name: 'expense-storage', // Key for localStorage
      partialize: (state) => ({ 
        expenses: state.expenses,
        totalBudget: state.totalBudget
      })
    }
  )
)

export default useExpenseStore