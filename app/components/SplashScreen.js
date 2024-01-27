import styles from "./SplashScreen.module.css";
import Image from "next/image";

export default function SplashScreen() {
  return (
    <div className={styles.splashWrapper}>
      <div className={styles.splashContent}>
        <Image
          src="/SAMPLESLOGO.svg"
          width={600}
          height={126.07}
          alt="SAMPLES"
          className={styles.logo}
        />
        <p>INFINITE STREAM OF REFERENCES</p>
      </div>
    </div>
  );
}
