'use client'

import React, { useState } from 'react'
import { ITransaction } from '@/lib/database/models/transaction.model';
import { uploadTransactions } from '@/lib/actions/upload.action';

//this is a page that allows user to select json file out of caspion, and uses the uploadTransactions function to upload the transactions to the database

const Upload = () => {
  console.log("this is the process.env:")
  console.log(process.env.MONGODB_URI)
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [jsonData, setJsonData] = useState<ITransaction[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      const file = event.target.files[0];
      setSelectedFile(file);
    }
  };

  const handleFileUpload = () => {
    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const parsedData = JSON.parse(event.target?.result as string);
          console.log(parsedData);
          uploadTransactions(parsedData);

        } catch (error) {
          console.error('Error parsing JSON:', error);
          // Handle the error as needed
        }
      };

      reader.readAsText(selectedFile);
    }
  };


  return (
    <div className='flex flex-col min-h-screen items-center justify-center'>
      <div>
        <h1>File Upload Component</h1>
        <input type="file" accept=".json" onChange={(e) => handleFileChange(e)} />
        <button onClick={handleFileUpload}>Upload JSON File</button>
      </div>
    </div>
  )
}

export default Upload