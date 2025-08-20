import { useImageStore } from "../stores/imageStore";

class ImageWorkerService {
  private worker: Worker | null = null;

  constructor() {
    this.initializeWorker();
  }

  private initializeWorker() {
    if (typeof Window !== "undefined" && "Worker" in window) {
      this.worker = new Worker(
        new URL("../workers/imageWorker.ts", import.meta.url),
        { type: "module" }
      );

      this.worker.onmessage = (event) => {
        const { type, data } = event.data;
        this.handleWorkerMessage(type, data);
      };

      this.worker.onerror = (error) => {
        const store = useImageStore.getState();
        store.setGenerating(false);
        store.setError("Worker 오류가 발생했습니다: " + error.message);
        store.setMessage(null);
      };
    }
  }

  private handleWorkerMessage(type: string, data: any) {
    const store = useImageStore.getState();

    switch (type) {
      case "GENERATION_STARTED":
        store.setGenerating(true);
        store.setError(null);
        store.setMessage(data.message);
        break;

      case "GENERATION_SUCCESS":
        store.setGenerating(false);
        store.setGeneratedImage(data.imagePath);
        store.setMessage(data.message);
        store.setError(null);
        break;

      case "GENERATION_ERROR":
        store.setGenerating(false);
        store.setError(data.error);
        store.setMessage(data.message);
        store.setGeneratedImage(null);
        break;

      default:
        console.warn("Unknown worker message type:", type);
    }
  }

  public generateTextToImage(prompt: string, options: any = {}) {
    if (!this.worker) {
      const store = useImageStore.getState();
      store.setError("Worker가 초기화되지 않았습니다.");
      return;
    }

    const payload = {
      prompt,
      use_translation: true,
      guidance_scale: 12.0,
      num_inference_steps: 20,
      model_id: "stabilityai/stable-diffusion-xl-base-1.0",
      // model_id: "runwayml/stable-diffusion-v1-5",
      ...options,
    };

    this.worker.postMessage({
      type: "GENERATE_TEXT_TO_IMAGE",
      payload,
    });
  }

  public generateImageToImage(prompt: string, image: File, options: any = {}) {
    if (!this.worker) {
      const store = useImageStore.getState();
      store.setError("Worker가 초기화되지 않았습니다.");
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

    this.worker.postMessage({
      type: "GENERATE_IMAGE_TO_IMAGE",
      payload,
    });
  }

  public addToHistory(
    prompt: string,
    imagePath: string,
    type: "text-to-image" | "image-to-image"
  ) {
    const store = useImageStore.getState();
    store.addToHistory(prompt, imagePath, type);
  }

  public cleanup() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}

// 싱글톤 인스턴스
export const imageWorkerService = new ImageWorkerService();

// React 컴포넌트에서 사용할 수 있는 훅
export const useImageWorkerService = () => {
  return {
    generateTextToImage:
      imageWorkerService.generateTextToImage.bind(imageWorkerService),
    generateImageToImage:
      imageWorkerService.generateImageToImage.bind(imageWorkerService),
  };
};
