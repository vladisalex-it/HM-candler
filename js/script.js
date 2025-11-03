const menuButtonElement = document.querySelector('.menu__btn')
const menuListElement = document.querySelector('.header__menu-list')

const sliderElement = document.querySelector('#feedbackSlider')
const feedbackSlides = document.querySelectorAll('.feedback__slide')
const sliderControlsCollection = Array.from(document.querySelectorAll('[data-control]')) 
const feedbackSlideBtn = document.querySelector('.feedback__slide-button')

menuButtonElement.addEventListener('click', function () {
    menuListElement.classList.toggle('menu--open')
})

init()

function init() {
    closeAllSlides()
    const slideToShow = feedbackSlides[0]
    slideToShow.classList.remove('hidden')
}

sliderControlsCollection.forEach((contolEl) => {
    contolEl.addEventListener('click', function (event) {
        feedbackSlides[event.currentTarget.dataset.control].classList.remove('hidden')
        sliderControlsCollection.forEach((el) => el.classList.remove('brown'))
        contolEl.classList.add('brown')
        
        closeAllSlides()
        feedbackSlides[event.target.dataset.control].classList.remove('hidden')
    })
})

function closeAllSlides() {
    feedbackSlides.forEach(slide => {
        slide.classList.add('hidden')
    });
}

function switchSlide(event) {
        const targetSlide = event.target.closest('.feedback__slide')
        const idx = Array.from(feedbackSlides).indexOf(targetSlide)
        if (!targetSlide || idx === -1) return

        const nextIdx = (idx + 1) % feedbackSlides.length
        closeAllSlides()
        feedbackSlides[nextIdx].classList.remove('hidden')

        const nextControlBtn = sliderControlsCollection[nextIdx]
        sliderControlsCollection.forEach((el) => el.classList.remove('brown'))
        nextControlBtn.classList.add('brown')
}


sliderElement.addEventListener('click', (event) => switchSlide(event))
feedbackSlideBtn.addEventListener('click', (event) => event.stopPropagation())