const allTabs = document.querySelectorAll('.product-description-tabs-section .tab');
const allTabContent = document.querySelectorAll('.product-description-tabs-section .tab-content-wrapper > *');

const switchActiveElement = (elementGroup, i) => {
  elementGroup.forEach((element) => {
    element.classList.remove('active');
    elementGroup[i].classList.add('active');
  })
}

const switchTab = (i) => {
  switchActiveElement(allTabs, i);
  switchActiveElement(allTabContent, i);
}

allTabs.forEach((tab, i) => {
  tab.addEventListener('click', () => {
    switchTab(i)
  })
})