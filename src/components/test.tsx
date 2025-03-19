<ActionButton
onClick={() => setSelectedShape("triangle")}
icon={<TriangleIcon/>}
label="Triangle"
bgColor={selectedShape === "triangle" ? "bg-blue-200" : "bg-gray-100"}
textColor="text-gray-700"
hoverColor="bg-gray-200"
/>
<ActionButton
onClick={() => setSelectedShape("circle")}
icon={<CircleIcon/>}
label="Circle"
bgColor={selectedShape === "circle" ? "bg-blue-200" : "bg-gray-100"}
textColor="text-gray-700"
hoverColor="bg-gray-800"
/>


else if (selectedShape === "triangle") {
    ctx.globalCompositeOperation = "destination-out"; 
    ctx.beginPath();
    ctx.moveTo(x + width / 2, y);
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x, y + height);
    ctx.closePath();
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = "black"; 
    ctx.lineWidth = 0.25; 
    ctx.beginPath();
    ctx.moveTo(x + width / 2, y);
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x, y + height);
    ctx.closePath();
    ctx.stroke();

  } 

else if (selectedShape === "circle") {
    ctx.globalCompositeOperation = "destination-out"; 
    ctx.beginPath();
    ctx.arc(x + width / 2, y + height / 2, Math.max(width, height) / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over"; 
    ctx.strokeStyle = "black"; 
    ctx.lineWidth = 0.25;
    ctx.beginPath();
    ctx.arc(x + width / 2, y + height / 2, Math.max(width, height) / 2, 0, Math.PI * 2);
    ctx.stroke();
  }