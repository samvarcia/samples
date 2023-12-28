// DropModal.js

import React, { useState } from "react";
import styles from "./DropModal.module.css"; // Add appropriate styling
import { motion } from "framer-motion";
import mql from "@microlink/mql";

export default function DropModal({ onClose, onDropMedia, setImages }) {
  const [mediaInput, setMediaInput] = useState("");
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  function handleDragOver(event) {
    event.preventDefault();
    setIsDraggingOver(true);
  }
  function handleDragLeave() {
    setIsDraggingOver(false);
  }
  async function handleDrop(event) {
    event.preventDefault();
    const newMedia = Array.from(event.dataTransfer.files).map((file) =>
      URL.createObjectURL(file)
    );
    setIsDraggingOver(false);

    // Check if dropped content is a YouTube link
    const youtubeLink = event.dataTransfer.getData("text/plain");
    if (youtubeLink.includes("youtube.com")) {
      // If it's a YouTube link, extract the video ID and add both link and thumbnail
      const videoId = youtubeLink.split("v=")[1].split("&")[0];
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

      setImages((prevImages) => [
        ...prevImages,
        { link: youtubeLink, thumbnail: thumbnailUrl },
      ]);
    } else if (!/(png|jpg)/.test(youtubeLink)) {
      try {
        const { status, data } = await mql(youtubeLink, { screenshot: true });

        // Check if the Microlink data contains a screenshot
        if (status === "success" && data.screenshot) {
          // If yes, add the screenshot URL to the images state
          setImages((prevImages) => [
            ...prevImages,
            {
              url: data.screenshot.url,
              websiteLink: youtubeLink,
            },
          ]);
          console.log(url);
        } else {
          // If not, log a warning
          console.warn("Microlink data does not contain a screenshot:", data);
        }
      } catch (error) {
        console.error("Error fetching Microlink data:", error);
      }
    } else {
      setImages((prevImages) => [...prevImages, ...newMedia]);
    }
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
