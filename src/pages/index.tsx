import DrapDrop from "@/components/CustomInputUpload";
import { ImageUpload } from "@/components/ImageUpload";
import { useState } from "react";




export default function Home() {
    const [image, setImage] = useState<string | ArrayBuffer | null>(null);
  
  return (
    <>
      <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Image Upload</h1>
        <ImageUpload />
      </div>

      
    </main>
    </>
  );
}
