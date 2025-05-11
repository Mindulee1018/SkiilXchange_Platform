import React, { useState } from "react";
import { Modal, Form, Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useSnapshot } from "valtio";
import state from "../../util/Store";
import PostService from "../../services/PostService";
import useProfile from "../../hooks/useProfile";

const SkillPostUploader = () => {
  const snap = useSnapshot(state);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaURLs, setMediaURLs] = useState([]);
  const [mediaUploading, setMediaUploading] = useState(false);
  const [error, setError] = useState("");
  const { profile } = useProfile();

  const handleCreate = async (values) => {
    if (mediaURLs.length === 0) {
      message.error("Please upload at least one media file.");
      return;
    }
  
    try {
      setLoading(true);
  
      // The post is already created during media upload
      message.success("Post created successfully!");
      form.resetFields();
      setMediaFiles([]);
      setMediaURLs([]);
      state.uploadPostModalOpened = false;
    } catch (error) {
      console.error("Failed to create post:", error);
      message.error("Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  const validateVideoDuration = (file) =>
    new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        if (video.duration > 30) {
          reject("Video must be 30 seconds or less.");
        } else {
          resolve(true);
        }
      };

      video.onerror = () => {
        reject("Invalid video file.");
      };

      video.src = URL.createObjectURL(file);
    });

  const handleFileChange = async ({ fileList }) => {
    const token = localStorage.getItem("token");
    setError("");
    setMediaFiles(fileList);

    if (fileList.length > 3) {
      setError("You can upload a maximum of 3 media files.");
      return;
    }

    const files = fileList.map(f => f.originFileObj).filter(Boolean);
    const hasVideo = files.some(f => f.type.startsWith("video"));

    if (hasVideo && files.length > 1) {
      setError("Only one video is allowed per post.");
      return;
    }

    if (hasVideo) {
      try {
        await validateVideoDuration(files[0]);
      } catch (err) {
        setError(err);
        return;
      }
    }

    try {
      setMediaUploading(true);
      const mediaData = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append("FilePath", file);
        formData.append("username", profile.username);
        formData.append("Description", form.getFieldValue("contentDescription") || "");

        const response = await fetch("http://localhost:8080/api/posts/upload", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        if (!response.ok) throw new Error("Upload failed");

        const savedPost = await response.json();
        mediaData.push({
          url: `/${savedPost.mediaLink}`,
          type: savedPost.mediaType,
        });
      }

      setMediaURLs(mediaData);
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Upload failed. Please try again.");
    } finally {
      setMediaUploading(false);
    }
  };

  return (
    <Modal
      open={snap.uploadPostModalOpened}
      onCancel={() => {
        state.uploadPostModalOpened = false;
        form.resetFields();
        setMediaFiles([]);
        setMediaURLs([]);
      }}
      footer={[
        <Button key="cancel" onClick={() => (state.uploadPostModalOpened = false)}>
          Cancel
        </Button>,
        <Button
          key="create"
          type="primary"
          loading={loading}
          disabled={mediaUploading}
          onClick={form.submit}
        >
          Create
        </Button>,
      ]}
    >
      <h1>Create Skill Sharing Post</h1>
      <Form form={form} onFinish={handleCreate}>
        <Form.Item
          name="contentDescription"
          label="Content Description"
          rules={[{ required: true, message: "Please enter content description" }]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item label="Upload Media (Max 3)">
          <Upload
            accept="image/*,video/*"
            multiple
            maxCount={3}
            showUploadList
            beforeUpload={() => false}
            onChange={handleFileChange}
            fileList={mediaFiles}
          >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
          {error && <p className="text-danger mt-2">{error}</p>}
        </Form.Item>
      </Form>

      {mediaUploading && <p>Uploading media, please wait...</p>}

      <div style={{ marginTop: "1rem" }}>
        {mediaURLs.map((file, index) =>
          file.type === "image" ? (
            <img
              key={index}
              src={file.url}
              alt="preview"
              style={{ width: "100%", maxHeight: 400, objectFit: "contain", marginBottom: 12 }}
            />
          ) : (
            <video
              key={index}
              controls
              src={file.url}
              style={{ width: "100%", maxHeight: 400, marginBottom: 12 }}
            />
          )
        )}
      </div>
    </Modal>
  );
};

export default SkillPostUploader;