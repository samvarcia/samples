"use client";
import Image from "next/image";
import styles from "./page.module.css";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
console.log(Swiper);
export default function Home() {
  return (
    <div className={styles.app}>
      <div className={styles.panorama_slider}>
        <Swiper
          spaceBetween={50}
          loop={true}
          slidesPerView={3}
          onSlideChange={() => console.log("slide change")}
          onSwiper={(swiper) => console.log(swiper)}
        >
          <SwiperSlide>
            <img
              className={styles.slide_image}
              src="https://pbs.twimg.com/media/F_Dp5MeWwAAVmUs?format=jpg&name=small"
              alt=""
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              class={styles.slide_image}
              src="https://pbs.twimg.com/media/F7YAFlsXUAAimLW?format=png&name=small"
              alt=""
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              class={styles.slide_image}
              src="https://pbs.twimg.com/media/F3xRb4FW4AA89rU?format=jpg&name=large"
              alt=""
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              class={styles.slide_image}
              src="https://pbs.twimg.com/media/F3lKGzWa4AA57u8?format=jpg&name=large"
              alt=""
            />
          </SwiperSlide>
        </Swiper>
      </div>
      <h1>SAMPLES</h1>
    </div>
  );
}
