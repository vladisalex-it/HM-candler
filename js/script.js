const menuButtonElement = document.querySelector('.menu__btn')
const menuListElement = document.querySelector('.header__menu-list')

menuButtonElement.addEventListener('click', function() {
    menuListElement.classList.toggle('menu--open')
})


