typeof window != "undefined" &&
  window.SwiperElementRegisterParams &&
  window.SwiperElementRegisterParams(["panoramaEffect"]);

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
          y = a.params.centeredSlides ? 0 : (a.params.slidesPerView - 1) * 0.5,
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
console.log(b);
