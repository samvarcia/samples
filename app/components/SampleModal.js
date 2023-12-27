import styles from "./SampleModal.module.css";
import { motion } from "framer-motion";
export default function SampleModal({ media, onClose }) {
  const handleClick = (event) => {
    // Prevent the click event from propagating to the underlying iframe
    event.stopPropagation();
  };

  console.log("MEDIA: " + media);
  function getYouTubeVideoId(url) {
    const videoId = url.split("v=")[1].split("&")[0];
    return videoId;
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.9 }}
      className={`${styles.overlay} ${media ? styles.active : ""}`}
      onClick={onClose}
    >
      <motion.div
        // initial={{ opacity: 0 }}
        // animate={{ opacity: 1 }}
        // exit={{ opacity: 0 }}
        // transition={{ duration: 1.2 }}
        className={`${styles.modal} ${media ? styles.active : ""}`}
      >
        {media && media.link && media.link.includes("youtube.com") ? (
          // If it's a YouTube link, render the video iframe
          <div className={styles.fullVideoContainer}>
            <iframe
              src={`https://www.youtube.com/embed/${getYouTubeVideoId(
                media.link
              )}`}
              width="100%"
              height="100%"
              title="YouTube video player"
              style={{ border: "none" }}
              allowfullscreen
            ></iframe>
          </div>
        ) : (
          // For other media types or non-YouTube links, render the image
          <img src={media} alt="Full View" className={styles.fullImage} />
        )}
      </motion.div>
    </motion.div>
  );
}
