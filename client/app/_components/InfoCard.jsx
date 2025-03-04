import React, { useState } from "react";
import "./Infocard.css";

const Infocard = () => {
  const [liked, setLiked] = useState(false);

  const toggleLike = () => {
    setLiked((prevLiked) => !prevLiked);
  };

  return (
    <div className="post-card">
      <div className="post-image-container">
        <span
          className={`like-button ${liked ? "liked" : ""}`}
          onClick={toggleLike}
        >
          {liked ? "❤️" : "🤍"}
        </span>
        <img
          className="post-image"
          src="https://picsum.photos/400/400"
          alt="Post"
        />
      </div>
      <div className="post-content">
        <p className="caption">
          <strong>Place Name</strong>
          <br />
          Description
        </p>
        <p className="location">
          <strong>Location:</strong> Location details here...
        </p>
      </div>
    </div>
  );
};

export default Infocard;
