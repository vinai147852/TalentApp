// import { storage } from "./firebase";
// import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

// // All Firebase Storage usage is commented out for migration away from Firebase.
// export const uploadImage = async (file, onProgress) => {
//   // ...firebase upload logic commented out...
//   throw new Error("Firebase image upload is disabled.");
// };

import axios from 'axios';

const UPLOAD_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://tjcfdbv2-5005.inc1.devtunnels.ms/api/upload'
    : 'http://localhost:5005/api/upload';

export const UploadImage = async ({ Image, OnSuccess, GetProgress }) => {
  try {
    const formData = new FormData();
    formData.append('image', Image);

    const res = await axios.post(UPLOAD_URL, formData, {
      onUploadProgress: (event) => {
        const percent = Math.round((event.loaded * 100) / event.total);
        GetProgress && GetProgress(percent);
      },
    });

    OnSuccess(res.data.url);
  } catch (err) {
    GetProgress && GetProgress(null);
    console.log(err);
  }
};
