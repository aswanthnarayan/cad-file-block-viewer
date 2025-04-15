import React, { useState } from 'react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from '@material-tailwind/react'
import { FileText, File } from 'lucide-react'
import axiosInstance from '../apis/axios';
import { useNavigate } from 'react-router-dom'
import { useFile } from '../context/fileContext';


const LandingPage = () => {
  const navigate = useNavigate()
  const { setFileId } = useFile();
  const [isDragging, setIsDragging] = useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const uploadFile = async (file) => {
    if (!file || !file.name.endsWith('.dxf')) {
      return toast.error('Please upload a valid DXF file (.dxf)');
    }
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axiosInstance.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      const result = response.data;
      handleUploadSuccess(result);
    } catch (err) {
      handleUploadError(err);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
  
    const file = e.dataTransfer.files[0];
    uploadFile(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    uploadFile(file);
  };

  const handleUploadSuccess = (result) => {
    setFileId(result.fileId);
    // console.log(result);
    toast.success(`Successfully uploaded! Found ${result.blockDefinitionsFound} definitions and ${result.blockInsertionsFound} insertions`);
    setTimeout(() => {
      navigate(`/dashboard/${result.fileId}`);
    }, 2000)
  }

  const handleUploadError = (error) => {
    toast.error(error.message || 'Something went wrong while uploading');
    setTimeout(() => {}, 5000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Welcome to DXF Block Viewer
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Upload your DXF files to extract and visualize block definitions and insertions
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md">
            <div className="text-center border-b pb-4">
              <h2 className="text-2xl">Upload DXF File</h2>
              <p className="text-gray-500 mt-2">
                Drag and drop your DXF file here or click to browse
              </p>
            </div>
            
            <div className="p-6">
              <div
                onDragOver={handleDrag}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300
                  ${isDragging ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'}
                `}
              >
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="flex gap-2">
                    <FileText className="h-12 w-12 text-gray-400" />
                    <File className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Drop your DXF file here</h3>
                  <p className="mt-2 text-sm text-gray-500">or</p>
                  <Button 
                    variant="filled" 
                    color="blue" 
                    className="mt-2 w-full text-gray-900 hover:bg-blue-700 hover:text-white"
                    onClick={() => document.getElementById('fileInput').click()}
                  >
                    Browse Files
                  </Button>
                </div>
              </div>
              
              <input
                type="file"
                id="fileInput"
                accept=".dxf"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
