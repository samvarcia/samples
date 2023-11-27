import styles from "./SampleModal.module.css";

export default function SampleModal({ imageUrl, onClose }) {
  return (
    <div
      className={`${styles.overlay} ${imageUrl ? styles.active : ""}`}
      onClick={onClose}
    >
      <div className={`${styles.modal} ${imageUrl ? styles.active : ""}`}>
        <img src={imageUrl} alt="Full View" className={styles.fullImage} />
      </div>
    </div>
  );
}
