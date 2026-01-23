import { useState } from 'react'
import { FaWallet, FaBars, FaTimes } from 'react-icons/fa'
import { GiNigeria } from 'react-icons/gi'
import ConfirmationModal from './ConfirmationModal'
import useExpenseStore from '../stores/expenseStore'

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showClearModal, setShowClearModal] = useState(false)
  
  const clearAllExpenses = () => {
    useExpenseStore.setState({ 
      expenses: [], 
      totalBudget: 500000 
    })
    setShowClearModal(false)
  }

  return (
    <>
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white shadow-lg border-b border-gray-200">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between py-4">
            {/* Logo/Brand */}
            <div className="flex items-center space-x-3">
              <GiNigeria className="text-3xl text-naija-green flex-shrink-0" />
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-naija-green">Naija Expense Tracker</h1>
                <p className="text-gray-600 text-xs lg:text-sm hidden sm:block">
                  Track your expenses in Nigerian Naira
                </p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-500 mr-4">
                <FaWallet className="mr-2 flex-shrink-0" />
                <span className="hidden lg:inline">Auto-saved to browser</span>
                <span className="lg:hidden">Auto-saved</span>
              </div>
              
              <button
                onClick={() => setShowClearModal(true)}
                className="flex items-center px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition duration-300 text-sm lg:text-base"
              >
                <span className="hidden lg:inline">Clear All Data</span>
                <span className="lg:hidden">Clear All</span>
              </button>
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
          
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-3">
                <div className="flex items-center text-sm text-gray-500 px-2">
                  <FaWallet className="mr-3 flex-shrink-0" />
                  <span>Auto-saved to browser</span>
                </div>
                
                <button
                  onClick={() => setShowClearModal(true)}
                  className="flex items-center justify-center px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition duration-300"
                >
                  Clear All Data
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Clear Confirmation Modal */}
      <ConfirmationModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={clearAllExpenses}
        title="Clear All Data"
        message="Are you sure you want to clear all expenses and reset the budget? This action cannot be undone."
        confirmText="Clear All"
        confirmColor="red"
      />
    </>
  )
}

export default Header