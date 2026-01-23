import { FaWallet, FaChartLine } from 'react-icons/fa'
import Header from './components/Header'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'
import BudgetSummary from './components/BudgetSummary'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      
      <main className="container mx-auto px-4 lg:px-6 py-8">
        {/* Space before dashboard */}
        <div className="mb-8">
          <div className="max-w-6xl mx-auto">
            {/* Welcome Card with proper spacing */}
            <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8 mt-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                <div className="mb-4 lg:mb-0 lg:mr-8">
                  <h2 className="text-xl lg:text-2xl font-semibold text-gray-800 flex items-center mb-2">
                    <FaChartLine className="mr-3 text-naija-green" size={24} />
                    Welcome to Your Financial Dashboard
                  </h2>
                  <p className="text-gray-600 text-sm lg:text-base">
                    Take control of your finances. Track expenses, set budgets, and achieve your financial goals.
                  </p>
                </div>
                <div className="hidden lg:flex items-center">
                  <FaWallet className="text-5xl text-naija-green opacity-50" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto">
          {/* Grid Layout for Desktop */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-6 lg:mb-8">
            {/* Left Column - Budget Summary */}
            <div className="lg:col-span-2">
              <BudgetSummary />
            </div>
            
            {/* Right Column - Add New Expense */}
            <div className="lg:col-span-1">
              <ExpenseForm />
            </div>
          </div>
          
          {/* Expense List (Full Width) */}
          <ExpenseList />
          
          <footer className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
            <p className="flex items-center justify-center mb-2">
              <FaWallet className="mr-2" />
              <strong>Tip:</strong> Your expenses are automatically saved to your browser's localStorage.
            </p>
            <p className="mb-2">Close and reopen this app to see your data persist!</p>
            <p>Built with React, Zustand, and Tailwind CSS</p>
          </footer>
        </div>
      </main>
    </div>
  )
}

export default App