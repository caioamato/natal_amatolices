import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Ghost, TreePine, Upload, Sparkles, Image as ImageIcon, RotateCw } from 'lucide-react';
import Snowfall from './components/Snowfall';
import ScenarioButton from './components/ScenarioButton';
import { ScenarioType } from './types';
import { generateChristmasImage } from './services/geminiService';

const LOADING_MESSAGES = [
  "Alimentando a rena...",
  "Negociando com os duendes...",
  "Ajustando o gorro...",
  "Polindo os chifres...",
  "Escondendo os presentes...",
  "Aquecendo o chocolate quente...",
  "Desenrolando o pisca-pisca..."
];

export default function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Loading Messages Cycling
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (loading) {
      interval = setInterval(() => {
        setLoadingMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError("Por favor, selecione um arquivo de imagem válido.");
      return;
    }
    setError(null);
    setSelectedFile(file);
    setResultImage(null); // Clear previous result
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleGenerate = async (scenario: ScenarioType) => {
    if (!previewUrl) {
      setError("Primeiro, faça upload de uma selfie!");
      return;
    }

    setLoading(true);
    setError(null);
    setResultImage(null);

    try {
      const generatedImageBase64 = await generateChristmasImage(previewUrl, scenario);
      setResultImage(generatedImageBase64);
    } catch (err: any) {
      console.error(err);
      setError("Ocorreu um erro ao gerar a imagem. Tente novamente! " + (err.message || ""));
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-800 via-red-950 to-black text-white selection:bg-yellow-500 selection:text-red-900">
      <Snowfall />

      <main className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center">
        
        {/* Main Card */}
        <div className="w-full max-w-4xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-6 md:p-10 relative overflow-hidden">
          
          {/* Header */}
          <header className="text-center mb-10">
            <h1 className="font-['Mountains_of_Christmas'] text-4xl md:text-6xl font-bold text-yellow-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-2">
              🎄 Natal da Família Amatolices 🎅
            </h1>
            <p className="font-['Roboto'] text-gray-200 text-lg opacity-80">
              Transforme sua selfie em uma memória natalina inesquecível!
            </p>
          </header>

          <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
            
            {/* Left Column: Upload & Controls */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6">
              
              {/* Upload Area */}
              <div 
                className={`
                  relative group border-4 border-dashed rounded-2xl p-8 
                  transition-all duration-300 cursor-pointer
                  flex flex-col items-center justify-center text-center
                  ${previewUrl ? 'border-green-400 bg-green-900/20' : 'border-white/40 hover:border-yellow-400 hover:bg-white/5'}
                `}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={triggerFileInput}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileChange}
                />
                
                {previewUrl ? (
                  <div className="relative">
                    <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto mb-4 relative z-10">
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-red-900 p-2 rounded-full z-20 shadow-md">
                      <RotateCw size={20} />
                    </div>
                    <p className="text-green-300 font-bold mt-2">Imagem carregada!</p>
                    <p className="text-xs text-gray-300">(Clique para trocar)</p>
                  </div>
                ) : (
                  <>
                    <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Upload size={40} className="text-white/80" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Envie sua Selfie</h3>
                    <p className="text-sm text-gray-300">
                      Clique aqui ou arraste sua foto.<br/>
                      <span className="opacity-70 text-xs">Recomendado: Rosto bem iluminado.</span>
                    </p>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ScenarioButton 
                  onClick={() => handleGenerate(ScenarioType.FUNNY)}
                  icon={TreePine}
                  label="Montar na Rena"
                  subLabel="(Modo Caos 😂)"
                  colorClass="bg-gradient-to-br from-green-600 to-green-800 hover:from-green-500 hover:to-green-700"
                  hoverAnimationClass="animate-bounce-custom"
                  disabled={loading || !previewUrl}
                />
                
                <ScenarioButton 
                  onClick={() => handleGenerate(ScenarioType.SCARY)}
                  icon={Ghost}
                  label="Enfrentar Duendes"
                  subLabel="(Modo Terror 👻)"
                  colorClass="bg-gradient-to-br from-purple-900 to-black hover:from-purple-800 hover:to-gray-900"
                  hoverAnimationClass="animate-shake"
                  disabled={loading || !previewUrl}
                />
              </div>

              {error && (
                <div className="bg-red-500/80 text-white p-4 rounded-xl text-center font-bold animate-pulse border border-red-400">
                  ⚠️ {error}
                </div>
              )}
            </div>

            {/* Right Column: Result Display */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center min-h-[400px]">
              
              {loading ? (
                <div className="flex flex-col items-center text-center animate-pulse">
                  <div className="relative w-32 h-32 mb-6">
                    <div className="absolute inset-0 border-4 border-yellow-400 rounded-full border-t-transparent animate-spin"></div>
                    <div className="absolute inset-4 border-4 border-red-500 rounded-full border-b-transparent animate-spin duration-reverse"></div>
                    <Sparkles className="absolute inset-0 m-auto text-yellow-300 animate-ping" size={32} />
                  </div>
                  <h3 className="text-2xl font-['Mountains_of_Christmas'] text-yellow-300">
                    {LOADING_MESSAGES[loadingMsgIndex]}
                  </h3>
                </div>
              ) : resultImage ? (
                <div className="relative w-full max-w-sm mx-auto group perspective-1000">
                  <div className="relative bg-black rounded-lg overflow-hidden border-[8px] border-yellow-600 shadow-[0_0_30px_rgba(234,179,8,0.4)] ring-4 ring-yellow-800/50">
                    {/* Golden Frame Texture Effect */}
                    <div className="absolute inset-0 border-[2px] border-yellow-300/30 pointer-events-none z-20 m-1 rounded-sm"></div>
                    
                    <img 
                      src={resultImage} 
                      alt="Resultado Natalino" 
                      className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {/* Download/Share Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-30">
                      <a 
                        href={resultImage} 
                        download="natal-amatolices.png"
                        className="bg-yellow-500 text-red-900 px-6 py-3 rounded-full font-bold hover:bg-yellow-400 transform hover:scale-105 transition-all flex items-center gap-2"
                      >
                         <Upload size={20} className="rotate-180" /> Baixar Memória
                      </a>
                    </div>
                  </div>
                  <div className="mt-6 text-center">
                     <p className="text-yellow-200 font-['Mountains_of_Christmas'] text-xl">
                       Ho Ho Ho! Ficou incrível! 🎁
                     </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full w-full border-4 border-white/10 border-dotted rounded-3xl p-10 bg-black/20 text-white/30">
                  <ImageIcon size={64} className="mb-4" />
                  <p className="font-['Mountains_of_Christmas'] text-2xl text-center">
                    A magia vai acontecer aqui...
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="mt-8 text-white/50 text-sm font-['Roboto'] text-center">
          <p>&copy; {new Date().getFullYear()} Família Amatolices. Powered by Google Vertex AI.</p>
        </footer>
      </main>
    </div>
  );
}