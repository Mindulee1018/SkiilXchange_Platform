

class UploadFileService {
  async getCurrentUser() {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:8080/api/auth/user', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
  }

  async uploadFile(file, path, description = '') {
    const formData = new FormData();
    const uniqueFileName = `${Date.now()}_${file.name}`;
    formData.append("FilePath", file); // must match backend param
    formData.append("description", description);

    try {
      const user = await this.getCurrentUser();
      formData.append("username", user.username);

      const response = await fetch("http://localhost:8080/api/posts/upload", {
        method: "POST",
        body: formData
      });

      if (!response.ok) throw new Error("Failed to upload file");
      const data = await response.json();
      return data.mediaLink; // adjust if your backend returns differently
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export default UploadFileService;
