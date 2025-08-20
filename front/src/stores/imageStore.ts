import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ImageGenerationState {
  // 상태
  isGenerating: boolean;
  generatedImage: string | null;
  error: string | null;
  message: string | null;
  generationHistory: Array<{
    id: string;
    prompt: string;
    imagePath: string;
    timestamp: Date;
    type: "text-to-image" | "image-to-image";
  }>;

  // 액션
  setGenerating: (isGenerating: boolean) => void;
  setGeneratedImage: (imagePath: string | null) => void;
  setError: (error: string | null) => void;
  setMessage: (message: string | null) => void;
  addToHistory: (
    prompt: string,
    imagePath: string,
    type: "text-to-image" | "image-to-image"
  ) => void;
  clearError: () => void;
  clearMessage: () => void;
  clearHistory: () => void;
  removeFromHistory: (id: string) => void;
}

export const useImageStore = create<ImageGenerationState>()(
  persist(
    (set) => ({
      // 초기 상태
      isGenerating: false,
      generatedImage: null,
      error: null,
      message: null,
      generationHistory: [],

      // 액션들
      setGenerating: (isGenerating) => set({ isGenerating }),

      setGeneratedImage: (imagePath) => set({ generatedImage: imagePath }),

      setError: (error) => set({ error }),

      setMessage: (message) => set({ message }),

      addToHistory: (prompt, imagePath, type) => {
        const newEntry = {
          id: Date.now().toString(),
          prompt,
          imagePath,
          timestamp: new Date(),
          type,
        };

        set((state) => ({
          generationHistory: [newEntry, ...state.generationHistory].slice(
            0,
            20
          ), // 최대 20개만 유지
        }));
      },

      clearError: () => set({ error: null }),

      clearMessage: () => set({ message: null }),

      clearHistory: () => set({ generationHistory: [] }),

      removeFromHistory: (id) => {
        set((state) => ({
          generationHistory: state.generationHistory.filter(
            (item) => item.id !== id
          ),
        }));
      },
    }),
    {
      name: "image-generation-storage", // sessionStorage 키 이름
      storage: createJSONStorage(() => sessionStorage), // sessionStorage 사용
      partialize: (state) => ({
        // sessionStorage에 저장할 상태들
        generatedImage: state.generatedImage,
        generationHistory: state.generationHistory,
        // isGenerating은 저장하지 않음 (새로고침 시 false로 리셋)
      }),
    }
  )
);
