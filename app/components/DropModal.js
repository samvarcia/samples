// DropModal.js

import React, { useState } from "react";
import styles from "./DropModal.module.css"; // Add appropriate styling
import { motion } from "framer-motion";

export default function DropModal({ onClose, onDropMedia }) {
  const [mediaInput, setMediaInput] = useState("");
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  function handleDragOver(event) {
    event.preventDefault();
    setIsDraggingOver(true);
  }
  function handleDragLeave() {
    setIsDraggingOver(false);
  }
  function handleDrop(event) {
    event.preventDefault();
    const newMedia = Array.from(event.dataTransfer.files).map((file) =>
      URL.createObjectURL(file)
    );
    setIsDraggingOver(false);

    // Check if dropped content is a YouTube link
    const youtubeLink = event.dataTransfer.getData("text/plain");
    if (youtubeLink.includes("youtube.com")) {
      // If it's a YouTube link, extract the video ID and create the embedded player URL
      const videoId = youtubeLink.split("v=")[1].split("&")[0];
      const iframeObject = {
        type: "iframe",
        src: `https://www.youtube.com/embed/${videoId}`,
      };
      newMedia.push(iframeObject);
    }

    onDropMedia(newMedia);
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onDragLeave={handleDragLeave}
        transition={{ duration: 0.5 }}
        className={`${styles.dropModal} ${
          isDraggingOver ? styles.blueBackground : ""
        }`}
        onDrop={(e) => {
          handleDrop(e);
        }}
        onDragOver={handleDragOver}
      >
        <h2>DROP ANY REFERENCE (IMAGES & LINKS)</h2>
        <p>IMAGES DRIVE CULTURE</p>
      </motion.div>
    </div>
  );
}
