// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Add smooth scroll behavior
  document.documentElement.style.scrollBehavior = "smooth";

  // Add click event to photos for a nice effect
  const photoItems = document.querySelectorAll(".photo-item");

  photoItems.forEach((item) => {
    item.addEventListener("click", () => {
      // Add a temporary class for the click effect
      item.classList.add("photo-clicked");

      // Remove the class after animation
      setTimeout(() => {
        item.classList.remove("photo-clicked");
      }, 300);
    });
  });

  // Add parallax effect on mouse move
  document.addEventListener("mousemove", (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    photoItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const itemX = (rect.left + rect.width / 2) / window.innerWidth;
      const itemY = (rect.top + rect.height / 2) / window.innerHeight;

      const deltaX = (mouseX - itemX) * 20;
      const deltaY = (mouseY - itemY) * 20;

      item.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    });
  });

  // Reset transform on mouse leave
  document.addEventListener("mouseleave", () => {
    photoItems.forEach((item) => {
      item.style.transform = "translate(0, 0)";
    });
  });
});
