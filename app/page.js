"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import styles from "./page.module.css";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import SampleModal from "./components/SampleModal";

// Import Swiper styles
import "swiper/css";
// console.log(Swiper);
export default function Home() {
  const swiperRef = useRef(null);
  const [modalImageUrl, setModalImageUrl] = useState(null);

  const [images, setImages] = useState([
    "https://pbs.twimg.com/media/F7YAFlsXUAAimLW?format=png&name=small",
    "https://pbs.twimg.com/media/F3xRb4FW4AA89rU?format=jpg&name=large",
    "https://pbs.twimg.com/media/F3lKGzWa4AA57u8?format=jpg&name=large",
    "https://pbs.twimg.com/media/F_3q9FLW0AAh1hx?format=jpg&name=4096x4096",
    "https://pbs.twimg.com/media/F_pUb85WUAAunEX?format=jpg&name=medium",
    "https://pbs.twimg.com/media/Fe9uNuPUYAESUyN?format=jpg&name=small",
  ]);

  const [lastSlidePosition, setLastSlidePosition] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  function centerSwiper(index) {
    swiperRef.current.swiper.slideTo(index);
  }

  function handleDrop(event) {
    event.preventDefault();
    const newImages = Array.from(event.dataTransfer.files).map((file) =>
      URL.createObjectURL(file)
    );
    setImages((prevImages) => [...prevImages, ...newImages]);
    console.log("IMAGES NEW NUMBER " + images.length);
  }
  function handleSlideChange(swiper) {
    const imagesTotal = images.length;
    const centeredIndex = imagesTotal - 1; // Index of the last image
    swiper.slideToLoop(centeredIndex);
  }
  function handleSlideMove(swiper) {
    const centeredIndex = swiper.realIndex;
    const samplesTotal = images.length;

    // console.log("CURRENT & TOTAL: " + centeredIndex + " " + samplesTotal);
  }
  function handleDragOver(event) {
    event.preventDefault();
  }
  const openModal = (imageUrl) => {
    setModalImageUrl(imageUrl);
  };

  const closeModal = () => {
    setModalImageUrl(null);
  };
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
      {modalImageUrl && (
        <SampleModal imageUrl={modalImageUrl} onClose={closeModal} />
      )}
      <div
        className={styles.panorama_slider}
        onDrop={(e) => {
          handleDrop(e);
        }}
        onDragOver={handleDragOver}
      >
        <div className={styles.swiper_container}>
          <Swiper
            ref={swiperRef}
            modules={[b]}
            effect="panorama"
            spaceBetween={3}
            // onSlideClick={(swiper) => {
            //   console.log("Slide clicked!", images[swiper.activeIndex]);
            //   openModal(images[swiper.activeIndex]);
            // }}
            onSlideChange={(swiper) => handleSlideMove(swiper)}
            centeredSlides={true}
            // grabCursor={true}
            // height={310}
            onUpdate={(swiper) => handleSlideChange(swiper)}
            // loopAdditionalSlides={1}
            loop={true}
            slidesPerView={3}
            initialSlide={0}
            panoramaEffect={{ depth: 150, rotate: 45 }}
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
              <SwiperSlide key={index} onClick={() => openModal(imageUrl)}>
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
