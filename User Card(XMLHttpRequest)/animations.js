gsap.registerPlugin(ScrollTrigger);

/* ---------- Card Entry ---------- */
export function animateCards(cards) {
  gsap.fromTo(
    cards,
    { y: 30, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out",
    }
  );
}

/* ---------- Image Parallax ---------- */
export function imageParallax(card) {
  const img = card.querySelector("img");

  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;

    gsap.to(img, {
      x: x * 10,
      y: y * 10,
      duration: 0.4,
      ease: "power3.out",
    });
  });

  card.addEventListener("mouseleave", () => {
    gsap.to(img, { x: 0, y: 0, duration: 0.5 });
  });
}

/* ---------- Scroll-linked background ---------- */
gsap.to("body", {
  backgroundPosition: "50% 100%",
  scrollTrigger: {
    scrub: true,
  },
});

/* ---------- Magnetic Cursor ---------- */
const cursor = document.querySelector(".cursor");

window.addEventListener("mousemove", (e) => {
  gsap.to(cursor, {
    x: e.clientX  ,
    y: e.clientY,
    duration: 0.2,
    ease: "power3.out",
  });
});
