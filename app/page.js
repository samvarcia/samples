"use client";
import Image from "next/image";
import { useState } from "react";
import styles from "./page.module.css";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
// console.log(Swiper);
export default function Home() {
  const [images, setImages] = useState([
    "https://pbs.twimg.com/media/F7YAFlsXUAAimLW?format=png&name=small",
    "https://pbs.twimg.com/media/F3xRb4FW4AA89rU?format=jpg&name=large",
    "https://pbs.twimg.com/media/F3lKGzWa4AA57u8?format=jpg&name=large",
  ]);

  function handleDrop(event) {
    event.preventDefault();
    const newImages = Array.from(event.dataTransfer.files).map((file) =>
      URL.createObjectURL(file)
    );
    setImages((prevImages) => [...prevImages, ...newImages]);
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function b({ swiper: a, extendParams: s, on: o }) {
    s({
      panoramaEffect: {
        depth: 200,
        rotate: 30,
      },
    }),
      o("beforeInit", () => {
        if (a.params.effect !== "panorama") return;
        a.classNames.push(`${a.params.containerModifierClass}panorama`),
          a.classNames.push(`${a.params.containerModifierClass}3d`);
        const r = {
          watchSlidesProgress: !0,
        };
        Object.assign(a.params, r), Object.assign(a.originalParams, r);
      }),
      o("progress", () => {
        if (a.params.effect !== "panorama") return;
        const r = a.slidesSizesGrid,
          { depth: e = 200, rotate: t = 30 } = a.params.panoramaEffect,
          g = (t * Math.PI) / 180 / 2,
          h = 1 / (180 / t);
        for (let i = 0; i < a.slides.length; i += 1) {
          const d = a.slides[i],
            P = d.progress,
            c = r[i],
            y = a.params.centeredSlides
              ? 0
              : (a.params.slidesPerView - 1) * 0.5,
            l = P + y,
            f = 1 - Math.cos(l * h * Math.PI),
            m = `${l * (c / 3) * f}px`,
            p = l * t,
            u = `${((c * 0.5) / Math.sin(g)) * f - e}px`;
          d.style.transform =
            a.params.direction === "horizontal"
              ? `translateX(${m}) translateZ(${u}) rotateY(${p}deg)`
              : `translateY(${m}) translateZ(${u}) rotateX(${-p}deg)`;
        }
      }),
      o("setTransition", (r, e) => {
        a.params.effect === "panorama" &&
          a.slides.forEach((t) => {
            t.style.transitionDuration = `${e}ms`;
          });
      });
  }
  // console.log(b);
  return (
    <div className={styles.app}>
      <div
        className={styles.panorama_slider}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className={styles.swiper_container}>
          <Swiper
            modules={[b]}
            effect="panorama"
            spaceBetween={3}
            centeredSlides={true}
            grabCursor={true}
            // loopAdditionalSlides={1}
            loop={true}
            slidesPerView={3}
            panoramaEffect={{ depth: 50, rotate: 45 }}
            breakpoints={{
              480: {
                slidesPerView: 2,
                panoramaEffect: {
                  rotate: 35,
                  depth: 150,
                },
              },
              640: {
                slidesPerView: 3,
                panoramaEffect: {
                  rotate: 30,
                  depth: 150,
                },
              },
              1024: {
                slidesPerView: 4,
                panoramaEffect: {
                  rotate: 30,
                  depth: 200,
                },
              },
              1200: {
                slidesPerView: 4,
                panoramaEffect: {
                  rotate: 25,
                  depth: 250,
                },
              },
            }}
          >
            {images.map((imageUrl, index) => (
              <SwiperSlide key={index}>
                <div className={styles.swiper_slide}>
                  <img
                    className={styles.slide_image}
                    src={imageUrl}
                    alt={`Slide ${index}`}
                    loading="lazy"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <h1>SAMPLES</h1>
    </div>
  );
}
