class CollectionFiltersForm extends HTMLElement {
  constructor() {
    super();
    this.filterData = [];
    this.onActiveFilterClick = this.onActiveFilterClick.bind(this);

    this.debouncedOnSubmit = debounce((event) => {
      this.onSubmitHandler(event);
    }, 500);

    this.querySelector('form').addEventListener('input', this.debouncedOnSubmit.bind(this));
    window.addEventListener('popstate', this.onHistoryChange.bind(this));

    this.bindActiveFacetButtonEvents();
  }

  onSubmitHandler(event) {
    event.preventDefault();
    if(window.infiniteScrollObserver && window.elemPaginationNextBtn){
      window.infiniteScrollObserver.unobserve(window.elemPaginationNextBtn);
    }
    // Get all form datas
    var searchParams = '';
    if (document.querySelector('collection-filters-form[data-filter="filter"]')) {
      const form = document.querySelector('collection-filters-form[data-filter="filter"] form');
      const formData = new FormData(form);
      searchParams = new URLSearchParams(formData).toString();
    }
    if (document.querySelector('collection-filters-form[data-filter="sort"]')) {
      const form = document.querySelector('collection-filters-form[data-filter="sort"] form');
      const formData = new FormData(form);
      searchParams = searchParams + "&" + new URLSearchParams(formData).toString();
    }

    this.renderPage(searchParams, event);
  }

  onActiveFilterClick(event) {
    event.preventDefault();
    this.toggleActiveFacets();
    if (event.target.href) {
      var href = event.target.href;
    }else{
      var href = event.target.closest('a').href;
    }
    this.renderPage(new URL(href).searchParams.toString());
  }

  onHistoryChange(event) {
    const searchParams = event.state?.searchParams || '';

    // used as a workarond to fix multiple page re-render on back button
    // the popstate var can be found in theme.liquid
    if(!popstate){
      this.renderPage(searchParams, null, false);
      popstate = true;
    }
  }

  toggleActiveFacets(disable = true) {
    document.querySelectorAll('.js-facet-remove').forEach((element) => {
      element.classList.toggle('disabled', disable);
    });
  }

  renderPage(searchParams, event, updateURLHash = true) {
    const sections = this.getSections();
    document.getElementById('CollectionProductGrid').querySelector('.collection').classList.add('loading');

    sections.forEach((section) => {
      const url = `${window.location.pathname}?section_id=${section.section}&${searchParams}`;
      const filterDataUrl = element => element.url === url;

      this.filterData.some(filterDataUrl) ?
        this.renderSectionFromCache(filterDataUrl, section, event) :
        this.renderSectionFromFetch(url, section, event);
    });

    if (updateURLHash) this.updateURLHash(searchParams);
  }

  renderSectionFromFetch(url, section, event) {
    fetch(url)
      .then(response => response.text())
      .then((responseText) => {
        const html = responseText;
        this.filterData = [...this.filterData, { html, url }];
        this.renderFilters(html, event);
        this.renderProductGrid(html);
      
      });
  }

  renderSectionFromCache(filterDataUrl, section, event) {
    const html = this.filterData.find(filterDataUrl).html;
    this.renderFilters(html, event);
    this.renderProductGrid(html);
  }

  renderProductGrid(html) {
    const innerHTML = new DOMParser()
      .parseFromString(html, 'text/html')
      .getElementById('CollectionProductGrid').innerHTML;

    document.getElementById('CollectionProductGrid').innerHTML = innerHTML;
    animateElements();
    if(window.infiniteScrollObserver && document.querySelector('.pagination_next')){
    window.scrollLoad = true;
    window.infiniteScrollObserver.observe(document.querySelector('.pagination_next'));      
    }
  }

  renderFilters(html, event) {
    const parsedHTML = new DOMParser().parseFromString(html, 'text/html');

    const facetDetailsElements =
      parsedHTML.querySelectorAll('#CollectionFiltersForm .js-filter, #CollectionFiltersFormMobile .js-filter');
    const matchesIndex = (element) => element.dataset.index === event?.target.closest('.js-filter')?.dataset.index
    const facetsToRender = Array.from(facetDetailsElements).filter(element => !matchesIndex(element));
    const countsToRender = Array.from(facetDetailsElements).find(matchesIndex);

    facetsToRender.forEach((element) => {
      document.querySelector(`.js-filter[data-index="${element.dataset.index}"]`).innerHTML = element.innerHTML;
    });

    this.renderActiveFacets(parsedHTML);
    // this.renderMobileElements(parsedHTML);

    if (countsToRender) this.renderCounts(countsToRender, event.target.closest('.js-filter'));
  }

