const accordeon = document.querySelector('.accordeon')
const accordeonTitleButtonElements = document.querySelectorAll('.accordeon-title')

accordeonTitleButtonElements.forEach.call(accordeonTitleButtonElements, function(accordeonTitle) {
    accordeonTitle.addEventListener('click', () => {
        const currentText = accordeonTitle.parentElement.querySelector('.accordeon-content')
        
        accordeonTitle.classList.toggle('accordeon-title--active')
        currentText.classList.toggle('accordeon-content--visible')
        
        if (currentText.classList.contains('accordeon-content--visible')) {
            currentText.style.maxHeight = currentText.scrollHeight + 'px'
            accordeonTitle.classList.add('accordeon-title--no-padding-bottom')
        } else {
            currentText.style.maxHeight = null
            accordeonTitle.classList.remove('accordeon-title--no-padding-bottom')
        }
    })
});