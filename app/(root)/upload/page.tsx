'use client'

import React, { useState } from 'react'
import { ITransaction } from '@/lib/database/models/transaction.model';
import { uploadTransactions } from '@/lib/actions/upload.action';
import { set } from 'mongoose';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast'

//this is a page that allows user to select json file out of caspion, and uses the uploadTransactions function to upload the transactions to the database

const Upload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast()

  const activateToast = () => {
    toast({
      title: "JSON file uploaded successfully!",
      description: "Friday, February 10, 2023 at 5:57 PM",
      // action: (
      //   <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
      // ),
    })
  }

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

      reader.onload = async (event) => {
        try {
          setIsLoading(true);
          const parsedData = JSON.parse(event.target?.result as string);
          const response = await uploadTransactions(parsedData);
          response === 'success' && activateToast()
          setIsLoading(false);


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
        <Button disabled={isLoading} onClick={handleFileUpload}>Upload JSON File</Button>

      </div>
    </div>
  )
}


export default Upload