const creditsContainer = document.querySelector('.credits');

document.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const scrollBottom = scrollTop + window.innerHeight;
    const creditsOffset = creditsContainer.offsetTop;

    if (scrollBottom > creditsOffset) {
        creditsContainer.classList.add('show');
    } else {
        creditsContainer.classList.remove('show');
    }
});
