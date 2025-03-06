"use client";

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';


export function ImageUpload() {
  const [image, setImage] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
      };
      reader.readAsDataURL(file); // convert image to Data URL
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    maxFiles: 1
  });

  return (
    <div className={`w-full max-w-2xl mx-auto p-4`}>
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 transition-colors duration-200 ease-in-out cursor-pointer 
          flex flex-col items-center justify-center gap-4 
          ${isDragActive ? "border-blue-600 bg-blue-100" : "border-gray-300 hover:border-blue-400"}
        `}
      >
        <input {...getInputProps()} />
        
        {/* display image */}
        {image ? (
          <div className="relative w-full aspect-video">
            <img
              src={image}
              alt="Uploaded preview"
              className="rounded-lg object-contain w-full h-full"
            />
          </div>
        ) : (
          <>
            <div className="rounded-full bg-blue-100 p-4">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-center">
              <p className="text-lg font-medium">Drop your image here, or click to select</p>
              <p className="text-sm text-gray-500 mt-1">
                Supports: JPG, PNG, GIF, WEBP
              </p>
            </div>
          </>
        )}
      </div>

      {image && (
        <button
          onClick={() => setImage(null)}
          className="cursor-pointer  mt-4 text-sm text-red-600 hover:text-red-500 transition-colors"
        >
          Remove image
        </button>
      )}
    </div>
  );
}
