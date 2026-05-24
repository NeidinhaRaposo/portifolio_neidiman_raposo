const projectItems = document.querySelectorAll(".project-item");
const hoverPreview = document.querySelector(".hover-preview");
const hoverPreviewImage = document.getElementById("hoverPreviewImage");
const hoverPreviewButton = document.getElementById("hoverPreviewButton");

let currentX = 0;
let currentY = 0;
let targetX = 0;
let targetY = 0;
let animationFrameId = null;
let hoveringButton = false;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function animatePreview() {
  currentX += (targetX - currentX) * 0.14;
  currentY += (targetY - currentY) * 0.14;

  hoverPreview.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
  animationFrameId = requestAnimationFrame(animatePreview);
}

function startAnimation() {
  if (!animationFrameId) {
    animatePreview();
  }
}

function stopAnimation() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}

projectItems.forEach((item) => {
  const imagePath = item.dataset.image;
  const linkPath = item.dataset.link;

  item.addEventListener("mouseenter", (event) => {
    hoverPreviewImage.src = imagePath;
    hoverPreview.classList.add("is-visible");
    startAnimation();

    const previewWidth = hoverPreview.offsetWidth || 420;
    const previewHeight = hoverPreview.offsetHeight || 420;
    const maxX = window.innerWidth - previewWidth - 24;
    const maxY = window.innerHeight - previewHeight - 24;

    targetX = clamp(event.clientX + 90, 24, maxX);
    targetY = clamp(event.clientY - 140, 24, maxY);
  });

  item.addEventListener("mouseleave", () => {
    if (!hoveringButton) {
      hoverPreview.classList.remove("is-visible");
    }
  });

  item.addEventListener("mousemove", (event) => {
    if (hoveringButton) return;

    const previewWidth = hoverPreview.offsetWidth || 420;
    const previewHeight = hoverPreview.offsetHeight || 420;
    const maxX = window.innerWidth - previewWidth - 24;
    const maxY = window.innerHeight - previewHeight - 24;

    targetX = clamp(event.clientX + 90, 24, maxX);
    targetY = clamp(event.clientY - 140, 24, maxY);
  });

  item.addEventListener("click", () => {
    window.open(linkPath, "_blank");
  });
});

window.addEventListener("mouseleave", () => {
  hoverPreview.classList.remove("is-visible");
  hoveringButton = false;
});

window.addEventListener("blur", () => {
  hoverPreview.classList.remove("is-visible");
  hoveringButton = false;
});

window.addEventListener("beforeunload", () => {
  stopAnimation();
});