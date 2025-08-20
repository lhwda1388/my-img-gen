import { useState, useEffect, useRef, useCallback } from "react";

interface WorkerMessage {
  type: string;
  data: any;
}

interface UseImageWorkerReturn {
  isGenerating: boolean;
  generatedImage: string | null;
  error: string | null;
  message: string | null;
  generateTextToImage: (prompt: string, options?: any) => void;
  generateImageToImage: (prompt: string, image: File, options?: any) => void;
  clearError: () => void;
  clearMessage: () => void;
}

export const useImageWorker = (): UseImageWorkerReturn => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const workerRef = useRef<Worker | null>(null);

  // Worker 초기화
  useEffect(() => {
    if (typeof Window !== "undefined" && "Worker" in window) {
      workerRef.current = new Worker(
        new URL("../workers/imageWorker.ts", import.meta.url),
        {
          type: "module",
        }
      );

      // Worker 메시지 리스너
      workerRef.current.onmessage = (event: MessageEvent<WorkerMessage>) => {
        const { type, data } = event.data;

        switch (type) {
          case "GENERATION_STARTED":
            setIsGenerating(true);
            setError(null);
            setMessage(data.message);
            break;

          case "GENERATION_SUCCESS":
            setIsGenerating(false);
            setGeneratedImage(data.imagePath);
            setMessage(data.message);
            setError(null);
            break;

          case "GENERATION_ERROR":
            setIsGenerating(false);
            setError(data.error);
            setMessage(data.message);
            setGeneratedImage(null);
            break;

          default:
            console.warn("Unknown worker message type:", type);
        }
      };

      // Worker 에러 핸들링
      workerRef.current.onerror = (error) => {
        setIsGenerating(false);
        setError("Worker 오류가 발생했습니다: " + error.message);
        setMessage(null);
      };
    }

    // Cleanup
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  // 텍스트에서 이미지 생성
  const generateTextToImage = useCallback(
    (prompt: string, options: any = {}) => {
      if (!workerRef.current) {
        setError("Worker가 초기화되지 않았습니다.");
        return;
      }

      const payload = {
        prompt,
        use_translation: true,
        guidance_scale: 12.0,
        num_inference_steps: 20,
        model_id: "stabilityai/stable-diffusion-xl-base-1.0",
        ...options,
      };

      workerRef.current.postMessage({
        type: "GENERATE_TEXT_TO_IMAGE",
        payload,
      });
    },
    []
  );

  // 이미지에서 이미지 변환
  const generateImageToImage = useCallback(
    (prompt: string, image: File, options: any = {}) => {
      if (!workerRef.current) {
        setError("Worker가 초기화되지 않았습니다.");
        return;
      }

      const payload = {
        prompt,
        image,
        use_translation: true,
        strength: 0.75,
        guidance_scale: 12.0,
        num_inference_steps: 20,
        model_id: "stabilityai/stable-diffusion-xl-base-1.0",
        ...options,
      };

      workerRef.current.postMessage({
        type: "GENERATE_IMAGE_TO_IMAGE",
        payload,
      });
    },
    []
  );

  // 에러 클리어
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 메시지 클리어
  const clearMessage = useCallback(() => {
    setMessage(null);
  }, []);

  return {
    isGenerating,
    generatedImage,
    error,
    message,
    generateTextToImage,
    generateImageToImage,
    clearError,
    clearMessage,
  };
};
