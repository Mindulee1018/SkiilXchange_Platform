import { storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

class UploadFileService {
  async uploadFile(file, folder = "posts") {
    return new Promise((resolve, reject) => {
      const fileName = `${folder}/${uuidv4()}_${file.name}`;
      const fileRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on(
        "state_changed",
        null,
        (error) => reject(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => resolve(downloadURL))
            .catch(reject);
        }
      );
    });
  }
}

export default UploadFileService;
