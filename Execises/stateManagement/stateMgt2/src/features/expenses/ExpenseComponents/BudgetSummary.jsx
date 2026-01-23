import { useState } from 'react'
import { FaEdit, FaExclamationTriangle, FaChartPie, FaChartBar, FaMoneyBillWave, FaSyncAlt } from 'react-icons/fa'
import { useSelector, useDispatch } from 'react-redux'
import { 
  selectTotalBudget, 
  selectTotalSpent, 
  selectRemainingBudget, 
  selectExpensesByCategory,
  setBudget 
} from '../expenseSlice'

const BudgetSummary = () => {
  const totalBudget = useSelector(selectTotalBudget)
  const totalSpent = useSelector(selectTotalSpent)
  const remainingBudget = useSelector(selectRemainingBudget)
  const categories = useSelector(selectExpensesByCategory)
  const dispatch = useDispatch()
  
  const [isEditing, setIsEditing] = useState(false)
  const [newBudget, setNewBudget] = useState(totalBudget)
  
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount)
  }
  
  const handleSaveBudget = () => {
    if (newBudget > 0) {
      dispatch(setBudget(newBudget))
      setIsEditing(false)
    }
  }
  
  const spendingPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0
  const isOverBudget = remainingBudget < 0
  
  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-lg p-6 lg:p-8 border border-green-100">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 lg:mb-8">
        <div className="flex items-center">
          <FaChartPie className="mr-3 text-naija-green" size={28} />
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-naija-green">
              Budget Summary (Redux)
            </h2>
            <p className="text-sm text-gray-600 mt-1 flex items-center">
              <FaSyncAlt className="mr-1" size={12} />
              Updates via Redux selectors
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mt-4 lg:mt-0">
          {isEditing ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
              <div className="flex items-center space-x-3">
                <FaMoneyBillWave className="text-gray-500" />
                <input
                  type="number"
                  value={newBudget}
                  onChange={(e) => setNewBudget(parseFloat(e.target.value) || 0)}
                  className="px-4 py-2 border border-naija-green rounded-lg focus:outline-none focus:ring-2 focus:ring-naija-green w-full sm:w-auto"
                  min="1"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleSaveBudget}
                  className="px-4 py-2 bg-naija-green text-white rounded-lg hover:bg-green-700 transition duration-300 whitespace-nowrap"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setNewBudget(totalBudget)
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-300 whitespace-nowrap"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center bg-white px-4 py-3 rounded-lg shadow-sm">
                <FaMoneyBillWave className="text-gray-500 mr-3" />
                <div>
                  <div className="text-sm text-gray-500">Monthly Budget</div>
                  <div className="text-lg lg:text-xl font-semibold">
                    {formatAmount(totalBudget)}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 text-naija-green border border-naija-green rounded-lg hover:bg-green-50 transition duration-300 flex items-center justify-center whitespace-nowrap"
              >
                <FaEdit className="mr-2" />
                Edit Budget
              </button>
            </>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <div className="bg-white p-5 lg:p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm lg:text-base text-gray-500 mb-1 lg:mb-2 flex items-center">
            <FaChartBar className="mr-2" />
            Total Spent
          </div>
          <div className="text-2xl lg:text-3xl font-bold text-red-600">
            {formatAmount(totalSpent)}
          </div>
          <div className="text-sm text-gray-500 mt-2 lg:mt-3">
            {spendingPercentage.toFixed(1)}% of budget
          </div>
        </div>
        
        <div className="bg-white p-5 lg:p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="text-sm lg:text-base text-gray-500 mb-1 lg:mb-2">
            Remaining Budget
          </div>
          <div className={`text-2xl lg:text-3xl font-bold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
            {formatAmount(Math.abs(remainingBudget))}
          </div>
          <div className={`text-sm ${isOverBudget ? 'text-red-500' : 'text-green-500'} mt-2 lg:mt-3`}>
            {isOverBudget ? 'Over budget by' : 'Available'}
          </div>
        </div>
        
        <div className="bg-white p-5 lg:p-6 rounded-lg shadow-sm border border-gray-200 md:col-span-2 lg:col-span-1">
          <div className="text-sm lg:text-base text-gray-500 mb-1 lg:mb-2">Progress</div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2 lg:mb-3">
            <div 
              className={`h-3 rounded-full ${isOverBudget ? 'bg-red-500' : 'bg-green-500'}`}
              style={{ width: `${Math.min(spendingPercentage, 100)}%` }}
            ></div>
          </div>
          <div className="text-sm text-gray-500">
            {spendingPercentage.toFixed(1)}% spent
          </div>
        </div>
      </div>
      
      {Object.keys(categories).length > 0 && (
        <div className="mt-6 lg:mt-8">
          <h3 className="text-lg lg:text-xl font-semibold text-gray-800 mb-4 lg:mb-6">Spending by Category</h3>
          <div className="space-y-3 lg:space-y-4">
            {Object.entries(categories).map(([category, amount]) => (
              <div key={category} className="flex flex-col sm:flex-row sm:items-center justify-between">
                <span className="text-gray-700 mb-1 sm:mb-0">{category}</span>
                <div className="flex items-center space-x-4">
                  <div className="w-32 lg:w-48 bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="h-2.5 rounded-full bg-green-500"
                      style={{ width: `${(amount / totalSpent) * 100}%` }}
                    ></div>
                  </div>
                  <span className="font-medium text-gray-900 text-sm lg:text-base">
                    {formatAmount(amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {isOverBudget && (
        <div className="mt-6 lg:mt-8 p-4 lg:p-5 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <FaExclamationTriangle className="w-5 h-5 lg:w-6 lg:h-6 text-red-500 mr-2 lg:mr-3" />
            <span className="text-red-700 font-medium text-sm lg:text-base">Warning: You're over budget!</span>
          </div>
          <p className="text-red-600 text-sm lg:text-base mt-1 lg:mt-2">
            Consider reviewing your expenses and adjusting your budget if needed.
          </p>
        </div>
      )}
    </div>
  )
}

export default BudgetSummary