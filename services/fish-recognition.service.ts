/**
 * Service for fish recognition using the Python server
 */

/**
 * Sends an image to the fish recognition server for prediction
 * @param imageData Base64 encoded image data
 * @returns Promise with the prediction result
 */
export async function recognizeFish(imageData: string): Promise<{ prediction?: string; error?: string }> {
  try {
    // Remove base64 header (e.g., "data:image/jpeg;base64,")
    const base64Data = imageData.split(',')[1];
    
    // Convert base64 to blob
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/jpeg' });

    // Create form data
    const formData = new FormData();
    formData.append("file", blob, "image.jpg");

    // Send to prediction API
    const response = await fetch("http://localhost:8000/predict", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error predicting image:", error);
    return { error: error instanceof Error ? error.message : "Unknown error occurred" };
  }
}

const fishRecognitionService = {
  recognizeFish,
};

export default fishRecognitionService; 