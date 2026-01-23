import { FaChartLine } from 'react-icons/fa'
import Header from './features/ui/Header'
import ExpenseForm from './features/expenses/ExpenseComponents/ExpenseForm'
import ExpenseList from './features/expenses/ExpenseComponents/ExpenseList'
import BudgetSummary from './features/expenses/ExpenseComponents/BudgetSummary'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      
      <main className="container mx-auto px-4 lg:px-6 py-8">
        <div className="mb-8">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                <div className="mb-4 lg:mb-0 lg:mr-8">
                  <h2 className="text-xl lg:text-2xl font-semibold text-gray-800 flex items-center mb-2">
                    <span className="mr-3 text-purple-600 font-bold text-2xl">RTK</span>
                    Expense Tracker
                  </h2>
                  <p className="text-gray-600 text-sm lg:text-base">
                    State managed with Redux Toolkit slices and selectors
                  </p>
                </div>
                <div className="hidden lg:flex items-center">
                  <FaChartLine className="text-5xl text-purple-600 opacity-50" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-6 lg:mb-8">
            <div className="lg:col-span-2">
              <BudgetSummary />
            </div>
            
            <div className="lg:col-span-1">
              <ExpenseForm />
            </div>
          </div>
          
          <ExpenseList />
          
          <footer className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
            <p className="mb-2">
              <strong>Redux Toolkit Features:</strong> Slices, Selectors, Immutable Updates
            </p>
            <p>State automatically persists via Redux store</p>
          </footer>
        </div>
      </main>
    </div>
  )
}

export default App