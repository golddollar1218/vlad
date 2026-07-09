// ===== NAVBAR SCROLL =====
const navbar = document.getElementById("navbar");
const navToggle = document.getElementById("navToggle");
const navLinks = document.querySelector(".nav-links");
const navAnchors = navLinks.querySelectorAll("a[data-section]");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 40);
  updateActiveNav();
});

navToggle.addEventListener("click", () => {
  navToggle.classList.toggle("active");
  navLinks.classList.toggle("open");
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navToggle.classList.remove("active");
    navLinks.classList.remove("open");
  });
});

function updateActiveNav() {
  const sections = ["about", "tokenomics", "community", "chart"];
  const navHeight = navbar.offsetHeight + 40;
  let current = "";

  sections.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top;
    if (top <= navHeight) current = id;
  });

  navAnchors.forEach((a) => {
    a.classList.toggle("active", a.dataset.section === current);
  });
}

// ===== SCROLL REVEAL =====
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = (entry.target.dataset.delay || 0) * 120;
        setTimeout(() => {
          entry.target.classList.add("visible");
        }, delay);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
);

revealElements.forEach((el) => revealObserver.observe(el));

// ===== SMOOTH ANCHOR OFFSET =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const targetId = anchor.getAttribute("href");
    if (targetId === "#") return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    const navHeight = navbar.offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
    window.scrollTo({ top, behavior: "smooth" });
  });
});

// ===== COPY CONTRACT ADDRESS =====
const copyBtn = document.getElementById("copyBtn");
const caInput = document.getElementById("caInput");
const copyText = document.getElementById("copyText");

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(caInput.value);
    copyBtn.classList.add("copied");
    copyText.textContent = "Copied!";

    setTimeout(() => {
      copyBtn.classList.remove("copied");
      copyText.textContent = "Copy";
    }, 2000);
  } catch {
    copyText.textContent = "Failed";
    setTimeout(() => {
      copyText.textContent = "Copy";
    }, 2000);
  }
});

// ===== PARALLAX =====
const parallaxEls = document.querySelectorAll("[data-parallax]");

function handleParallax() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const scrollY = window.scrollY;
  parallaxEls.forEach((el) => {
    const speed = parseFloat(el.dataset.parallax);
    el.style.transform = `translateY(${scrollY * speed}px)`;
  });
}

window.addEventListener("scroll", handleParallax, { passive: true });

// ===== FLOATING LEAVES =====
(function initLeaves() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const canvas = document.getElementById("leafCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let leaves = [];
  let animId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createLeaf() {
    return {
      x: Math.random() * canvas.width,
      y: -20,
      size: Math.random() * 6 + 3,
      speedY: Math.random() * 0.6 + 0.3,
      speedX: Math.random() * 0.4 - 0.2,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: Math.random() * 0.02 - 0.01,
      opacity: Math.random() * 0.3 + 0.1,
      hue: Math.random() > 0.3 ? 120 : 45,
    };
  }

  function init() {
    resize();
    leaves = Array.from({ length: Math.min(25, Math.floor(canvas.width / 60)) }, createLeaf);
  }

  function drawLeaf(leaf) {
    ctx.save();
    ctx.translate(leaf.x, leaf.y);
    ctx.rotate(leaf.rotation);
    ctx.globalAlpha = leaf.opacity;
    ctx.fillStyle = `hsl(${leaf.hue}, 50%, ${leaf.hue === 120 ? "35%" : "50%"})`;
    ctx.beginPath();
    ctx.ellipse(0, 0, leaf.size, leaf.size * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    leaves.forEach((leaf) => {
      leaf.y += leaf.speedY;
      leaf.x += leaf.speedX + Math.sin(leaf.y * 0.01) * 0.3;
      leaf.rotation += leaf.rotSpeed;

      if (leaf.y > canvas.height + 20) {
        Object.assign(leaf, createLeaf());
        leaf.y = -20;
      }

      drawLeaf(leaf);
    });

    animId = requestAnimationFrame(animate);
  }

  init();
  animate();

  window.addEventListener("resize", () => {
    cancelAnimationFrame(animId);
    init();
    animate();
  });
})();

// ===== PAGE LOAD =====
window.addEventListener("load", () => {
  document.body.style.opacity = "0";
  requestAnimationFrame(() => {
    document.body.style.transition = "opacity 0.8s ease";
    document.body.style.opacity = "1";
  });

  updateActiveNav();
});
