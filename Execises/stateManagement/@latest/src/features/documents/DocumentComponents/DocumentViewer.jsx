import { useDispatch, useSelector } from 'react-redux'
import { FaTimes, FaFilePdf, FaFileWord, FaFileExcel, FaFileImage, FaFileAlt } from 'react-icons/fa'
import { selectDocument } from '../documentSlice'

const DocumentViewer = () => {
  const dispatch = useDispatch()
  const { selectedDocument } = useSelector(state => state.documents)
  
  if (!selectedDocument) return null
  
  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf': return <FaFilePdf className="text-4xl text-red-500" />
      case 'doc':
      case 'docx': return <FaFileWord className="text-4xl text-blue-500" />
      case 'xls':
      case 'xlsx': return <FaFileExcel className="text-4xl text-green-500" />
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return <FaFileImage className="text-4xl text-purple-500" />
      default: return <FaFileAlt className="text-4xl text-gray-500" />
    }
  }
  
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
          onClick={() => dispatch(selectDocument(null))}
        />
        
        {/* Modal panel */}
        <div className="relative inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl w-full">
          {/* Header */}
          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-600">
            <div className="flex items-center space-x-4">
              {getFileIcon(selectedDocument.type)}
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                  {selectedDocument.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedDocument.type.toUpperCase()} • {formatFileSize(selectedDocument.size)}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => dispatch(selectDocument(null))}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition duration-200"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
          
          {/* Content */}
          <div className="px-6 py-8">
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Document Information
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Upload Date</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {formatDate(selectedDocument.uploadedAt)}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400">File Type</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {selectedDocument.type.toUpperCase()}
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                Document Preview
              </h4>
              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 min-h-[300px]">
                <div className="prose dark:prose-invert max-w-none">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                    Document Content Preview
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {selectedDocument.content}
                  </p>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4">
                    <p className="text-yellow-700 dark:text-yellow-300">
                      <strong>Note:</strong> This is a simulated document preview. In a real application, 
                      this would display the actual document content with AI-powered analysis features.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  alert(`Analyzing "${selectedDocument.name}" with AI...`)
                }}
                className="px-4 py-2 bg-naija-green text-white rounded-lg hover:bg-green-700 transition duration-200"
              >
                Analyze with AI
              </button>
              <button
                onClick={() => dispatch(selectDocument(null))}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocumentViewer