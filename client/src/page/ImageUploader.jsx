import React, { useState } from 'react';
import axios from 'axios';

const ImageUploader = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'item_images'); // 👈 thay bằng upload preset của bạn

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dc06xwakl/image/upload', // 👈 thay YOUR_CLOUD_NAME
        formData
      );
      setImageUrl(response.data.secure_url);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h2>Upload Ảnh lên Cloudinary</h2>
      <input type="file" onChange={handleImageUpload} />
      {uploading && <p>Đang tải lên...</p>}
      {imageUrl && (
        <div>
          <p>Ảnh đã tải lên:</p>
          <img src={imageUrl} alt="Uploaded" style={{ maxWidth: '300px' }} />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