  renderActiveFacets(html) {
    const activeFacetElementSelectors = ['.active-facets-mobile', '.active-facets-desktop'];

    activeFacetElementSelectors.forEach((selector) => {
      const activeFacetsElement = html.querySelector(selector);
      if (!activeFacetsElement) return;
      document.querySelector(selector).innerHTML = activeFacetsElement.innerHTML;
    })

    this.bindActiveFacetButtonEvents();
    this.toggleActiveFacets(false);
  }

  renderMobileElements(html) {
    const mobileElementSelectors = ['.mobile-facets__open', '.mobile-facets__count'];

    mobileElementSelectors.forEach((selector) => {
      document.querySelector(selector).innerHTML = html.querySelector(selector).innerHTML;
    });

    document.getElementById('CollectionFiltersFormMobile').closest('menu-drawer').bindEvents();
  }

  renderCounts(source, target) {
    const countElementSelectors = ['.count-bubble','.facets__selected'];
    countElementSelectors.forEach((selector) => {
      const targetElement = target.querySelector(selector);
      const sourceElement = source.querySelector(selector);

      if (sourceElement && targetElement) {
        target.querySelector(selector).outerHTML = source.querySelector(selector).outerHTML;
      }
    });
  }

  bindActiveFacetButtonEvents() {
    document.querySelectorAll('.js-facet-remove').forEach((element) => {
      element.addEventListener('click', this.onActiveFilterClick, { once: true });
    });
  }

  updateURLHash(searchParams) {
    history.pushState({ searchParams }, '', `${window.location.pathname}${searchParams && '?'.concat(searchParams)}`);
  }

  getSections() {
    return [
      {
        id: 'CollectionProductGrid',
        section: document.getElementById('CollectionProductGrid').dataset.id,
      }
    ]
  }
}

customElements.define('collection-filters-form', CollectionFiltersForm);

class PriceRange extends HTMLElement {
constructor() {
  super();
  this.querySelectorAll('input')
    .forEach(element => element.addEventListener('change', this.onRangeChange.bind(this)));

  this.setMinAndMaxValues();
}

onRangeChange(event) {
  this.adjustToValidValues(event.currentTarget);
  this.setMinAndMaxValues();
}

setMinAndMaxValues() {
  const inputs = this.querySelectorAll('input');
  const minInput = inputs[0];
  const maxInput = inputs[1];
  if (maxInput.value) minInput.setAttribute('max', maxInput.value);
  if (minInput.value) maxInput.setAttribute('min', minInput.value);
  if (minInput.value === '') maxInput.setAttribute('min', 0);
  if (maxInput.value === '') minInput.setAttribute('max', maxInput.getAttribute('max'));
}

adjustToValidValues(input) {
  const value = Number(input.value);
  const min = Number(input.getAttribute('min'));
  const max = Number(input.getAttribute('max'));

  if (value < min) input.value = min;
  if (value > max) input.value = max;
}
}

customElements.define('price-range', PriceRange);



class FacetRemove extends HTMLElement {
constructor() {
  super();
  this.querySelector('a').addEventListener('click', (event) => {
    event.preventDefault();
    const form = this.closest('collection-filters-form') || document.querySelector('collection-filters-form');
    form.onActiveFilterClick(event);
  });
}
}

customElements.define('facet-remove', FacetRemove);




class CollectionTabs extends HTMLElement {
  constructor() {
    super();
    this.filterData = [];
    this.onActiveFilterClick = this.onActiveFilterClick.bind(this);

    this.debouncedOnSubmit = debounce((event) => {
      this.onSubmitHandler(event);
    }, 500);

    this.querySelectorAll('.collection-tabs .collection-tab').forEach(tab=>{
      tab.addEventListener('click', this.debouncedOnSubmit.bind(this));
    })
    window.addEventListener('popstate', this.onHistoryChange.bind(this));

    this.bindActiveFacetButtonEvents();
  }

  onSubmitHandler(event) {
    event.preventDefault();
    if(window.infiniteScrollObserver && window.elemPaginationNextBtn){
      window.infiniteScrollObserver.unobserve(window.elemPaginationNextBtn);
    }
    const formData = new FormData(document.querySelector('collection-filters-form form'));
    const searchParams = new URLSearchParams(formData).toString();
    if (event.target.dataset.href) {
      var href = event.target.dataset.href;
    }else{
      var href = event.target.closest('a').dataset.href;
    }
    this.renderPage(searchParams,href, event);
  }

  onActiveFilterClick(event) {
    event.preventDefault();
    this.toggleActiveFacets();
    if (event.target.href) {
      var href = event.target.href;
    }else{
      var href = event.target.closest('a').href;
    }
    this.renderPage(new URL(href).searchParams.toString());
  }

  onHistoryChange(event) {
    const searchParams = event.state?.searchParams || '';
    this.renderPage(searchParams, null, false);
  }

