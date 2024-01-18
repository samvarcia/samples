// DropModal.js

import React, { useState } from "react";
import styles from "./DropModal.module.css"; // Add appropriate styling
import { motion } from "framer-motion";
import mql from "@microlink/mql";

export default function DropModal({ onClose, setImages }) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [preview, setPreview] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  function handleDragOver(event) {
    event.preventDefault();
    setIsDraggingOver(true);
  }

  function handleDragLeave() {
    setIsDraggingOver(false);
  }

  async function handleDrop(event) {
    event.preventDefault();

    // Get the dropped files
    const droppedFiles = event.dataTransfer.files;

    // Get the content link
    const contentLink = event.dataTransfer.getData("text/plain");

    // Separate images, YouTube links, and website links
    const images = Array.from(droppedFiles).filter((file) =>
      /(png|jpg)/.test(file.type)
    );
    const youtubeLinks = contentLink.includes("youtube.com")
      ? [contentLink]
      : [];
    const websiteLinks =
      !contentLink.includes("youtube.com") && !images.length
        ? [contentLink]
        : [];

    // Prepare an array to store the preview content
    const previewContent = [];

    // Handle YouTube links
    for (const youtubeLink of youtubeLinks) {
      const videoId = youtubeLink.split("v=")[1].split("&")[0];
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      previewContent.push({ link: youtubeLink, thumbnail: thumbnailUrl });
    }

    // Handle website links using the Microlink API
    for (const websiteLink of websiteLinks) {
      if (!/(png|jpg)/.test(websiteLink)) {
        try {
          const { status, data } = await mql(websiteLink, { screenshot: true });

          if (status === "success" && data.screenshot) {
            previewContent.push({
              website: websiteLink,
              link: websiteLink,
              thumbnail: data.screenshot.url,
            });
          } else {
            console.warn("Microlink data does not contain a screenshot:", data);
          }
        } catch (error) {
          console.error("Error fetching Microlink data:", error);
        }
      }
    }

    for (const imageFile of droppedFiles) {
      // Check if the file has a common image file extension
      if (/\.(jpg|jpeg|png)$/i.test(imageFile.name)) {
        const previewUrl = URL.createObjectURL(imageFile);
        previewContent.push({ link: previewUrl, thumbnail: previewUrl });
        images.push(imageFile);
      }
    }

    // Handle image links
    const imageLinks = Array.from(event.dataTransfer.items).filter(
      (item) => item.kind === "string" && /\.(jpg|jpeg|png)$/i.test(item.type)
    );

    for (const imageLink of imageLinks) {
      const link = imageLink.getAsString((url) => {
        previewContent.push({ link: url, thumbnail: url });
      });
    }

    // Update the preview state
    setPreview([...preview, ...previewContent]);

    // Use setImages to update the actual state with the preview content
    // setImages((prevImages) => [...prevImages, ...images, ...previewContent]);

    // Log the separated variables
    console.log("Preview Content:", previewContent);

    setIsDraggingOver(false);
  }

  function handleSave() {
    // Use setImages to update the actual state with the preview content
    setImages((prevImages) => [
      ...prevImages,
      ...preview.map((item) => ({
        ...item,
        name,
        description,
      })),
    ]);

    // Close the modal
    onClose();
  }

  return (
    <div className={styles.overlay}>
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
        {preview.length ? (
          <div>
            {preview.map((item, index) => (
              <div key={index} className={styles.preview}>
                {item instanceof File ? (
                  <div className={styles.previewContent}>
                    <img src={item.preview} alt="Preview" />
                    <form action="" className={styles.previewForm}>
                      <input
                        type="text"
                        required
                        placeholder="Name"
                        className={styles.nameInput}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Description"
                        className={styles.descriptionInput}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                      <div className={styles.previewButtons}>
                        <button
                          onClick={onClose}
                          className={styles.cancelButton}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          className={styles.saveButton}
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className={styles.previewContent}>
                    <img src={item.thumbnail} alt="Thumbnail" />
                    <form action="" className={styles.previewForm}>
                      <input
                        type="text"
                        required
                        placeholder="Name"
                        className={styles.nameInput}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      <div className={styles.descriptionBox}>
                        <textarea
                          type="text"
                          placeholder="Description"
                          className={styles.descriptionInput}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </div>
                      <div className={styles.previewButtons}>
                        <button
                          onClick={onClose}
                          className={styles.cancelButton}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          className={styles.saveButton}
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  </div>
                )}
                {/* <button onClick={handleSave}>Cancel</button>
                <button onClick={handleSave}>Save</button> */}
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.dropText}>
            <h2>DROP ANY REFERENCE (IMAGES & LINKS)</h2>
            <p>IMAGES DRIVE CULTURE</p>
          </div>
        )}

        {/* Save button */}
      </motion.div>
    </div>
  );
}