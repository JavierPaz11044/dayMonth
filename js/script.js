// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Add smooth scroll behavior
  document.documentElement.style.scrollBehavior = "smooth";

  // Get all story items
  const storyItems = document.querySelectorAll(".story-item");

  // Function to check if element is in viewport
  const isInViewport = (element) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <=
        (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
      rect.bottom >= 0
    );
  };

  // Function to handle scroll animations
  const handleScroll = () => {
    storyItems.forEach((item) => {
      if (isInViewport(item)) {
        item.classList.add("visible");
      }
    });
  };

  // Initial check for elements in viewport
  handleScroll();

  // Add scroll event listener
  window.addEventListener("scroll", handleScroll);

  // Add click event to story items
  storyItems.forEach((item) => {
    item.addEventListener("click", () => {
      // Add a temporary class for the click effect
      item.classList.add("story-clicked");

      // Remove the class after animation
      setTimeout(() => {
        item.classList.remove("story-clicked");
      }, 300);
    });
  });

  // Add parallax effect on mouse move
  document.addEventListener("mousemove", (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    storyItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const itemX = (rect.left + rect.width / 2) / window.innerWidth;
      const itemY = (rect.top + rect.height / 2) / window.innerHeight;

      const deltaX = (mouseX - itemX) * 10;
      const deltaY = (mouseY - itemY) * 10;

      item.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    });
  });

  // Reset transform on mouse leave
  document.addEventListener("mouseleave", () => {
    storyItems.forEach((item) => {
      item.style.transform = "translate(0, 0)";
    });
  });

  const slider = document.querySelector(".story-slider");
  const slides = document.querySelectorAll(".story-slide");
  const prevBtn = document.querySelector(".nav-btn.prev");
  const nextBtn = document.querySelector(".nav-btn.next");
  const progressBar = document.querySelector(".progress");
  const currentSlideSpan = document.querySelector(".current-slide");
  const totalSlidesSpan = document.querySelector(".total-slides");

  // Create clock hand
  const clockHand = document.createElement("div");
  clockHand.className = "clock-hand";
  progressBar.appendChild(clockHand);

  let currentIndex = 0;
  const totalSlides = slides.length;
  const slideDuration = 8000; // 8 seconds per slide
  let startTime;
  let animationFrame;
  let isTransitioning = false;

  // Set total slides count
  totalSlidesSpan.textContent = totalSlides;

  // Function to update slide counter
  const updateSlideCounter = (index) => {
    currentSlideSpan.textContent = index + 1;
  };

  // Function to update clock hand
  const updateClockHand = (progress) => {
    const rotation = progress * 360;
    clockHand.style.transform = `translateX(-50%) rotate(${rotation}deg) translateZ(10px)`;
  };

  // Function to update progress bar
  const updateProgress = (progress) => {
    progressBar.style.width = `${progress * 100}%`;
    updateClockHand(progress);
  };

  // Function to animate progress
  const animateProgress = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / slideDuration, 1);

    updateProgress(progress);

    if (progress < 1) {
      animationFrame = requestAnimationFrame(animateProgress);
    } else {
      if (currentIndex < totalSlides - 1) {
        nextSlide();
      } else {
        restartSlideshow();
      }
    }
  };

  // Function to restart slideshow
  const restartSlideshow = () => {
    slider.classList.add("restarting");
    setTimeout(() => {
      currentIndex = 0;
      showSlide(currentIndex);
      slider.classList.remove("restarting");
    }, 1000);
  };

  // Function to add 3D tilt effect
  const handleTilt = (e) => {
    if (isTransitioning) return;

    const rect = slider.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    slider.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  // Function to reset tilt
  const resetTilt = () => {
    slider.style.transform = "rotateX(5deg) rotateY(0deg)";
  };

  // Add tilt effect
  slider.addEventListener("mousemove", handleTilt);
  slider.addEventListener("mouseleave", resetTilt);

  // Function to show slide with 3D effect
  const showSlide = (index) => {
    isTransitioning = true;

    // Remove active class from all slides
    slides.forEach((slide) => {
      slide.classList.remove("active", "prev");
    });

    // Add active class to current slide
    slides[index].classList.add("active");

    // Add prev class to previous slide if it exists
    if (index > 0) {
      slides[index - 1].classList.add("prev");
    }

    // Update navigation buttons
    prevBtn.style.opacity = index === 0 ? "0.3" : "0.7";
    nextBtn.style.opacity = index === totalSlides - 1 ? "0.3" : "0.7";

    // Update slide counter
    updateSlideCounter(index);

    // Reset and start progress animation
    startTime = null;
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
    animationFrame = requestAnimationFrame(animateProgress);

    // Add 3D transition effect
    const activeSlide = slides[index];
    activeSlide.style.transform = "translateX(0) translateZ(0) rotateY(0)";

    // Reset transition flag after animation
    setTimeout(() => {
      isTransitioning = false;
    }, 800);
  };

  // Function to go to next slide
  const nextSlide = () => {
    if (currentIndex < totalSlides - 1 && !isTransitioning) {
      currentIndex++;
      showSlide(currentIndex);
    }
  };

  // Function to go to previous slide
  const prevSlide = () => {
    if (currentIndex > 0 && !isTransitioning) {
      currentIndex--;
      showSlide(currentIndex);
    }
  };

  // Show first slide
  showSlide(currentIndex);

  // Add click event to navigation buttons
  prevBtn.addEventListener("click", () => {
    prevSlide();
  });

  nextBtn.addEventListener("click", () => {
    nextSlide();
  });

  // Add keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      prevSlide();
    } else if (e.key === "ArrowRight") {
      nextSlide();
    }
  });

  // Add touch swipe support with 3D effect
  let touchStartX = 0;
  let touchEndX = 0;
  let touchStartY = 0;
  let touchEndY = 0;

  slider.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
  });

  slider.addEventListener("touchmove", (e) => {
    if (isTransitioning) return;

    const touch = e.touches[0];
    const rect = slider.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    slider.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  slider.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
    resetTilt();
    animationFrame = requestAnimationFrame(animateProgress);
  });

  const handleSwipe = () => {
    const swipeThreshold = 50;
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > swipeThreshold) {
      if (diffX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  };

  // Pause animation on hover
  slider.addEventListener("mouseenter", () => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
  });

  slider.addEventListener("mouseleave", () => {
    resetTilt();
    animationFrame = requestAnimationFrame(animateProgress);
  });
});
