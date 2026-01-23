import { useState } from 'react'
import { FaPlus, FaCheckCircle, FaTimesCircle, FaCalendarAlt, FaTag, FaMoneyBillWave } from 'react-icons/fa'
import useExpenseStore from '../stores/expenseStore'

const categories = [
  'Food & Dining',
  'Transportation',
  'Housing',
  'Utilities',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Education',
  'Savings',
  'Other'
]

const ExpenseForm = () => {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(categories[0])
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)
  
  const addExpense = useExpenseStore((state) => state.addExpense)
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!description.trim() || !amount || parseFloat(amount) <= 0) {
      setShowError(true)
      setTimeout(() => setShowError(false), 3000)
      return
    }
    
    addExpense({
      description,
      amount: parseFloat(amount),
      category,
      date
    })
    
    // Show success message
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
    
    // Reset form
    setDescription('')
    setAmount('')
    setCategory(categories[0])
    setDate(new Date().toISOString().split('T')[0])
  }
  
  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
        <h2 className="text-2xl font-bold text-naija-green mb-6 flex items-center">
          <FaPlus className="mr-3" />
          Add New Expense
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <FaMoneyBillWave className="mr-2" />
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What did you spend on?"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-naija-green focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <FaMoneyBillWave className="mr-2" />
              Amount (₦)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="1"
              step="0.01"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-naija-green focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <FaTag className="mr-2" />
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-naija-green focus:border-transparent"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
              <FaCalendarAlt className="mr-2" />
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-naija-green focus:border-transparent"
              required
            />
          </div>
          
          <div className="pt-2">
            <button
              type="submit"
              className="w-full px-6 py-3 bg-naija-green text-white font-medium rounded-lg hover:bg-green-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-naija-green focus:ring-opacity-50 flex items-center justify-center"
            >
              <FaPlus className="mr-3" />
              Add Expense
            </button>
          </div>
        </form>
      </div>
      
      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center max-w-sm">
            <FaCheckCircle className="mr-3 flex-shrink-0" />
            <span>Expense added successfully!</span>
          </div>
        </div>
      )}
      
      {/* Error Popup */}
      {showError && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg flex items-center max-w-sm">
            <FaTimesCircle className="mr-3 flex-shrink-0" />
            <span>Please enter valid expense details</span>
          </div>
        </div>
      )}
    </>
  )
}

export default ExpenseForm