import React, { useState } from "react";
import { Modal, Form, Input, Button, Upload, message } from "antd";
import { useSnapshot } from "valtio";
import state from "../../Utils/Store";
import UploadFileService from "../../Services/UploadFileService";
import { UploadOutlined } from "@ant-design/icons";
import PostService from "../../Services/PostService";

const uploader = new UploadFileService();

const CreatePostModal = () => {
  const snap = useSnapshot(state);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [fileType, setFileType] = useState("image");
  const [image, setImage] = useState("");

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (!image) {
        message.error("Please upload a media file before submitting.");
        return;
      }

      setLoading(true);

      const body = {
        ...values,
        mediaLink: image,
        userId: snap.currentUser?.uid,
        mediaType: fileType,
      };

      // Temporary post for UI feedback
      const tempId = `temp-${Date.now()}`;
      const tempPost = {
        ...body,
        id: tempId,
        createdAt: new Date().toISOString(),
      };
      state.posts = [tempPost, ...state.posts];

      // Actual API call
      const newPost = await PostService.createPost(body);

      // Replace temporary post
      state.posts = state.posts.map((post) =>
        post.id === tempId ? newPost : post
      );

      message.success("Post created successfully");

      // Cleanup
      form.resetFields();
      setImage("");
      setFileType("image");
      state.createPostModalOpened = false;
    } catch (error) {
      state.posts = state.posts.filter((post) => !post.id.startsWith("temp-"));
      console.error("Failed to create post:", error);
      message.error("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (info) => {
    if (info.file) {
      setImageUploading(true);
      const fileType = info.file.type.split("/")[0];
      setFileType(fileType);
      try {
        const url = await uploader.uploadFile(
          info.fileList[0].originFileObj,
          "posts"
        );
        setImage(url);
      } catch (err) {
        console.error("Upload error:", err);
        message.error("Failed to upload file");
      } finally {
        setImageUploading(false);
      }
    }
  };

  return (
    <Modal
      open={state.createPostModalOpened}
      onCancel={() => {
        form.resetFields();
        setImage("");
        setFileType("image");
        state.createPostModalOpened = false;
      }}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="contentDescription"
          label="Content Description"
          rules={[{ required: true, message: "Please enter content description" }]}
        >
          <Input.TextArea />
        </Form.Item>

        {imageUploading && <p>Media is uploading, please wait...</p>}

        {!imageUploading && (
          <Form.Item label="Upload Media">
            <Upload
              accept="image/*,video/*"
              onChange={handleFileChange}
              showUploadList={false}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Upload Media</Button>
            </Upload>
          </Form.Item>
        )}

        {fileType === "image" && image && (
          <img
            src={image}
            alt="preview"
            style={{
              maxWidth: "100%",
              maxHeight: "400px",
              width: "100%",
              height: "auto",
              objectFit: "contain",
              marginBottom: "1rem",
            }}
          />
        )}

        {fileType === "video" && image && (
          <video
            controls
            src={image}
            style={{ maxHeight: 400, width: "100%", marginBottom: "1rem" }}
          />
        )}

        {!imageUploading && (
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Create Post
            </Button>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default CreatePostModal;