  toggleActiveFacets(disable = true) {
    document.querySelectorAll('.js-facet-remove').forEach((element) => {
      element.classList.toggle('disabled', disable);
    });
  }

  renderPage(searchParams, href, event, updateURLHash = true) {
    const sections = this.getSections();
    document.getElementById('CollectionProductGrid').querySelector('.collection').classList.add('loading');

    sections.forEach((section) => {
      const url = `${href}?section_id=${section.section}&${searchParams}`;
      const filterDataUrl = element => element.url === url;

      this.filterData.some(filterDataUrl) ?
        this.renderSectionFromCache(filterDataUrl, section, event) :
        this.renderSectionFromFetch(url, section, event);
    });

    if (updateURLHash) this.updateURLHash(searchParams,href);
  }

  renderSectionFromFetch(url, section, event) {
    fetch(url)
      .then(response => response.text())
      .then((responseText) => {
        const html = responseText;
        this.filterData = [...this.filterData, { html, url }];
        this.renderFilters(html, event);
        this.renderProductGrid(html);
      
      });
  }

  renderSectionFromCache(filterDataUrl, section, event) {
    const html = this.filterData.find(filterDataUrl).html;
    this.renderFilters(html, event);
    this.renderProductGrid(html);
  }

  renderProductGrid(html) {
    const innerHTML = new DOMParser()
      .parseFromString(html, 'text/html')
      .getElementById('CollectionProductGrid').innerHTML;

    document.getElementById('CollectionProductGrid').innerHTML = innerHTML;
    animateElements();
    if(window.infiniteScrollObserver && document.querySelector('.pagination_next')){
      window.scrollLoad = true;
      window.infiniteScrollObserver.observe(document.querySelector('.pagination_next'));      
    }
  }

  renderFilters(html, event) {
    const parsedHTML = new DOMParser().parseFromString(html, 'text/html');

    const facetDetailsElements =
      parsedHTML.querySelectorAll('#CollectionFiltersForm .js-filter, #CollectionFiltersFormMobile .js-filter');
    const matchesIndex = (element) => element.dataset.index === event?.target.closest('.js-filter')?.dataset.index
    const facetsToRender = Array.from(facetDetailsElements).filter(element => !matchesIndex(element));
    const countsToRender = Array.from(facetDetailsElements).find(matchesIndex);

    facetsToRender.forEach((element) => {
      document.querySelector(`.js-filter[data-index="${element.dataset.index}"]`).innerHTML = element.innerHTML;
    });

    this.renderActiveFacets(parsedHTML);
    // this.renderMobileElements(parsedHTML);

    if (countsToRender) this.renderCounts(countsToRender, event.target.closest('.js-filter'));
  }

  renderActiveFacets(html) {
    const activeFacetElementSelectors = ['.active-facets-mobile', '.active-facets-desktop'];

    activeFacetElementSelectors.forEach((selector) => {
      const activeFacetsElement = html.querySelector(selector);
      if (!activeFacetsElement) return;
      document.querySelector(selector).innerHTML = activeFacetsElement.innerHTML;
    })

    this.bindActiveFacetButtonEvents();
    this.toggleActiveFacets(false);
  }

  renderMobileElements(html) {
    const mobileElementSelectors = ['.mobile-facets__open', '.mobile-facets__count'];

    mobileElementSelectors.forEach((selector) => {
      document.querySelector(selector).innerHTML = html.querySelector(selector).innerHTML;
    });

    document.getElementById('CollectionFiltersFormMobile').closest('menu-drawer').bindEvents();
  }

  renderCounts(source, target) {
    const countElementSelectors = ['.count-bubble','.facets__selected'];
    countElementSelectors.forEach((selector) => {
      const targetElement = target.querySelector(selector);
      const sourceElement = source.querySelector(selector);

      if (sourceElement && targetElement) {
        target.querySelector(selector).outerHTML = source.querySelector(selector).outerHTML;
      }
    });
  }

  bindActiveFacetButtonEvents() {
    document.querySelectorAll('.js-facet-remove').forEach((element) => {
      element.addEventListener('click', this.onActiveFilterClick, { once: true });
    });
  }

  updateURLHash(searchParams,href) {
    // history.replaceState({ searchParams }, '', `${href}${searchParams && '?'.concat(searchParams)}`);
    history.pushState({ searchParams }, '', `${href}${searchParams && '?'.concat(searchParams)}`);
    // Need to change the url and update the changes to submission files
    // history.pushState({ searchParams }, '', );
  }

  getSections() {
    return [
      {
        id: 'CollectionProductGrid',
        section: document.getElementById('CollectionProductGrid').dataset.id,
      }
    ]
  }
}

customElements.define('collection-custom-tabs', CollectionTabs);
