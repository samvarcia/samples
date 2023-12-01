import styles from "./SampleModal.module.css";

export default function SampleModal({ media, onClose }) {
  const handleClick = (event) => {
    // Prevent the click event from propagating to the underlying iframe
    event.stopPropagation();
  };

  return (
    <div
      className={`${styles.overlay} ${media ? styles.active : ""}`}
      onClick={onClose}
    >
      <div className={`${styles.modal} ${media ? styles.active : ""}`}>
        {media && media.type === "iframe" ? (
          // Wrap the iframe in a container and attach the click event to the container
          <div className={styles.fullVideoContainer}>
            <iframe
              src={media.src}
              width="100%"
              height="100%"
              title="YouTube video player"
              style={{ border: "none" }}
              allowfullscreen
            ></iframe>
          </div>
        ) : (
          // If it's an image, render the image
          <img src={media} alt="Full View" className={styles.fullImage} />
        )}
      </div>
    </div>
  );
}
