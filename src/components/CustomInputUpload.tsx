import { Upload } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';

type TypeProps = {
    setImage: (value: string | ArrayBuffer | null) => void;
};

const CustomInputUpload: React.FC<TypeProps> = ({ setImage }) => {
    const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    

    const handleRender = (file: File | null) => {
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result;
                setPreview(result);
                setImage(result);
            };
            reader.readAsDataURL(file);
        }
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            handleRender(file);
        }
    }, [setImage]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        onDragEnter: () => setIsHovered(true),
        onDragLeave: () => setIsHovered(false),
        onDropAccepted: () => setIsHovered(false),
    });

    const handlePaste = useCallback((e: ClipboardEvent) => {
        const itemsFiles = e.clipboardData?.items;
        if (itemsFiles) {
            const firstItemFile = itemsFiles[0];
            const file = firstItemFile.getAsFile();
            handleRender(file);
        }
    }, [setImage]);

    useEffect(() => {
        document.addEventListener('paste', handlePaste);
        return () => {
            document.removeEventListener('paste', handlePaste);
        };
    }, [handlePaste]);


    return (
        <div
            {...getRootProps()}
            style={{
                border: '2px dashed #cccccc',
                borderRadius: '10px',
                padding: '20px',
                width: '100%',
                height: '200px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: isHovered ? 'rgba(0, 0, 0, 0.1)' : 'white',
                transition: 'background-color 0.3s',
            }}
        >
            <input {...getInputProps()} />
            {
                isHovered ? (
                    <p>Relâchez le fichier ici ...</p>
                ) : !preview ? (
                    <div className='flex flex-col justify-center items-center space-y-5'>
                        <div className="rounded-full w-16 h-16 bg-blue-100 p-4">
                            <Upload className="w-8 h-8 text-blue-600" />
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-medium">Cliquez pour sélectionner une image</p>
                            <p className="text-sm text-gray-500 mt-1">Formats supportés : JPG, PNG, GIF, WEBP</p>
                        </div>
                    </div>
                ) : null
            }
        </div>
    );
};

export default CustomInputUpload;