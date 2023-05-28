const allAccordionHeaders = document.querySelectorAll('.accordion__header');

const toggleAccordion = (e) => {
  const accordion = e.target.closest('.accordion')

  accordion.classList.toggle('active')
}

allAccordionHeaders.forEach(header => {
  header.addEventListener('click', (e) => {
    toggleAccordion(e)
  })
});