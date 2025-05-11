// src/pages/SkliiPost/EditPostModal.jsx
import React, { useEffect } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { useSnapshot } from "valtio";
import state from "../../util/Store";
import PostService from "../../services/PostService";

const EditPostModal = () => {
    const snap = useSnapshot(state);
    const [form] = Form.useForm();
    const post = snap.selectedPost;

    useEffect(() => {
        if (post) {
            form.setFieldsValue({
                contentDescription: post.contentDescription,
            });
        }
    }, [post, form]);

    const handleUpdate = async (values) => {
        try {
            await PostService.updatePost(post.id, {
                contentDescription: values.contentDescription,
            });

            message.success("Post updated successfully!");
            state.editPostModalOpened = false;
            state.selectedPost = null;

            // Refresh posts if needed (optional callback or trigger)
        } catch (err) {
            console.error("Failed to update post", err);
            message.error("Failed to update post.");
        }
    };

    return (
        <Modal
            open={snap.editPostModalOpened}
            title="Edit Your Post"
            onCancel={() => {
                state.editPostModalOpened = false;
                state.selectedPost = null;
            }}
            footer={[
                <Button key="cancel" onClick={() => {
                    state.editPostModalOpened = false;
                    state.selectedPost = null;
                }}>
                    Cancel
                </Button>,
                <Button key="submit" type="primary" onClick={form.submit}>
                    Save Changes
                </Button>,
            ]}
        >
            <Form form={form} onFinish={handleUpdate} layout="vertical">
                <Form.Item
                    name="contentDescription"
                    label="Description"
                    rules={[{ required: true, message: "Description is required." }]}
                >
                    <Input.TextArea rows={4} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditPostModal;