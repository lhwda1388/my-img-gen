// 이미지 생성 Web Worker
const API_BASE_URL = "http://localhost:8000";

// Worker 메시지 타입 정의
interface WorkerMessage {
  type: "GENERATE_TEXT_TO_IMAGE" | "GENERATE_IMAGE_TO_IMAGE";
  payload: TextToImagePayload | ImageToImagePayload;
}

interface TextToImagePayload {
  prompt: string;
  use_translation: boolean;
  guidance_scale: number;
  num_inference_steps: number;
  model_id?: string;
}

interface ImageToImagePayload {
  prompt: string;
  use_translation: boolean;
  strength: number;
  guidance_scale: number;
  num_inference_steps: number;
  model_id?: string;
  image: File;
}

// 메인 스레드로 메시지 전송
const sendMessage = (type: string, data: any) => {
  self.postMessage({ type, data });
};

// 텍스트에서 이미지 생성
const generateTextToImage = async (payload: TextToImagePayload) => {
  try {
    sendMessage("GENERATION_STARTED", {
      message: "이미지 생성이 시작되었습니다.",
    });

    const response = await fetch(`${API_BASE_URL}/generate/text-to-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      sendMessage("GENERATION_SUCCESS", {
        imagePath: data.image_paths[0],
        message: "이미지가 성공적으로 생성되었습니다.",
      });
    } else {
      throw new Error(data.message || "이미지 생성에 실패했습니다.");
    }
  } catch (error) {
    sendMessage("GENERATION_ERROR", {
      error:
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.",
      message: "이미지 생성 중 오류가 발생했습니다.",
    });
  }
};

// 이미지에서 이미지 변환
const generateImageToImage = async (payload: ImageToImagePayload) => {
  try {
    sendMessage("GENERATION_STARTED", {
      message: "이미지 변환이 시작되었습니다.",
    });

    const formData = new FormData();
    formData.append("image", payload.image);
    formData.append(
      "request",
      JSON.stringify({
        prompt: payload.prompt,
        use_translation: payload.use_translation,
        strength: payload.strength,
        guidance_scale: payload.guidance_scale,
        num_inference_steps: payload.num_inference_steps,
        model_id: payload.model_id,
      })
    );

    const response = await fetch(`${API_BASE_URL}/generate/image-to-image`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      sendMessage("GENERATION_SUCCESS", {
        imagePath: data.image_paths[0],
        message: "이미지가 성공적으로 변환되었습니다.",
      });
    } else {
      throw new Error(data.message || "이미지 변환에 실패했습니다.");
    }
  } catch (error) {
    sendMessage("GENERATION_ERROR", {
      error:
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.",
      message: "이미지 변환 중 오류가 발생했습니다.",
    });
  }
};

// Worker 메시지 리스너
self.addEventListener("message", (event: MessageEvent<WorkerMessage>) => {
  const { type, payload } = event.data;

  switch (type) {
    case "GENERATE_TEXT_TO_IMAGE":
      generateTextToImage(payload);
      break;
    case "GENERATE_IMAGE_TO_IMAGE":
      generateImageToImage(payload as ImageToImagePayload);
      break;
    default:
      console.warn("Unknown message type:", type);
  }
});

// TypeScript Worker 타입 정의
export type {};
