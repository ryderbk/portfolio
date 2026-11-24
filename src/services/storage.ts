import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirebaseStorage } from "@/lib/firebase";

export const uploadImage = async (file: File, folder: string = "projects"): Promise<string> => {
  const storage = getFirebaseStorage();
  const filename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
  const storageRef = ref(storage, `${folder}/${filename}`);
  
  await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(storageRef);
  return downloadUrl;
};
