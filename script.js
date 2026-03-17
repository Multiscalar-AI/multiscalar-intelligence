// Subtle dot grid background with gentle animation
(function () {
  const canvas = document.getElementById('grid-bg');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let dots = [];
  const SPACING = 40;
  let mouse = { x: -1000, y: -1000 };
  let animFrame;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    buildDots();
  }

  function buildDots() {
    dots = [];
    for (let x = SPACING; x < width; x += SPACING) {
      for (let y = SPACING; y < height; y += SPACING) {
        dots.push({ x, y, baseAlpha: 0.08 + Math.random() * 0.04 });
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (const dot of dots) {
      const dx = mouse.x - dot.x;
      const dy = mouse.y - dot.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const influence = Math.max(0, 1 - dist / 200);
      const alpha = dot.baseAlpha + influence * 0.25;
      const radius = 0.6 + influence * 1.2;

      ctx.beginPath();
      ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
      ctx.fill();
    }

    animFrame = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animFrame);
    resize();
    draw();
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  resize();
  draw();

  // Scroll-triggered animations
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.15 }
  );

  // Add .animate class and observe scroll targets
  document.querySelectorAll(
    '.section-grid, .research > .section-label, .research-card, .divider'
  ).forEach((el) => {
    el.classList.add('animate');
    observer.observe(el);
  });

  // Dividers just need observing (no .animate, they use their own transition)
  document.querySelectorAll('.divider').forEach((el) => {
    el.classList.remove('animate');
    observer.observe(el);
  });
})();
