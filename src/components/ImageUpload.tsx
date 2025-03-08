import React, { useState, useRef, useEffect } from "react";
import { Upload } from "lucide-react";


export function ImageUpload() {
  const [image, setImage] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [blurRadius, setBlurRadius] = useState(10);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);


  useEffect(() => {
    if (!image || !canvasRef.current || !imgRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    imgRef.current.onload = () => {
      if (!canvasRef.current || !imgRef.current || !ctx) return;
      canvasRef.current.width = imgRef.current.width;
      canvasRef.current.height = imgRef.current.height;
      ctx.drawImage(imgRef.current, 0, 0);
    };
  }, [image]);

  const handleDraw = (e: React.MouseEvent<HTMLCanvasElement>, drawing: boolean) => {
    if (!drawing || !canvasRef.current) return;
  
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
  
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
  
    const blurSize = 50;
    
    ctx.filter = `blur(${blurRadius}px)`;
  
    ctx.drawImage(
      canvas,
      x - blurSize / 2,
      y - blurSize / 2,
      blurSize,
      blurSize,
      x - blurSize / 2,
      y - blurSize / 2,
      blurSize,
      blurSize
    );
  };

  

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="space-y-4">
        <label className="border-2 border-dashed rounded-lg p-8 cursor-pointer flex flex-col items-center justify-center gap-4 border-gray-300 hover:border-blue-400">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (e) => setImage(e.target?.result as string);
                reader.readAsDataURL(file);
              }
            }}
            className="hidden"
          />
          {image ? (
            <div className="relative w-full aspect-video">
              <img ref={imgRef} src={image} alt="Uploaded preview" className="hidden" />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full cursor-crosshair"
                onMouseDown={() => setIsDrawing(true)}
                onMouseMove={(e) => handleDraw(e, isDrawing)}
                onMouseUp={() => setIsDrawing(false)}
                onMouseLeave={() => setIsDrawing(false)}
              />
            </div>
          ) : (
            <>
              <div className="rounded-full bg-blue-100 p-4">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-center">
                <p className="text-lg font-medium">Click to select an image</p>
                <p className="text-sm text-gray-500 mt-1">Supported formats: JPG, PNG, GIF, WEBP</p>
              </div>
            </>
          )}
        </label>
      </div>
    </div>
  );
}
