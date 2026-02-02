'use client';

import { useState, useRef, useCallback } from 'react';
import { Star, Image as ImageIcon, User, Download, Upload } from 'lucide-react';
import { toPng } from 'html-to-image';

export default function Home() {
  const [title, setTitle] = useState('Jogo');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(async () => {
    if (cardRef.current === null) {
      console.error('Elemento do card não encontrado');
      return;
    }

    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 1.5, // Melhora a qualidade
        backgroundColor: '#000000', // Garante fundo preto
      });

      const link = document.createElement('a');
      link.download = `${title.toLowerCase().replace(/\s+/g, '-')}-review.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Erro ao gerar imagem:', err);
      alert('Não foi possível gerar a imagem. Tente novamente.');
    }
  }, [title]);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (value: string | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 flex flex-col md:flex-row gap-8">
      {/* Controls */}
      <div className="w-full md:w-1/3 bg-gray-800 p-6 rounded-xl shadow-lg h-fit space-y-6">
        <h1 className="text-2xl font-bold mb-4">Gerador de Avaliação</h1>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Digite o título..."
          />
        </div>

        {/* <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Comentário (Opcional)</label>
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Ex: Me apaixonei..."
          />
        </div> */}

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Nota (0.5 - 5)</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => {
                  if (rating === star) {
                    setRating(star - 0.5);
                  } else {
                    setRating(star);
                  }
                }}
                className="relative p-1 transition-transform hover:scale-110 focus:outline-none"
              >
                {/* Full Star Logic for Control */}
                {rating >= star ? (
                  <Star
                    className="text-pink-500 fill-pink-500"
                    size={32}
                  />
                ) : rating >= star - 0.5 ? (
                  <div className="relative">
                    <Star
                      className="text-gray-600"
                      size={32}
                    />
                    <div className="absolute inset-0 overflow-hidden w-1/2">
                      <Star
                        className="text-pink-500 fill-pink-500"
                        size={32}
                      />
                    </div>
                  </div>
                ) : (
                  <Star
                    className="text-gray-600"
                    size={32}
                  />
                )}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400">Dica: Clique novamente na estrela para meia nota.</p>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Imagem de Background (Poster)</label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
              <Upload size={20} />
              <span>Upload</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, setBgImage)}
                className="hidden"
              />
            </label>
            {bgImage && <span className="text-green-400 text-sm">Imagem carregada</span>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Imagem de Perfil</label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
              <Upload size={20} />
              <span>Upload</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, setProfileImage)}
                className="hidden"
              />
            </label>
            {profileImage && <span className="text-green-400 text-sm">Imagem carregada</span>}
          </div>
        </div>

        <button
          onClick={handleDownload}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 mt-8 shadow-lg"
        >
          <Download size={20} />
          <span>Baixar Card</span>
        </button>
      </div>

      {/* Preview */}
      <div className="w-full md:w-2/3 flex items-center justify-center bg-black/50 p-8 rounded-xl border border-gray-700 overflow-hidden relative">
        <p className="absolute top-4 left-4 text-gray-500 text-sm">Preview</p>

        {/* Card Container */}
        <div
          ref={cardRef}
          className="relative w-[405px] h-[720px] bg-black overflow-hidden flex flex-col items-center shadow-2xl"
          style={{ fontFamily: 'sans-serif' }}
        >
          {/* Background Image (Blurred/Darkened) */}
          <div className="absolute inset-0 z-0">
            {bgImage ? (
              <>
                <img
                  src={bgImage}
                  alt="Background"
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30"></div>
              </>
            ) : (
              <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                <ImageIcon size={48} className="text-gray-700" />
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="relative z-10 w-full h-full flex flex-col items-center pt-24 pb-12 px-6">

            {/* Poster Card */}
            <div className="relative mb-8 mt-8">
              {/* Comment Bubble (if exists) */}
              {comment && (
                <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-white text-black text-xs font-medium px-3 py-2 rounded-lg shadow-lg whitespace-nowrap z-30 max-w-[200px] text-center">
                  {comment}
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rotate-45"></div>
                </div>
              )}

              {/* Profile Image (Top Center of Poster) */}
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20">
                <div className="w-12 h-12 rounded-full border-2 border-white/20 overflow-hidden shadow-lg bg-gray-800">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      <User size={20} />
                    </div>
                  )}
                </div>
              </div>

              {/* Poster Image */}
              <div className="w-56 h-84 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-white/10 bg-gray-800">
                {bgImage ? (
                  <img src={bgImage} alt="Poster" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                    Poster
                  </div>
                )}
              </div>
            </div>

            {/* Title */}
            {/* <h2 className="text-medium font-light tracking-wider text-white mb-4 text-center drop-shadow-md">
              {title}
            </h2> */}
            {/* Subtitle/Text */}
            <p className="text-gray-400 text-medium mb-4 font-light opacity-80">{title}</p>

            {/* Rating Stars */}
            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => {
                if (rating >= star) {
                  return (
                    <Star
                      key={star}
                      size={24}
                      className="fill-pink-500 text-pink-500 drop-shadow-md"
                    />
                  );
                } else if (rating >= star - 0.5) {
                  return (
                    <div key={star} className="relative">
                      <Star
                        size={24}
                        className="text-gray-600 drop-shadow-md"
                      />
                      <div className="absolute inset-0 overflow-hidden w-1/2">
                        <Star
                          size={24}
                          className="fill-pink-500 text-pink-500 drop-shadow-md"
                        />
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <Star
                      key={star}
                      size={24}
                      className="text-gray-600 drop-shadow-md"
                    />
                  );
                }
              })}
            </div>

            {/* Logo / Footer */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] uppercase tracking-widest text-gray-500">ON</span>
              <img
                src="/img/backloggd-logo.webp"
                alt="Backloggd"
                className="w-32 object-contain"
              />
            </div>

            {/* Large Background Text Overlay */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none opacity-10">
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
