"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import styles from "./page.module.css";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import SampleModal from "./components/SampleModal";
import Menu from "./components/Menu";
import { motion } from "framer-motion";
import { Keyboard, Mousewheel } from "swiper/modules";
import { usePathname } from "next/navigation";
import SplashScreen from "./components/SplashScreen";
// Import Swiper styles
import "swiper/css/keyboard";
import "swiper/css/mousewheel";
import "swiper/css";
import DropModal from "./components/DropModal";
// console.log(Swiper);
export default function Home() {
  const swiperRef = useRef(null);
  const [modalSampleUrl, setModalSampleUrl] = useState(null);
  const [isDropModalOpen, setIsDropModalOpen] = useState(false);
  const handleDrop = () => {
    // console.log("ON DROPP");
    setIsDropModalOpen(true);
  };
  useEffect(() => {
    getData();
  }, []);

  const closeDropModal = () => {
    setIsDropModalOpen(false);
  };
  // const [images, setImages] = useState([
  //   "https://pbs.twimg.com/media/F7YAFlsXUAAimLW?format=png&name=small",
  //   "https://pbs.twimg.com/media/F3xRb4FW4AA89rU?format=jpg&name=large",
  //   "https://pbs.twimg.com/media/F3lKGzWa4AA57u8?format=jpg&name=large",
  //   "https://pbs.twimg.com/media/F_3q9FLW0AAh1hx?format=jpg&name=4096x4096",
  //   "https://pbs.twimg.com/media/F_pUb85WUAAunEX?format=jpg&name=medium",
  //   "https://pbs.twimg.com/media/Fe9uNuPUYAESUyN?format=jpg&name=small",
  // ]);
  const [images, setImages] = useState([]);

  const handleDropMedia = (media) => {
    setImages((prevImages) => [...prevImages, media]);
  };
  const getData = async () => {
    await fetch("/api/samples")
      .then((res) => res.json())
      .then((data) => {
        // console.log(data.samples.rows);
        setImages(data.samples.rows);
        setLoading(false);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        // set loading to false
      });
  };

  function handleSlideChange(swiper) {
    const imagesTotal = images.length;
    const centeredIndex = imagesTotal - 1; // Index of the last image
    swiper.slideToLoop(centeredIndex);
  }

  const openModal = (media) => {
    setModalSampleUrl(media);
  };

  const closeModal = () => {
    setModalSampleUrl(null);
  };
  function b({ swiper: a, extendParams: s, on: o }) {
    s({
      panoramaEffect: {
        depth: 550,
        rotate: 445,
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
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   // Simulate your content loading process here
  //   setTimeout(() => {
  //     setLoading(false);
  //   }, 1500); // Adjust the time based on your actual content loading time
  // }, []);

  return (
    <>
      {loading ? (
        <SplashScreen />
      ) : (
        <div className={styles.app}>
          {isDropModalOpen && m}
          {modalSampleUrl && (
            <SampleModal
              media={modalSampleUrl}
              onClose={() => setModalSampleUrl(null)}
            />
          )}
          <div
            className={styles.panorama_slider}
            onDrop={() => {
              handleDrop();
            }}
          >
            <div className={styles.swiper_wrapper}>
              <Swiper
                ref={swiperRef}
                modules={[b, Keyboard, Mousewheel]}
                keyboard={{
                  enabled: true,
                  onlyInViewport: false,
                }}
                mousewheel={{
                  enabled: true,
                }}
                effect="panorama"
                autoplay={true}
                centeredSlides={true}
                onUpdate={(swiper) => handleSlideChange(swiper)}
                loop={true}
                slidesPerView={3}
                style={{ height: "100%", padding: "50px 0px" }}
                initialSlide={0}
                panoramaeffect={{ depth: 350, rotate: 25 }}
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
                {images.map((media, index) => (
                  <SwiperSlide key={index} onClick={() => openModal(media)}>
                    <motion.div
                      className={styles.swiper_slide}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 1.6 }}
                    >
                      {media.link && media.thumbnail ? (
                        // If it's a YouTube link, render the thumbnail
                        <img
                          className={styles.slide_image}
                          src={media.thumbnail}
                          alt={`Slide ${index}`}
                          loading="lazy"
                        />
                      ) : media.url ? (
                        // For other media types, render the image
                        <img
                          className={styles.slide_image}
                          src={media.url}
                          alt={`Slide ${index}`}
                          loading="lazy"
                        />
                      ) : (
                        // For other media types, render the image
                        <img
                          className={styles.slide_image}
                          src={media}
                          alt={`Slide ${index}`}
                          loading="lazy"
                        />
                      )}
                    </motion.div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
          <Menu onDropMedia={handleDropMedia} setImages={setImages} />
        </div>
      )}
    </>
  );
}
