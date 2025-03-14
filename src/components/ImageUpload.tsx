import React, { useState, useRef, useEffect } from "react";
import { Download, Eraser, Trash, Upload } from "lucide-react";
import RangeSlider from "./RangeSlider";
import ActionButton from "./ActionButton";


export function ImageUpload() {
  const [image, setImage] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [blurRadius, setBlurRadius] = useState(5);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const originalImageDataRef = useRef<ImageData | null>(null);


  useEffect(() => {
    if (!image) return;
    
    const img = new Image();
    img.onload = () =>{
      if (!canvasRef.current) return;
      
      const ctx = canvasRef.current.getContext('2d'); 

      if (!ctx) return;

      const width = Math.max(1, img.naturalWidth);
      const height = Math.max(1, img.naturalHeight);  

      canvasRef.current.width = width;
      canvasRef.current.height = height;
      
      ctx.drawImage(img, 0, 0);

      if (width > 0 && height > 0) {
        try {
          originalImageDataRef.current = ctx.getImageData(0, 0, width, height);
        } catch (error) {
          console.error("Erreur lors de la récupération des données d'image:", error);
        }
      }
      if (imgRef.current) {
        imgRef.current.src = img.src;
      }
    }

    img.src = image;
    
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

  const handleCancelBlur = () => {
    if (!canvasRef.current || !originalImageDataRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    ctx.putImageData(originalImageDataRef.current, 0, 0);
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "blurred-image.png"; 
    link.click();
  };

  
  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="space-y-4">
          {image ? (
            <div className="space-y-4">
            <div className="relative w-full aspect-video">
              <img 
                ref={imgRef} 
                src={image} 
                alt="Uploaded preview" 
                className="hidden" 
              />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full cursor-crosshair"
                onMouseDown={() => setIsDrawing(true)}
                onMouseMove={(e) => handleDraw(e, isDrawing)}
                onMouseUp={() => setIsDrawing(false)}
                onMouseLeave={() => setIsDrawing(false)}
              />
            </div>
            
            <div>
              <RangeSlider
                label="Blur intensity"
                value={blurRadius}
                min={1}
                max={20}
                onChange={setBlurRadius} 
              />
            </div>
            
            <div className="flex gap-4">
              <ActionButton
                onClick={handleCancelBlur}
                icon={<Eraser className="w-4 h-4" />}
                label="Cancel blur"
                bgColor="bg-yellow-100"
                textColor="text-yellow-700"
                hoverColor="bg-yellow-200"
              />
              <ActionButton
                onClick={handleDownload}
                icon={<Download className="w-4 h-4" />}
                label="Download image"
                bgColor="bg-blue-100"
                textColor="text-blue-700"
                hoverColor="bg-blue-200"
              />
              <ActionButton
                onClick={() => setImage(null)}
                icon={<Trash className="w-4 h-4" />}
                label="Delete image"
                bgColor="bg-red-100"
                textColor="text-red-700"
                hoverColor="bg-red-200"
              />
            </div>
          </div>
          ) : (
            
            <>
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
              <div className="rounded-full bg-blue-100 p-4">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-center">
                <p className="text-lg font-medium">Click to select an image</p>
                <p className="text-sm text-gray-500 mt-1">Supported formats: JPG, PNG, GIF, WEBP</p>
              </div>
            </label>

            </>
          )}
      </div>
    </div>
  );
}
