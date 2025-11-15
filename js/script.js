const accordeonTitleButtonElements = document.querySelectorAll('.accordeon-title')
const accordeonContentElements = document.querySelector('.accordeon-content')

accordeonTitleButtonElements.forEach(accordeonBtn => {
    accordeonBtn.addEventListener('click', () => {
        accordeonBtn.nextElementSibling.classList.toggle('hidden')
    })
});