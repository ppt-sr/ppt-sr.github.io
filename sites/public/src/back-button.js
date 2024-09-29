// Get the button
let backToTopButton = document.getElementById("backToTop");

// Show the button when the user scrolls down 300px from the top of the document
window.onscroll = function() {
  scrollFunction();
};

function scrollFunction() {
  if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
    // Add the 'show' class to trigger the sliding in effect
    backToTopButton.classList.add("show");
  } else {
    // Remove the 'show' class to trigger the sliding out effect
    backToTopButton.classList.remove("show");
  }
}

// Easing function (ease-out for smooth deceleration)
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

// Smooth scroll to the top with dynamic duration and easing
function scrollToTop() {
  const start = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const scrollDistance = start; // Current distance from the top

  // Dynamically set the duration: longer for greater scroll distances
  const baseDuration = 300; // Minimum duration (in ms) for very short scrolls
  const maxDuration = 1000; // Maximum duration (in ms) for very long scrolls
  const duration = Math.min(Math.max((scrollDistance / maxScroll) * maxDuration, baseDuration), maxDuration);

  const startTime = performance.now();

  function scrollStep(timestamp) {
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1); // Ensure it doesn't go past 1

    const easedProgress = easeOutCubic(progress); // Apply easing function

    window.scrollTo(0, start * (1 - easedProgress)); // Scroll proportionally with easing

    if (progress < 1) {
      window.requestAnimationFrame(scrollStep);
    }
  }

  window.requestAnimationFrame(scrollStep);
}

// Add click event listener to the button
backToTopButton.addEventListener("click", function() {
  scrollToTop(); // Dynamically calculate the duration based on scroll distance
});
