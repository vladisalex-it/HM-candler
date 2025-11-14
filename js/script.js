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

init()

function init() {
    showSlideAndControl(0)
}

function showSlideAndControl(index) {
    closeAllSlides()
    feedbackSlides[index].classList.remove('hidden')

    sliderControlsCollection.forEach((control) => control.classList.remove('active'))
    sliderControlsCollection[index].classList.add('active')

    currentSlideIndex = index + 1 % feedbackSlides.length
} 


sliderControlsCollection.forEach((contolEl) => {
    contolEl.addEventListener('click', function (event) {
        showSlideAndControl(event.target.dataset.control)
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
        showSlideAndControl(nextIdx)
}


sliderElement.addEventListener('click', (event) => switchSlide(event))
feedbackSlideBtn.addEventListener('click', (event) => event.stopPropagation())