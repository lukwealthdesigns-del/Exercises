import { useDispatch, useSelector } from 'react-redux'
import { FaFilePdf, FaFileWord, FaFileExcel, FaFileImage, FaFileAlt, FaTrash, FaEye, FaDownload } from 'react-icons/fa'
import { deleteDocument, selectDocument } from '../documentSlice'

const DocumentList = () => {
  const dispatch = useDispatch()
  const { documents, selectedDocument } = useSelector(state => state.documents)
  
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }
  
  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf': return <FaFilePdf className="text-red-500" />
      case 'doc':
      case 'docx': return <FaFileWord className="text-blue-500" />
      case 'xls':
      case 'xlsx': return <FaFileExcel className="text-green-500" />
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return <FaFileImage className="text-purple-500" />
      default: return <FaFileAlt className="text-gray-500" />
    }
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-8">
        <FaFileAlt className="text-4xl text-gray-400 dark:text-gray-600 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">No documents uploaded yet</p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
          Upload your first document to get started
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className={`flex items-center justify-between p-4 rounded-lg transition duration-200 ${selectedDocument?.id === doc.id ? 'bg-green-50 dark:bg-green-900/20 border border-naija-green' : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-white dark:bg-gray-700">
              {getFileIcon(doc.type)}
            </div>
            <div>
              <h3 className="font-medium text-gray-800 dark:text-white truncate max-w-xs">
                {doc.name}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span>{formatFileSize(doc.size)}</span>
                <span>•</span>
                <span>{doc.type.toUpperCase()}</span>
                <span>•</span>
                <span>{formatDate(doc.uploadedAt)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => dispatch(selectDocument(doc.id))}
              className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition duration-200"
              title="View document"
            >
              <FaEye />
            </button>
            <button
              onClick={() => {
                // In a real app, this would download the file
                alert(`Downloading ${doc.name}`)
              }}
              className="p-2 text-green-500 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition duration-200"
              title="Download"
            >
              <FaDownload />
            </button>
            <button
              onClick={() => {
                if (window.confirm(`Delete ${doc.name}?`)) {
                  dispatch(deleteDocument(doc.id))
                }
              }}
              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition duration-200"
              title="Delete document"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DocumentList