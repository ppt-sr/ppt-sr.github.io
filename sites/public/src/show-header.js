let lastScrollTop = 0;
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > 80 && scrollTop > lastScrollTop) {
        // Scrolling down
        header.classList.add("header-hide")
    } else {
        // Scrolling up
        header.classList.remove("header-hide")
    }
    lastScrollTop = scrollTop;
});
