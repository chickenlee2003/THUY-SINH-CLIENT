import apiClient from "./apiClient";

const uploadService = {
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    return await apiClient.post("/upload/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  deleteImage: async (publicId: string) => {
    return await apiClient.delete(`/upload/image/${publicId}`);
  },
};

export default uploadService;
