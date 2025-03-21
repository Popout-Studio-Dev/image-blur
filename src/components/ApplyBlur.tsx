
/**
 * Applique un flou gaussien à une région spécifique de l'image
 * 
 * @param ctx Contexte du canvas
 * @param x Position X de la région
 * @param y Position Y de la région
 * @param width Largeur de la région
 * @param height Hauteur de la région
 * @param radius Rayon du flou (intensité)
 * @param shape Forme de la région à flouter ('rectangle', 'triangle', 'circle')
 */
export function applyBlur(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    shape: 'rectangle' | 'triangle' | 'circle'
  ): void {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;
  
    tempCanvas.width = width;
    tempCanvas.height = height;
  
    tempCtx.drawImage(ctx.canvas, x, y, width, height, 0, 0, width, height);
  
    applyGaussianBlur(tempCtx, radius);
  
    ctx.save();
  
    const maskCanvas = document.createElement('canvas');
    const maskCtx = maskCanvas.getContext('2d');
    if (!maskCtx) return;
  
    maskCanvas.width = width;
    maskCanvas.height = height;
    maskCtx.fillStyle = 'white';
    maskCtx.globalCompositeOperation = 'source-over';
  
    if (shape === 'rectangle') {
      maskCtx.fillRect(0, 0, width, height);
    } else if (shape === 'triangle') {
      maskCtx.beginPath();
      maskCtx.moveTo(width / 2, 0);
      maskCtx.lineTo(width, height);
      maskCtx.lineTo(0, height);
      maskCtx.closePath();
      maskCtx.fill();
    } else if (shape === 'circle') {
      maskCtx.beginPath();
      maskCtx.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, Math.PI * 2);
      maskCtx.closePath();
      maskCtx.fill();
    }
  
    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(maskCanvas, x, y);
    ctx.globalCompositeOperation = 'source-atop';
    ctx.drawImage(tempCanvas, 0, 0, width, height, x, y, width, height);

  
    ctx.globalCompositeOperation = 'source-over';
    ctx.drawImage(tempCanvas, 0, 0, width, height, x, y, width, height);
    ctx.restore();
  }
  
function applyGaussianBlur(ctx: CanvasRenderingContext2D, radius: number): void {
    ctx.filter = `blur(${radius}px)`;
    ctx.drawImage(ctx.canvas, 0, 0);
    ctx.filter = 'none';
}
