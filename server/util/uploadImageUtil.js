import axios from 'axios'
import ErrorException from './errorException.js';

export const handleImageUpload = async (images) => {
  if (!Array.isArray(images)) return [];

  const uploadedUrls = [];

  for (const image of images) {
    const formData = new FormData();
    formData.append('file', image); // mỗi ảnh là base64 hoặc file path
    formData.append('upload_preset', 'item_images'); // preset của bạn

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dc06xwakl/image/upload',
        formData
      );
      uploadedUrls.push(response.data.secure_url);
    } catch (error) {
      throw new ErrorException(400, 'Image upload failed');
    }
  }

  return uploadedUrls;
};
