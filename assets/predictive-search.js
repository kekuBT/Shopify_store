class PredictiveSearch extends HTMLElement {
  constructor() {
    super();

    this.input = this.querySelector('input[type="search"]');
    this.predictiveSearchResults = this.querySelector('#predictive-search');

    this.input.addEventListener('input', this.debounce((event) => {
      this.onChange(event);
    }, 300).bind(this));

    var keyupBind = this.onKeyup.bind(this);
    var keydownBind = this.onKeydown.bind(this);
    this.addEventListener('keyup', keyupBind);
    this.addEventListener('keydown', keydownBind);
  }

  onChange() {
    const searchTerm = this.input.value.trim();

    if (!searchTerm.length) {
      this.close();
      return;
    }

    this.getSearchResults(searchTerm);
  }

  getSearchResults(searchTerm) {
    fetch(`${window.routes.predictive_search_url}?q=${searchTerm}&resources[type]=article,product,collection,page,query&resources[limit]=4&resources[limit_scope]=each&section_id=predictive-search`)
      .then((response) => {
        if (!response.ok) {
          var error = new Error(response.status);
          this.close();
          throw error;
        }

        return response.text();
      })
      .then((text) => {
        const resultsMarkup = new DOMParser().parseFromString(text, 'text/html').querySelector('#shopify-section-predictive-search').innerHTML;
        this.predictiveSearchResults.innerHTML = resultsMarkup;
        this.open();
      })
      .catch((error) => {
        this.close();
        throw error;
      });
  }

  open() {
    // this.predictiveSearchResults.style.maxHeight = this.resultsMaxHeight || `${this.getResultsMaxHeight()}px`;
    this.predictiveSearchResults.style.display = 'block';
  }

  close() {
    this.resultsMaxHeight = false;
    this.predictiveSearchResults.style.display = 'none';
  }

  debounce(fn, wait) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  onKeyup(event) {
    console.log('onKeyup!'); 
    event.preventDefault();

    switch (event.code) {
      case 'ArrowUp':
        console.log('ArrowUp');
        this.switchOption('up')
        break;
      case 'ArrowDown':
        console.log('ArrowDown');
        this.switchOption('down');
        break;
      case 'Enter':
        console.log('Enter');
        console.log('Enter');
        console.log('Enter');
        console.log('Enter');
        console.log('Enter');
        this.selectOption();
        break;
      case 'Escape':
        console.log('remove event listeners');
        var keyupBind = this.onKeyup.bind(this);
        var keydownBind = this.onKeydown.bind(this);
        this.removeEventListener('keyup', keyupBind);
        this.removeEventListener('keydown', keydownBind);
        break;
    }
  }

  getResultsMaxHeight() {
    this.resultsMaxHeight = window.innerHeight - document.querySelector('.section-header').getBoundingClientRect().bottom;
    return this.resultsMaxHeight;
  }

  onKeydown(event) {
    console.log('onKeydown!');
    // Prevent the cursor from moving in the input when using the up and down arrow keys
    if (
      event.code === 'ArrowUp' ||
      event.code === 'ArrowDown'
    ) {
      event.preventDefault();
    }
  }

  switchOption(direction) {
    const moveUp = direction === 'up';
    const selectedElement = this.querySelector('[aria-selected="true"]');
    const allElements = this.querySelectorAll('li');
    let activeElement = this.querySelector('li');

    if (moveUp && !selectedElement) return;

    if (!moveUp && selectedElement) {
      activeElement = selectedElement.nextElementSibling || allElements[0];
    } else if (moveUp) {
      activeElement = selectedElement.previousElementSibling || allElements[allElements.length - 1];
    }

    if (activeElement === selectedElement) return;

    activeElement.setAttribute('aria-selected', true);
    if (selectedElement) selectedElement.setAttribute('aria-selected', false);

    this.input.setAttribute('aria-activedescendant', activeElement.id);
  }

  selectOption() {
    const selectedProduct = this.querySelector('[aria-selected="true"] a, [aria-selected="true"] button');

    if (selectedProduct) selectedProduct.click();
  }
}

customElements.define('predictive-search', PredictiveSearch);



/* OPEN CLOSE SEARCH */
function searchFadeIn(elem) {
  elem.style.display = 'block';
  elem.style.opacity = 0;
  setTimeout(function() {
    elem.style.opacity = 1;
  },100);
}

function searchFadeOut(elem) {
  elem.style.opacity = '0';
  setTimeout(function() {
    elem.style.display = 'none';
  },400);
}

var searchBoxes = document.querySelectorAll(".header__icon--search");
var elemPredictiveSearchWrapper = document.querySelector('.predictive-search-wrapper');
searchBoxes.forEach(function(searchBox) {
searchBox.addEventListener('click', function(e) {
    e.preventDefault(); 
    elemPredictiveSearchWrapper.classList.toggle('active_search-bar');

    if (elemPredictiveSearchWrapper.style.opacity == 0) {
      searchFadeIn(elemPredictiveSearchWrapper);
    } else {
      searchFadeOut(elemPredictiveSearchWrapper);
    }

    if(!elemPredictiveSearchWrapper.classList.contains('active_search-bar')){
      setTimeout(function(){
        if(document.querySelectorAll('.hero-slider.flickity-enabled').length > 0){
          document.querySelector('.hero-slider.flickity-enabled').classList.remove('z_index0');
        }
      },400)
    } else {
      let searchBar = document.querySelector('.predictive-search-wrapper.active_search-bar');
      let searchBarInput = document.getElementById('Search');

      trapFocus(searchBar,searchBarInput);

      searchBarInput.addEventListener('keyup',function(event) {
        if (event.code == 'Escape') {
          closeSearchModal();
        }
      });
      if(document.querySelectorAll('.hero-slider.flickity-enabled').length > 0){
        document.querySelector('.hero-slider.flickity-enabled').classList.add('z_index0');
      }
    }
  });
});

document.querySelector('.cross-search').addEventListener('click', closeSearchModal);

function closeSearchModal() {
  if(elemPredictiveSearchWrapper.classList.contains('active_search-bar')){
  elemPredictiveSearchWrapper.classList.remove("active_search-bar");
  searchFadeOut(elemPredictiveSearchWrapper);

  removeTrapFocus(document.querySelector('.header__icon--search'));
  setTimeout(function(){
    if(document.querySelectorAll('.hero-slider.flickity-enabled').length > 0){
      document.querySelector('.hero-slider.flickity-enabled').classList.remove('z_index0');
    }
  },400);
  }
    
}

// submit the form on click of the search icon
document.querySelector('predictive-search .search-icon').addEventListener('click', () => {
  document.querySelector('predictive-search form').submit();
})

// close search when clicked outside of the search box
document.addEventListener('click', function(event) {
  if (!event.target.closest('header') && !event.target.closest('predictive-search')) {
    closeSearchModal();
  }
})


