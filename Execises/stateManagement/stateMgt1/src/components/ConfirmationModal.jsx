import { FaExclamationCircle, FaPrint, FaTrash, FaCheck, FaFileAlt } from 'react-icons/fa'
import SimpleModal from './SimpleModal'

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText, 
  confirmColor = "blue",
  icon: Icon
}) => {
  if (!isOpen) return null
  
  const colorClasses = {
    red: "bg-red-600 hover:bg-red-700",
    blue: "bg-blue-600 hover:bg-blue-700",
    green: "bg-green-600 hover:bg-green-700"
  }
  
  const DefaultIcon = confirmColor === 'red' ? FaTrash : confirmColor === 'blue' ? FaPrint : FaCheck
  const ModalIcon = Icon || DefaultIcon

  return (
    <SimpleModal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-4">
        <div className="flex items-center justify-center mb-4">
          <div className={`p-3 rounded-full ${confirmColor === 'red' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
            <ModalIcon className="h-8 w-8" />
          </div>
        </div>
        
        <p className="text-gray-600 text-center">{message}</p>
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-white rounded-lg transition duration-200 ${colorClasses[confirmColor]}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </SimpleModal>
  )
}

export default ConfirmationModal