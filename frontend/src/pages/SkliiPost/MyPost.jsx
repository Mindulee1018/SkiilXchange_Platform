import React from "react";
import { useSnapshot } from "valtio";
import state from "../../util/Store";
import SkillPostUploader from "./SkillPostUploader";
import "../../Styles/MyPost.css";
import "antd/dist/reset.css";

const MyPost = () => {
  const snap = useSnapshot(state);

  return (
    <>
      <div
        onClick={() => {
          state.uploadPostModalOpened = true;
        }}
        className="my-post"
      >
        <div className="accent-bar"></div>
        <div className="post-content">
          <div className="post-icon">
            <i className="fas fa-edit"></i>
          </div>
          <div className="post-text">
            <div className="post-description">
              Create a new post to share with the community
            </div>
          </div>
        </div>
        <div className="hover-overlay"></div>
      </div>

    {/*  <UploadPostFormModal />  <- Include the modal component */}
    </>
  );
};

export default MyPost;
