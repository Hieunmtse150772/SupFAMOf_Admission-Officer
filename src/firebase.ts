import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, User } from "firebase/auth";
import { getMessaging, Messaging } from "firebase/messaging";
import { getDownloadURL, getStorage, ref, uploadBytesResumable, UploadTaskSnapshot } from "firebase/storage";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const firebaseConfig = {
  apiKey: "AIzaSyAVNIh-RA2rgMZh3zGvQsO2DIepWfVIGJ8",
  authDomain: "supfamof-c8c84.firebaseapp.com",
  projectId: "supfamof-c8c84",
  storageBucket: "supfamof-c8c84.appspot.com",
  messagingSenderId: "799879175588",
  appId: "1:799879175588:web:26e0facc264f8bd6caf531",
  measurementId: "G-LLT7X3RFYH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const messaging: Messaging = getMessaging(app);
export const provider = new GoogleAuthProvider();

// Custom hook
export function useAuth(): User | null {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user: any) => setCurrentUser(user));
    return unsub;
  }, []);
  return currentUser;
}

// Storage
export async function upload(file: File, setLoading: React.Dispatch<React.SetStateAction<boolean>>, setPhotoURL: React.Dispatch<React.SetStateAction<string>>): Promise<string> {
  const fileRef = ref(storage, `images/admission/event${uuidv4()}`);

  setLoading(true);

  const uploadTask = uploadBytesResumable(fileRef, file);

  const snapshot: UploadTaskSnapshot = await uploadTask;

  const photoURL: string = await getDownloadURL(snapshot.ref);
  console.log('photoUrl: ', photoURL)
  setPhotoURL(photoURL);
  // await updateProfile(currentUser, { photoURL });
  setLoading(false);
  return photoURL;
}
export async function uploadAvatar(file: File, setLoading: React.Dispatch<React.SetStateAction<boolean>>, setPhotoURL: React.Dispatch<React.SetStateAction<string>>): Promise<string> {
  const fileRef = ref(storage, `images/admission/event${uuidv4()}`);
  setLoading(true);
  const uploadTask = uploadBytesResumable(fileRef, file);
  const snapshot: UploadTaskSnapshot = await uploadTask;
  const photoURL: string = await getDownloadURL(snapshot.ref);
  setPhotoURL(photoURL);
  setLoading(false);
  return photoURL;
}

// export async function uploadImgPost(
//   files: File[],
//   setLoading: React.Dispatch<React.SetStateAction<boolean>>,
//   setPhotoURL: React.Dispatch<React.SetStateAction<{ url: string }[]>>,
//   setIsCreated: React.Dispatch<React.SetStateAction<boolean>>
// ): Promise<boolean | undefined> {
//   setLoading(true);
//   const urls: string[] = [];
//   try {
//     for (let i = 0; i < files.length; i++) {
//       const file = files[i];
//       const fileRef = ref(storage, `images/${uuidv4()}`);
//       const uploadTask = uploadBytesResumable(fileRef, file);
//       const snapshot: UploadTaskSnapshot = await uploadTask;
//       const url: string = await getDownloadURL(snapshot.ref);
//       urls.push(url);
//     }
//     const urlList = urls.map((url) => ({ url }));
//     // Update user's urlImageList with the uploaded image URLs
//     if (urlList.length > 0) {
//       setLoading(false);
//       setPhotoURL(urlList);
//       setIsCreated(true);
//       return true;
//     }
//   } catch (error) {
//     console.error(error);
//     setLoading(false);
//     setIsCreated(false);
//     return false;
//   }
// }
// const uploadImageToFirebase = async (file: UploadFile) => {
//   try {
//     // Tạo một tham chiếu đến nơi bạn muốn lưu trữ hình ảnh trong Firebase Storage.
    
//     const storageRef = storage().ref(`path/to/upload/${file.name}`);

//     // Upload hình ảnh lên Firebase Storage.
//     const snapshot = await storageRef.put(file.originFileObj);

//     // Lấy URL của hình ảnh sau khi đã upload lên Firebase.
//     const downloadURL = await snapshot.ref.getDownloadURL();

//     // Cập nhật thuộc tính "url" trong đối tượng "file".
//     file.url = downloadURL;
//     // Cập nhật trạng thái "done" nếu bạn muốn.
//     file.status = 'done';

//     // Trả về đối tượng file sau khi đã upload thành công.
//     return file;
//   } catch (error) {
//     // Xử lý lỗi nếu có.
//     console.error('Lỗi khi upload hình ảnh:', error);
//     // Cập nhật trạng thái "error" và lưu thông báo lỗi nếu bạn muốn.
//     file.status = 'error';
//     file.error = error.message;
//     return file;
//   }
// };

