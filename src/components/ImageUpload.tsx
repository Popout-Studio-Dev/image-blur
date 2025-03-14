import { Download, Eraser, Trash } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import ActionButton from "./ActionButton";
import CustomInputUpload from "./CustomInputUpload";
import RangeSlider from "./RangeSlider";


export function ImageUpload() {
  const [image, setImage] = useState<string | ArrayBuffer | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [blurRadius, setBlurRadius] = useState(10);
  const [selection, setSelection] = useState({ startX: 0, startY: 0, width: 0, height: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const originalImageDataRef = useRef<ImageData | null>(null);



  useEffect(() => {
    if (!image || !canvasRef.current || !imgRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    imgRef.current.onload = () => {
      if (!canvasRef.current || !imgRef.current || !ctx) return;
      canvasRef.current.width = imgRef.current.width;
      canvasRef.current.height = imgRef.current.height;
      ctx.drawImage(imgRef.current, 0, 0);
      originalImageDataRef.current = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    };
    imgRef.current.src = image as string
  }, [image]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    setIsSelecting(true);
    setSelection({ startX: x, startY: y, width: 0, height: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isSelecting || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const currentX = (e.clientX - rect.left) * scaleX;
    const currentY = (e.clientY - rect.top) * scaleY;

    const width = currentX - selection.startX;
    const height = currentY - selection.startY;

    setSelection(prev => ({ ...prev, width, height }));
  };

  const handleMouseUp = () => {
    if (!isSelecting || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Appliquer le flou à la zone sélectionnée
    const x = selection.width > 0 ? selection.startX : selection.startX + selection.width;
    const y = selection.height > 0 ? selection.startY : selection.startY + selection.height;
    const width = Math.abs(selection.width);
    const height = Math.abs(selection.height);

    ctx.filter = `blur(${blurRadius}px)`;
    ctx.drawImage(
      canvas,
      x,
      y,
      width,
      height,
      x,
      y,
      width,
      height
    );

    setIsSelecting(false);
    setSelection({ startX: 0, startY: 0, width: 0, height: 0 });
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
    // sizing the image so that it cannot be distorted
    <div className={`w-full  max-w-${imgRef.current?.width} max-h-${imgRef.current?.height}  mx-auto border-2 border-dashed border-blue-500  p-4`}>
      <div className="space-y-4  ">
        {image ? (
            <div className="relative w-full aspect-video ">
              <img ref={imgRef} src={image as string} alt="Uploaded preview" className="hidden" />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full cursor-crosshair"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              />
              {isSelecting && (
                <div
                  className="absolute border-2 border-blue-500 bg-blue-500/20"
                  style={{
                    left: `${(selection.width > 0 ? selection.startX : selection.startX + selection.width) * (canvasRef.current?.getBoundingClientRect().width || 1) / (canvasRef.current?.width || 1)}px`,
                    top: `${(selection.height > 0 ? selection.startY : selection.startY + selection.height) * (canvasRef.current?.getBoundingClientRect().height || 1) / (canvasRef.current?.height || 1)}px`,
                    width: `${Math.abs(selection.width) * (canvasRef.current?.getBoundingClientRect().width || 1) / (canvasRef.current?.width || 1)}px`,
                    height: `${Math.abs(selection.height) * (canvasRef.current?.getBoundingClientRect().height || 1) / (canvasRef.current?.height || 1)}px`,
                    position: 'absolute',
                    pointerEvents: 'none'
                  }}
                />
              )}
            </div>
          ) :
            // call the custom image upload this component do : drag and drop , copy and paste  upload .
            // props 'setImage' est state to change value of 'image'
            <CustomInputUpload setImage={setImage}/>
        }
        {image && (
          <div className="space-y-4">
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
        )}
      </div>
    </div>
  );
}
