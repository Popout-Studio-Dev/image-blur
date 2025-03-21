import { useState } from 'react';
import Image from 'next/image'; // Importer Image de next/image

const contributeurs = [
  { id: 1, name: 'John Doe', image: '/images/1.jpeg', linkedin: 'https://www.linkedin.com/in/johndoe/' },
  { id: 2, name: 'Jane Smith', image: '/images/1.jpeg', linkedin: 'https://www.linkedin.com/in/janesmith/' },
  { id: 3, name: 'Alice Johnson', image: '', linkedin: 'https://www.linkedin.com/in/alicejohnson/' },
  { id: 4, name: 'Bob Lee', image: '', linkedin: 'https://www.linkedin.com/in/boblee/' },
];

export default function Contributeurs() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-lg transition-all hover:bg-blue-500"
      >
        Contributeurs
      </button>

      {open && (
        <div className="absolute bottom-full mb-2 left-0 w-48 bg-white shadow-lg rounded-md z-10">
          <ul className="flex flex-col p-2 space-y-1">
            {contributeurs.map((contributeur) => (
              <li key={contributeur.id} className="flex items-center space-x-5">
                <Image
                  src={contributeur.image} // Image par défaut si l'image n'est pas fournie
                  alt={contributeur.name}
                  width={59} // Largeur de l'image (64px)
                  height={59} // Hauteur de l'image (64px)
                  className="rounded-full object-cover"
                />
                <a
                  href={contributeur.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-semibold hover:text-blue-500"
                >
                  {contributeur.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
