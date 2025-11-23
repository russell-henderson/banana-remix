
import React, { useState, useEffect } from 'react';
import { X, Wand2, RefreshCw, Sparkles, Save, Loader2, Plus, Trash2 } from 'lucide-react';
import { Button } from './Button';
import { remixImage, getRemixSuggestions, enhancePrompt } from '../services/geminiService';
import { ImagePicker } from './ImagePicker';
import { Post } from '../types';

interface RemixCreatorProps {
  sourceImage: string;
  onClose: () => void;
  onRemixCreated: (remixData: { imageUrl: string; prompt: string }) => void;
  onSaveDraft: (data: { imageUrl?: string; prompt: string; secondaryImage?: string; secondaryParentId?: string }) => void;
  initialPrompt?: string;
  initialGeneratedImage?: string;
  
  // New props for Blending
  posts: Post[];
  initialSecondaryImage?: string;
  initialSecondaryParentId?: string;
}

export const RemixCreator: React.FC<RemixCreatorProps> = ({ 
  sourceImage, 
  onClose, 
  onRemixCreated,
  onSaveDraft,
  initialPrompt = '',
  initialGeneratedImage = null,
  posts,
  initialSecondaryImage,
  initialSecondaryParentId
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(initialGeneratedImage);
  const [error, setError] = useState<string | null>(null);
  
  // Secondary Image State (Blending)
  const [secondaryImage, setSecondaryImage] = useState<string | null>(initialSecondaryImage || null);
  const [secondaryParentId, setSecondaryParentId] = useState<string | null>(initialSecondaryParentId || null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  
  // AI Suggestions & Enhancement State
  const [magicIdeas, setMagicIdeas] = useState<string[]>([]);
  const [isLoadingIdeas, setIsLoadingIdeas] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);

  // Load Magic Ideas on mount
  useEffect(() => {
    if (!sourceImage || magicIdeas.length > 0) return;

    const fetchIdeas = async () => {
        setIsLoadingIdeas(true);
        try {
            const ideas = await getRemixSuggestions(sourceImage);
            setMagicIdeas(ideas);
        } catch (e) {
            console.error("Failed to load ideas", e);
        } finally {
            setIsLoadingIdeas(false);
        }
    };

    fetchIdeas();
  }, [sourceImage, magicIdeas.length]);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    setError(null);
    try {
      const result = await remixImage(sourceImage, prompt, secondaryImage || undefined);
      setGeneratedImage(result);
    } catch (err: any) {
      setError(err.message || "Failed to generate remix. Try a different prompt.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) return;
    setIsEnhancing(true);
    try {
        const improved = await enhancePrompt(prompt);
        setPrompt(improved);
    } catch (e) {
        console.error(e);
    } finally {
        setIsEnhancing(false);
    }
  };

  const handlePost = () => {
    if (generatedImage) {
      onRemixCreated({ imageUrl: generatedImage, prompt });
    }
  };

  const handleSaveDraft = () => {
    onSaveDraft({ 
        imageUrl: generatedImage || undefined, 
        prompt,
        secondaryImage: secondaryImage || undefined,
        secondaryParentId: secondaryParentId || undefined
    });
  };

  const handleSelectSecondary = (url: string, sourceId?: string) => {
    setSecondaryImage(url);
    setSecondaryParentId(sourceId || null);
    setIsPickerOpen(false);
  };

  return (
    <>
    <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-dark-surface rounded-2xl border border-dark-border overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-dark-border">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Wand2 size={20} className="text-banana-400" />
            {secondaryImage ? 'Blend Images' : 'Remix Image'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          
          {/* Image Display Area */}
          <div className="flex gap-2 h-48">
            {/* Main Source Image */}
            <div className={`relative rounded-xl overflow-hidden bg-black border border-dark-border transition-all duration-300 ${secondaryImage ? 'w-2/3' : 'w-full'}`}>
                <img 
                src={generatedImage || sourceImage} 
                alt="Source" 
                className={`w-full h-full object-cover transition-opacity duration-500 ${isGenerating ? 'opacity-50' : 'opacity-100'}`}
                />
                
                {/* Generation Loading State */}
                {isGenerating && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-banana-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                </div>
                )}
                
                {/* Generated Badge */}
                {generatedImage && !isGenerating && (
                     <div className="absolute top-2 right-2 flex gap-2">
                        <span className="bg-banana-400 text-black text-[10px] font-bold px-2 py-1 rounded-full">RESULT</span>
                        <button 
                             onClick={() => setGeneratedImage(null)}
                             className="bg-black/60 text-white p-1 rounded-full hover:bg-black/80"
                        >
                            <X size={12} />
                        </button>
                     </div>
                )}
                
                {/* Label for base image */}
                {!generatedImage && <span className="absolute bottom-2 left-2 bg-black/50 backdrop-blur text-white text-[10px] px-2 py-0.5 rounded">Base</span>}
            </div>

            {/* Secondary Image Slot (Blender) */}
            <div className={`relative rounded-xl overflow-hidden bg-dark-bg border border-dashed border-dark-border transition-all duration-300 ${secondaryImage ? 'w-1/3 border-solid border-gray-600' : 'w-12 hover:border-banana-400 hover:bg-white/5 cursor-pointer'}`}>
                {secondaryImage ? (
                    <>
                        <img src={secondaryImage} alt="Mix" className="w-full h-full object-cover opacity-80" />
                        <button 
                            onClick={() => { setSecondaryImage(null); setSecondaryParentId(null); }}
                            className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full hover:bg-red-500/80 transition-colors"
                        >
                            <Trash2 size={12} />
                        </button>
                        <span className="absolute bottom-2 left-2 bg-black/50 backdrop-blur text-white text-[10px] px-2 py-0.5 rounded">Mix</span>
                    </>
                ) : (
                    <button 
                        onClick={() => !isGenerating && setIsPickerOpen(true)}
                        className="w-full h-full flex flex-col items-center justify-center text-gray-500 gap-1 hover:text-banana-400"
                        title="Add image to blend"
                    >
                        <Plus size={20} />
                        <span className="text-[10px] writing-mode-vertical hidden sm:block">ADD</span>
                    </button>
                )}
            </div>
          </div>

          {/* Prompt Input */}
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <label className="text-sm font-medium text-gray-300">
                  {secondaryImage ? 'How should we blend them?' : 'How should we change it?'}
              </label>
            </div>
            
            <div className="relative">
                <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={secondaryImage ? "e.g. Use the colors from the second image on the structure of the first..." : "e.g. Add a dinosaur, change weather to rain..."}
                className="w-full bg-dark-bg border border-dark-border rounded-lg p-3 pb-10 text-white placeholder-gray-500 focus:border-banana-400 focus:ring-1 focus:ring-banana-400 focus:outline-none resize-none h-32 text-sm transition-all"
                disabled={isGenerating}
                />
                
                <div 
                    className={`absolute bottom-3 right-3 transition-all duration-500 transform ${
                        prompt.length > 5 && !isGenerating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
                    }`}
                >
                    <button 
                        onClick={handleEnhancePrompt}
                        disabled={isEnhancing}
                        className="flex items-center gap-1.5 bg-gradient-to-r from-banana-400 to-banana-500 text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-lg hover:shadow-banana-400/20 active:scale-95 transition-all"
                    >
                        {isEnhancing ? (
                            <Loader2 size={12} className="animate-spin" />
                        ) : (
                            <Sparkles size={12} />
                        )}
                        {isEnhancing ? 'Improving...' : 'Improve Prompt'}
                    </button>
                </div>
            </div>
            
            {/* Magic Ideas */}
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles size={14} className="text-banana-400" />
                    <span className="text-xs font-medium text-gray-400 uppercase">Ideas from Base Image</span>
                </div>
                <div className="flex flex-wrap gap-2">
                {!isLoadingIdeas && magicIdeas.map((idea, idx) => (
                    <button
                    key={idx}
                    onClick={() => setPrompt(idea)}
                    disabled={isGenerating}
                    className="px-3 py-1.5 bg-banana-400/10 border border-banana-400/20 hover:bg-banana-400/20 hover:border-banana-400/50 rounded-lg text-xs text-banana-100 transition-colors text-left"
                    >
                    {idea}
                    </button>
                ))}
                </div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-dark-border bg-dark-surface flex gap-3 flex-col">
          <div className="flex gap-3">
             {!generatedImage ? (
                <Button 
                    onClick={handleGenerate} 
                    className="w-full" 
                    disabled={!prompt.trim() || isGenerating}
                    icon={<Wand2 size={16} />}
                >
                {secondaryImage ? 'Generate Blend' : 'Generate Remix'}
                </Button>
             ) : (
                <>
                    <Button 
                        variant="secondary"
                        onClick={handleGenerate} 
                        className="flex-1"
                        disabled={isGenerating}
                        icon={<RefreshCw size={16} />}
                    >
                        Retry
                    </Button>
                    <Button 
                        onClick={handlePost} 
                        className="flex-1"
                    >
                        Post Result
                    </Button>
                </>
             )}
          </div>
          
          <button 
            onClick={handleSaveDraft}
            className="text-gray-400 hover:text-white text-sm py-2 flex items-center justify-center gap-2 transition-colors"
            disabled={!prompt.trim() && !generatedImage}
          >
            <Save size={16} />
            Save as Draft
          </button>
        </div>

      </div>
    </div>

    {isPickerOpen && (
        <ImagePicker 
            posts={posts}
            onClose={() => setIsPickerOpen(false)}
            onSelect={handleSelectSecondary}
        />
    )}
    </>
  );
};
