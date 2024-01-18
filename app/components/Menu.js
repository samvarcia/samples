import styles from "./Menu.module.css";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import DropModal from "./DropModal";
export default function Menu({ onDropMedia, setImages }) {
  const [isDropModalOpen, setIsDropModalOpen] = useState(false);

  const openDropModal = () => {
    setIsDropModalOpen(true);
  };

  const closeDropModal = () => {
    setIsDropModalOpen(false);
  };

  const handleDropMedia = (media) => {
    // Pass the dropped media to the parent component
    onDropMedia(media);
    closeDropModal();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2.5 }}
    >
      <div className={styles.menu}>
        <div className={styles.menu_content}>
          <p onClick={openDropModal}>Drop</p>
          <Image
            src="/SAMPLESLOGO.svg"
            width={600}
            height={126.07}
            alt="SAMPLES"
            className={styles.logo}
          />
          <p>Projects</p>
        </div>
      </div>
      {/* Render the DropModal component conditionally */}
      {isDropModalOpen && (
        <DropModal
          onClose={closeDropModal}
          onDropMedia={handleDropMedia}
          setImages={setImages}
        />
      )}
    </motion.div>
  );
}
