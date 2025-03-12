import { ImageUpload } from "@/components/ImageUpload";




export default function Home() {
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
