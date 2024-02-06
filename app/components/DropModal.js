// DropModal.js

import React, { useState } from "react";
import styles from "./DropModal.module.css"; // Add appropriate styling
import { motion } from "framer-motion";
import mql from "@microlink/mql";
import Image from "next/image";

export default function DropModal({ onClose, setImages, modalOpen }) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [preview, setPreview] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [websiteLoading, setWebsiteLoading] = useState(false);
  const [isPaste, setIsPaste] = useState(false);
  const [pastedLink, setPastedLink] = useState("");

  console.log(modalOpen);

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
    for (const image of images) {
      const imgbbLink = await uploadImageToImgBB(image);
      if (imgbbLink) {
        previewContent.push({ link: imgbbLink, thumbnail: imgbbLink });
        // console.log(imgbbLink);
        setType("image");
      }
    }
    // Handle YouTube links
    for (const youtubeLink of youtubeLinks) {
      const videoId = youtubeLink.split("v=")[1].split("&")[0];
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      previewContent.push({ link: youtubeLink, thumbnail: thumbnailUrl });
      setType("youtube");
    }

    // Handle website links using the Microlink API
    for (const websiteLink of websiteLinks) {
      if (!/(png|jpg)/.test(websiteLink)) {
        try {
          setWebsiteLoading(true);
          const { status, data } = await mql(websiteLink, { screenshot: true });

          if (status === "success" && data.screenshot) {
            previewContent.push({
              website: websiteLink,
              link: websiteLink,
              thumbnail: data.screenshot.url,
            });
            setType("website");
          } else {
            console.warn("Microlink data does not contain a screenshot:", data);
          }
        } catch (error) {
          console.error("Error fetching Microlink data:", error);
        } finally {
          setWebsiteLoading(false); // Set loading state to false after API call
        }
      }
    }

    if (/(jpg|jpeg|png)/i.test(contentLink)) {
      const previewUrl = contentLink; // Replace this with your actual logic for obtaining the preview URL
      previewContent.push({ link: previewUrl, thumbnail: previewUrl });
      setType("image");
    }

    // Handle image links
    const imageLinks = Array.from(event.dataTransfer.items).filter(
      (item) => item.kind === "string" && /\.(jpg|jpeg|png)$/i.test(item.type)
    );

    for (const imageLink of imageLinks) {
      imageLink.getAsString((url) => {
        previewContent.push({ link: url, thumbnail: url });
        setType("image");
      });
    }

    setPreview([...preview, ...previewContent]);

    setIsDraggingOver(false);
  }

  function handleIsPaste() {
    setIsPaste(true);
  }
  async function handlePasteSample() {
    const pastedLinkSample = pastedLink;

    // Get the content link
    const contentLink = pastedLinkSample;

    const youtubeLinks = contentLink.includes("youtube.com")
      ? [contentLink]
      : [];
    const websiteLinks = !contentLink.includes("youtube.com")
      ? [contentLink]
      : [];

    // Prepare an array to store the preview content
    const previewContent = [];

    // Handle YouTube links
    for (const youtubeLink of youtubeLinks) {
      const videoId = youtubeLink.split("v=")[1].split("&")[0];
      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      previewContent.push({ link: youtubeLink, thumbnail: thumbnailUrl });
      setType("youtube");
    }

    // Handle website links using the Microlink API
    for (const websiteLink of websiteLinks) {
      if (!/(png|jpg)/.test(websiteLink)) {
        try {
          setWebsiteLoading(true);
          const { status, data } = await mql(websiteLink, { screenshot: true });

          if (status === "success" && data.screenshot) {
            previewContent.push({
              website: websiteLink,
              link: websiteLink,
              thumbnail: data.screenshot.url,
            });
            setType("website");
          } else {
            console.warn("Microlink data does not contain a screenshot:", data);
          }
        } catch (error) {
          console.error("Error fetching Microlink data:", error);
        } finally {
          setWebsiteLoading(false); // Set loading state to false after API call
        }
      }
    }
    setPreview([...preview, ...previewContent]);

    setIsDraggingOver(false);
  }
  async function uploadImageToImgBB(imageFile) {
    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await fetch(
        "https://api.imgbb.com/1/upload?key=ee3ec80a22204ba422f8f9117aa75700",
        {
          method: "POST",
          body: formData,
        }
      );

      const responseData = await response.json();

      if (responseData.data && responseData.data.url) {
        // console.log(responseData.data.url);
        return responseData.data.url;
      } else {
        console.error(
          "ImgBB API response is missing the expected data:",
          responseData
        );
        return null;
      }
    } catch (error) {
      console.error("Error uploading image to ImgBB:", error);
      return null;
    }
  }
  async function pastingSamples(event) {
    if (modalOpen) {
      // event.preventDefault();

      const contentLink = event.clipboardData.getData("text/plain");
      const droppedFiles = event.clipboardData.files;

      const imageFiles = Array.from(droppedFiles).filter((file) =>
        /(png|jpg)/.test(file.type)
      );

      const youtubeLinks = contentLink.includes("youtube.com")
        ? [contentLink]
        : [];
      const websiteLinks = !contentLink.includes("youtube.com")
        ? [contentLink]
        : [];

      // Prepare an array to store the preview content
      const previewContent = [];

      for (const imageFile of imageFiles) {
        const imgbbLink = await uploadImageToImgBB(imageFile);
        if (imgbbLink) {
          previewContent.push({ link: imgbbLink, thumbnail: imgbbLink });
          // console.log(imgbbLink);
          setType("image");
        }
      }
      // Handle YouTube links
      for (const youtubeLink of youtubeLinks) {
        const videoId = youtubeLink.split("v=")[1].split("&")[0];
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        previewContent.push({ link: youtubeLink, thumbnail: thumbnailUrl });
        setType("youtube");
      }

      // Handle website links using the Microlink API
      for (const websiteLink of websiteLinks) {
        if (!/(png|jpg)/.test(websiteLink)) {
          try {
            setWebsiteLoading(true);
            const { status, data } = await mql(websiteLink, {
              screenshot: true,
            });

            if (status === "success" && data.screenshot) {
              previewContent.push({
                website: websiteLink,
                link: websiteLink,
                thumbnail: data.screenshot.url,
              });
              setType("website");
            } else {
              console.warn(
                "Microlink data does not contain a screenshot:",
                data
              );
            }
          } catch (error) {
            console.error("Error fetching Microlink data:", error);
          } finally {
            setWebsiteLoading(false); // Set loading state to false after API call
          }
        }
      }

      if (/(jpg|jpeg|png)/i.test(contentLink)) {
        const previewUrl = contentLink; // Replace this with your actual logic for obtaining the preview URL
        previewContent.push({ link: previewUrl, thumbnail: previewUrl });
        setType("image");
      }
      setPreview([...preview, ...previewContent]);

      setIsDraggingOver(false);
    }
  }

  async function handleSave(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    // Prepare data to be sent in the request body
    const postData = {
      name,
      description,
      type: type, // You can adjust the type accordingly
      link: preview.map((item) => item.link).join(","),
      thumbnail: preview.map((item) => item.thumbnail).join(","),
    };

    try {
      // Send a POST request to the API endpoint
      const response = await fetch("/api/addsamples", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (response.ok) {
        console.log("Sample added successfully");
      } else {
        console.error("Failed to add sample:", response.statusText);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
    }

    setImages((prevImages) => [
      ...prevImages,
      ...preview.map((item) => ({
        ...item,
        name,
        type,
        description,
      })),
    ]);

    // Close the modal
    onClose();
  }

  return (
    <div className={styles.modalContainer}>
      <motion.div
        onPaste={(e) => {
          pastingSamples(e);
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onDragLeave={handleDragLeave}
        transition={{ duration: 0.3 }}
        className={`${styles.dropModal} ${
          isDraggingOver ? styles.blueBackground : ""
        }`}
        onDrop={(e) => {
          handleDrop(e);
        }}
        onDragOver={handleDragOver}
      >
        {websiteLoading ? (
          <h1>LOADING...</h1>
        ) : preview.length ? (
          <div>
            {preview.map((item, index) => (
              <div key={index} className={styles.preview}>
                {item instanceof File ? (
                  <motion.div
                    className={styles.previewContent}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      width={600}
                      height={500}
                      src={item.preview}
                      alt="Preview"
                    />
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
                        placeholder="Context"
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
                          onClick={(e) => handleSave(e)}
                          className={styles.saveButton}
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    className={styles.previewContent}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img src={item.thumbnail} alt="Thumbnail" loading="lazy" />
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
                          placeholder="Context"
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
                          onClick={(e) => handleSave(e)}
                          className={styles.saveButton}
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.dropText}>
            <div className={styles.pasteArea}>
              {isPaste ? (
                <motion.div
                  className={styles.pasteAreaContent}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <input
                    type="text"
                    required
                    placeholder="PASTE ANY REFERENCE"
                    onChange={(e) => setPastedLink(e.target.value)}
                    className={styles.pasteInput}
                    // value={name}
                    // onChange={(e) => setName(e.target.value)}
                  />
                  <div className={styles.pasteAreButtons}>
                    <button
                      onClick={() => setIsPaste(false)}
                      className={styles.cancelPasteButton}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePasteSample}
                      className={styles.dropButton}
                    >
                      Drop
                    </button>
                  </div>
                </motion.div>
              ) : (
                <>
                  <h2 onClick={handleIsPaste}>
                    DROP OR PASTE ANY REFERENCE (IMAGES & LINKS)
                  </h2>
                  <p>IMAGES DRIVE CULTURE</p>
                </>
              )}
            </div>
          </div>
        )}
      </motion.div>
      <div className={styles.overlay} onClick={onClose}></div>
    </div>
  );
}
