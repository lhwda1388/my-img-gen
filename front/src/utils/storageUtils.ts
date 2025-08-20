// sessionStorage 관련 유틸리티 함수들

export const STORAGE_KEY = "image-generation-storage";

export const getStorageData = () => {
  try {
    const data = sessionStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("sessionStorage 데이터 읽기 실패:", error);
    return null;
  }
};

export const clearStorage = () => {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
    console.log("sessionStorage 데이터가 삭제되었습니다.");
  } catch (error) {
    console.error("sessionStorage 데이터 삭제 실패:", error);
  }
};

export const getStorageSize = () => {
  try {
    const data = sessionStorage.getItem(STORAGE_KEY);
    if (data) {
      return new Blob([data]).size;
    }
    return 0;
  } catch (error) {
    console.error("sessionStorage 크기 계산 실패:", error);
    return 0;
  }
};

export const formatStorageSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const isStorageAvailable = () => {
  try {
    const test = "__storage_test__";
    sessionStorage.setItem(test, test);
    sessionStorage.removeItem(test);
    return true;
  } catch (error) {
    console.error("error : ", error);
    return false;
  }
};
