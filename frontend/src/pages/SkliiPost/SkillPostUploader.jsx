import React, { useState } from "react";
import { Modal, Form, Input, Button, Upload, message, Typography, Divider, } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useSnapshot } from "valtio";
import state from "../../util/Store";
import PostService from "../../services/PostService";
import useProfile from "../../hooks/useProfile";
import "../../Styles/SkillPostUploader.css";
// import "../../Styles/SkillPostUploader.css";


const { Title, Text } = Typography;

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
//video validation
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
      footer={null}
      centered
      bodyStyle={{ padding: "24px 32px", backgroundColor: "#f9f9f9", borderRadius: 12 }}
    >
      <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: 20 }}>
        🎯 Create Skill Sharing Post
      </h2>

      <Form
        form={form}
        onFinish={handleCreate}
        layout="vertical"
        style={{ marginBottom: "1rem" }}
      >
        <Form.Item
          name="contentDescription"
          label={<strong>Content Description</strong>}
          rules={[{ required: true, message: "Please enter content description" }]}
        >
          <Input.TextArea rows={4} placeholder="Share what you’ve learned or discovered..." />
        </Form.Item>

        <Form.Item label={<strong>Upload Media (Max 3)</strong>}>
          <Upload
            accept="image/*,video/*"
            multiple
            maxCount={3}
            showUploadList
            beforeUpload={() => false}
            onChange={handleFileChange}
            fileList={mediaFiles}
            style={{ width: "100%" }}
          >
            <Button icon={<UploadOutlined />} block>
              Upload Media
            </Button>
          </Upload>
          {error && (
            <p style={{ color: "red", marginTop: "8px", fontWeight: 500 }}>{error}</p>
          )}
        </Form.Item>

        {mediaUploading && (
          <p style={{ color: "#1890ff", marginBottom: 12 }}>📤 Uploading media, please wait...</p>
        )}

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
          {mediaURLs.map((file, index) =>
            file.type === "image" ? (
              <img
                key={index}
                src={file.url}
                alt="preview"
                style={{
                  width: 150,
                  height: 150,
                  objectFit: "cover",
                  borderRadius: 8,
                  boxShadow: "0 0 6px rgba(0,0,0,0.1)",
                }}
              />
            ) : (
              <video
                key={index}
                controls
                src={file.url}
                style={{
                  width: 200,
                  height: 150,
                  borderRadius: 8,
                  boxShadow: "0 0 6px rgba(0,0,0,0.1)",
                }}
              />
            )
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
          <Button
            onClick={() => (state.uploadPostModalOpened = false)}
            style={{ borderRadius: 8 }}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={mediaUploading}
            style={{
              borderRadius: 8,
              backgroundColor: "#1677ff",
              borderColor: "#1677ff",
            }}
          >
            Post Now
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default SkillPostUploader;