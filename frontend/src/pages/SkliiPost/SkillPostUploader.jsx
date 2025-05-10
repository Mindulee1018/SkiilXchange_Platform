import React, { useState } from "react";
import { Modal, Form, Input, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useSnapshot } from "valtio";
import state from "../../util/Store";
import PostService from "../../services/PostService";
import UploadFileService from "../../services/UploadFileService";

const uploader = new UploadFileService();

const SkillPostUploader = () => {
  const snap = useSnapshot(state);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaURLs, setMediaURLs] = useState([]);
  const [mediaUploading, setMediaUploading] = useState(false);

  const handleCreate = async (values) => {
    if (mediaURLs.length === 0) {
      message.error("Please upload at least one media file.");
      return;
    }

    try {
      setLoading(true);

      const body = {
        contentDescription: values.contentDescription,
        mediaLinks: mediaURLs.map((file) => file.url),
        mediaTypes: mediaURLs.map((file) => file.type),
      };

      await PostService.createPost(body);
      state.posts = (await PostService.getPosts()).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      message.success("Post created successfully!");
      state.uploadPostModalOpened = false;
      form.resetFields();
      setMediaFiles([]);
      setMediaURLs([]);
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
          resolve();
        }
      };

      video.onerror = () => {
        reject("Invalid video file.");
      };

      video.src = URL.createObjectURL(file);
    });

  const handleFileChange = async ({ fileList }) => {
    if (fileList.length > 3) {
      message.error("You can upload a maximum of 3 media files.");
      return;
    }

    setMediaUploading(true);
    const uploaded = [...mediaURLs];
    const newMediaFiles = [];

    for (const fileObj of fileList) {
      const existing = uploaded.find((f) => f.uid === fileObj.uid);
      if (existing) {
        newMediaFiles.push(existing);
      } else {
        const file = fileObj.originFileObj;
        const fileType = file.type.split("/")[0];

        if (fileType === "video") {
          try {
            await validateVideoDuration(file);
          } catch (err) {
            message.error(err);
            continue;
          }
        }

        try {
const url = await uploader.uploadFile(file, "posts", 123, "Media file upload");
          const uploadedFile = {
            uid: fileObj.uid,
            url,
            type: fileType,
          };
          uploaded.push(uploadedFile);
          newMediaFiles.push(uploadedFile);
        } catch (err) {
          console.error("Upload failed:", err);
          message.error("Failed to upload a file.");
        }
      }
    }

    setMediaURLs(uploaded);
    setMediaFiles(fileList);
    setMediaUploading(false);
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