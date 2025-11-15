const menuButtonElement = document.querySelector('.menu__btn')
const menuListElement = document.querySelector('.header__menu-list')

const sliderElement = document.querySelector('#feedbackSlider')
const feedbackSlides = document.querySelectorAll('.feedback__slide')
const sliderControlsCollection = Array.from(document.querySelectorAll('[data-control]'))
const feedbackSlideBtn = document.querySelector('.feedback__slide-button')

menuButtonElement.addEventListener('click', function () {
    menuListElement.classList.toggle('menu--open')
})

let currentSlideIndex = 0

const AUTOPLAY_DELAY = 4000
let autoplayTimer = null

init()

function init() {
    showSlideAndControl(0)
    startAutoplay()
}

function showSlideAndControl(index) {
    closeAllSlides()
    feedbackSlides[index].classList.remove('hidden')

    sliderControlsCollection.forEach((control) => control.classList.remove('active'))
    sliderControlsCollection[index].classList.add('active')

    currentSlideIndex = index
}

sliderControlsCollection.forEach((contolEl) => {
    contolEl.addEventListener('click', function (event) {
        const idx = Number(event.target.dataset.control)
        if (Number.isNaN(idx)) return
        showSlideAndControl(idx)
        restartAutoplay()
    })
})

function closeAllSlides() {
    feedbackSlides.forEach(slide => {
        slide.classList.add('hidden')
    });
}

function switchSlide(event) {
    const targetSlide = event.target.closest('.feedback__slide')
    const isSlideButton = event.target.closest('.feedback__slide-button')
    if (isSlideButton) return
    const idx = Array.from(feedbackSlides).indexOf(targetSlide)
    if (!targetSlide || idx === -1 ) return

    const nextIdx = (idx + 1) % feedbackSlides.length
    showSlideAndControl(nextIdx)
    restartAutoplay()
}

function startAutoplay() {
    stopAutoplay()
    autoplayTimer = setInterval(() => {
        const nextIdx = (currentSlideIndex + 1) % feedbackSlides.length
        showSlideAndControl(nextIdx)
    }, AUTOPLAY_DELAY)
}
function stopAutoplay() {
    if (autoplayTimer) {
        clearInterval(autoplayTimer)
        autoplayTimer = null
    }
}
function restartAutoplay() {
    stopAutoplay()
    startAutoplay()
}

sliderElement.addEventListener('mouseenter', stopAutoplay)
sliderElement.addEventListener('mouseleave', startAutoplay)

sliderElement.addEventListener('click', (event) => switchSlide(event))
feedbackSlideBtn.addEventListener('click', (event) => event.stopPropagation())