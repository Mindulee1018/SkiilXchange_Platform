import { v4 as uuidv4 } from 'uuid';

class UploadFileService {
  async uploadFile(file, path) {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      const uniqueFileName = `${uuidv4()}_${file.name}`;
      formData.append("file", file);
      formData.append("username", loggedInUsername); // ADD THIS
    formData.append("description", description); // AND THIS

      fetch("http://localhost:8080/api/posts/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Failed to upload file");
        })
        .then((data) => {
          // Assuming the response contains the uploaded file's URL
          resolve(data.url); // Adjust depending on your backend response
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

export default UploadFileService;
