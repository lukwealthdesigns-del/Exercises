import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaUpload, FaFilePdf, FaFileWord, FaFileExcel, FaFileImage, FaTimes } from 'react-icons/fa'
import { uploadDocument } from '../documentSlice'

const DocumentUpload = () => {
  const [dragActive, setDragActive] = useState(false)
  const dispatch = useDispatch()
  const { isUploading } = useSelector(state => state.documents)
  
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }
  
  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }
  
  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }
  
  const handleFile = (file) => {
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('File size must be less than 10MB')
      return
    }
    
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'image/jpeg', 'image/png', 'image/gif', 'text/plain']
    
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload PDF, Word, Excel, Image, or Text files only')
      return
    }
    
    dispatch(uploadDocument(file))
  }
  
  const getFileIcon = (type) => {
    if (type.includes('pdf')) return <FaFilePdf className="text-red-500" />
    if (type.includes('word')) return <FaFileWord className="text-blue-500" />
    if (type.includes('excel') || type.includes('sheet')) return <FaFileExcel className="text-green-500" />
    if (type.includes('image')) return <FaFileImage className="text-purple-500" />
    return <FaFilePdf className="text-gray-500" />
  }

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${dragActive ? 'border-naija-green bg-green-50 dark:bg-green-900/10' : 'border-gray-300 dark:border-gray-600 hover:border-naija-green dark:hover:border-naija-green'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <FaUpload className="text-4xl text-gray-400 dark:text-gray-500 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400 mb-2">
          <span className="font-medium text-naija-green">Click to upload</span> or drag and drop
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          PDF, DOC, XLS, Images, TXT (Max 10MB)
        </p>
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={handleChange}
          disabled={isUploading}
        />
        <label
          htmlFor="file-upload"
          className={`inline-block mt-4 px-6 py-3 rounded-lg cursor-pointer transition duration-300 ${isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-naija-green hover:bg-green-700 text-white'}`}
        >
          {isUploading ? 'Uploading...' : 'Choose File'}
        </label>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
          <FaFilePdf className="text-2xl text-red-500 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-800 dark:text-white">PDF</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
          <FaFileWord className="text-2xl text-blue-500 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-800 dark:text-white">Word</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
          <FaFileExcel className="text-2xl text-green-500 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-800 dark:text-white">Excel</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
          <FaFileImage className="text-2xl text-purple-500 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-800 dark:text-white">Images</p>
        </div>
      </div>
    </div>
  )
}

export default DocumentUpload