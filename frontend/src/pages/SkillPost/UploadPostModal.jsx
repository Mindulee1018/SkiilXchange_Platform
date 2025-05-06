import React, { useState } from "react";
import { Modal, Form, Input, Button, Upload, message } from "antd";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import PostService from "../../Services/PostService";
import UploadFileService from "../../Services/UploadFileService";
import { UploadOutlined } from "@ant-design/icons";

const uploader = new UploadFileService();

const SkillPostUploader = () => {
  const snap = useSnapshot(state);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaUploading, setMediaUploading] = useState(false);
  const [mediaURLs, setMediaURLs] = useState([]);

  const handleCreate = async (values) => {
    if (mediaURLs.length === 0) {
      message.error("Please upload at least one media file.");
      return;
    }
    try {
      setLoading(true);
      for (let i = 0; i < mediaURLs.length; i++) {
        const body = {
          contentDescription: values.contentDescription,
          mediaLink: mediaURLs[i].url,
          mediaType: mediaURLs[i].type,
        };
        await PostService.createPost(body); // Save each post
      }
      state.posts = (await PostService.getPosts()).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      state.uploadPostModalOpened = false;
      form.resetFields();
      setMediaFiles([]);
      setMediaURLs([]);
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async ({ fileList }) => {
    if (fileList.length > 3) {
      message.error("You can upload a maximum of 3 media files.");
      return;
    }

    setMediaUploading(true);
    const uploaded = [];

    for (const fileObj of fileList) {
      const file = fileObj.originFileObj;
      const fileType = file.type.split("/")[0];
      const url = await uploader.uploadFile(file, "posts");
      uploaded.push({ url, type: fileType });
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
      }}
      footer={[
        <Button key="cancel" onClick={() => (state.uploadPostModalOpened = false)}>
          Cancel
        </Button>,
        <Button
          disabled={mediaUploading}
          key="create"
          type="primary"
          loading={loading}
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

        <Form.Item name="mediaLink" label="Upload Media (Max 3)">
          <Upload
            accept="image/*,video/*"
            multiple
            maxCount={3}
            showUploadList={true}
            beforeUpload={() => false}
            onChange={handleFileChange}
            fileList={mediaFiles}
          >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>
      </Form>

      {mediaUploading && <p>Please wait, uploading media...</p>}

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
