window.theme = window.theme || {};
window.Shopify = window.Shopify || {};

class Accordion {
  constructor(el) {
    // Store the <details> element
    this.el = el;
    // Store the <summary> element
    this.summary = el.querySelector("summary");
    // Store the <div class="content"> element
    this.content = el.querySelector(".accordion__content");

    // Store the animation object (so we can cancel it if needed)
    this.animation = null;
    // Store if the element is closing
    this.isClosing = false;
    // Store if the element is expanding
    this.isExpanding = false;
    // Detect user clicks on the summary element
    this.summary.addEventListener("click", (e) => this.onClick(e));
  }

  onClick(e) {
    // Stop default behaviour from the browser
    e.preventDefault();
    // Add an overflow on the <details> to avoid content overflowing
    this.el.style.overflow = "hidden";
    // Check if the element is being closed or is already closed
    if (this.isClosing || !this.el.open) {
      this.open();
      // Check if the element is being openned or is already open
    } else if (this.isExpanding || this.el.open) {
      this.shrink();
    }

    //   const active = this.el.find(d => d.open)
    //   if (!e.currentTarget.open && active) {
    //     active.open = false
    //   }
  }

  shrink() {
    // Set the element as "being closed"
    this.isClosing = true;

    // Store the current height of the element
    const startHeight = `${this.el.offsetHeight}px`;
    // Calculate the height of the summary
    const endHeight = `${this.summary.offsetHeight}px`;

    // If there is already an animation running
    if (this.animation) {
      // Cancel the current animation
      this.animation.cancel();
    }

    // Start a WAAPI animation
    this.animation = this.el.animate(
      {
        // Set the keyframes from the startHeight to endHeight
        height: [startHeight, endHeight],
      },
      {
        duration: 400,
        easing: "ease-out",
      }
    );

    // When the animation is complete, call onAnimationFinish()
    this.animation.onfinish = () => this.onAnimationFinish(false);
    // If the animation is cancelled, isClosing variable is set to false
    this.animation.oncancel = () => (this.isClosing = false);
  }

  open() {
    // Apply a fixed height on the element
    this.el.style.height = `${this.el.offsetHeight}px`;
    // Force the [open] attribute on the details element
    this.el.open = true;
    // Wait for the next frame to call the expand function
    window.requestAnimationFrame(() => this.expand());
  }

  expand() {
    // Set the element as "being expanding"
    this.isExpanding = true;
    // Get the current fixed height of the element
    const startHeight = `${this.el.offsetHeight}px`;
    // Calculate the open height of the element (summary height + content height)
    const endHeight = `${
      this.summary.offsetHeight + this.content.offsetHeight
    }px`;

    // If there is already an animation running
    if (this.animation) {
      // Cancel the current animation
      this.animation.cancel();
    }

    // Start a WAAPI animation
    this.animation = this.el.animate(
      {
        // Set the keyframes from the startHeight to endHeight
        height: [startHeight, endHeight],
      },
      {
        duration: 400,
        easing: "ease-out",
      }
    );
    // When the animation is complete, call onAnimationFinish()
    this.animation.onfinish = () => this.onAnimationFinish(true);
    // If the animation is cancelled, isExpanding variable is set to false
    this.animation.oncancel = () => (this.isExpanding = false);
  }

  onAnimationFinish(open) {
    // Set the open attribute based on the parameter
    this.el.open = open;
    // Clear the stored animation
    this.animation = null;
    // Reset isClosing & isExpanding
    this.isClosing = false;
    this.isExpanding = false;
    // Remove the overflow hidden and the fixed height
    this.el.style.height = this.el.style.overflow = "";
  }
}

document.querySelectorAll("cc-accordion-item").forEach((el) => {
  new Accordion(el);
});

class LocalizationForm extends HTMLElement {
  constructor() {
    super();
    this.elements = {
      input: this.querySelector(
        'input[name="language_code"], input[name="country_code"]'
      ),
      button: this.querySelector("button"),
      panel: this.querySelector(".disclosure__modal"),
    };
    this.elements.button.addEventListener(
      "click",
      this.openSelector.bind(this)
    );
    this.elements.button.addEventListener(
      "focusout",
      this.closeSelector.bind(this)
    );
    this.addEventListener("keyup", this.onContainerKeyUp.bind(this));
    this.querySelectorAll("a").forEach((item) =>
      item.addEventListener("click", this.onItemClick.bind(this))
    );
    //     document.querySelector('body').addEventListener('scroll', this.hidePanel.bind(this));
  }

  hidePanel() {
    this.elements.button.setAttribute("aria-expanded", "false");
    this.elements.panel.setAttribute("hidden", true);
  }

  onContainerKeyUp(event) {
    if (event.code.toUpperCase() !== "ESCAPE") return;

    this.hidePanel();
    this.elements.button.focus();
  }

  onItemClick(event) {
    event.preventDefault();
    const form = this.querySelector("form");
    this.elements.input.value = event.currentTarget.dataset.value;
    if (form) form.submit();
  }

  openSelector() {
    this.elements.button.focus();
    this.elements.panel.toggleAttribute("hidden");
    this.elements.button.setAttribute(
      "aria-expanded",
      (
        this.elements.button.getAttribute("aria-expanded") === "false"
      ).toString()
    );
  }

  closeSelector(event) {
    const shouldClose =
      event.relatedTarget && event.relatedTarget.nodeName === "BUTTON";
    if (event.relatedTarget === null || shouldClose) {
      this.hidePanel();
    }
  }
}

customElements.define("localization-form", LocalizationForm);


if (!!document.querySelector('.template--product [data-template="main-product-template"]') == true) {
  var elemProduct = document.querySelector('.template--product [data-template="main-product-template"]');

  if (!!elemProduct.querySelectorAll('.option-swatch')) {
    var optionSwatchRadios = elemProduct.querySelectorAll('.option-swatch input[type="radio"]');

    optionSwatchRadios.forEach(function(optionSwatchRadio) {
      optionSwatchRadio.addEventListener('change',function(event) {
        var radioId = event.target.id;
        var radioLabel = elemProduct.querySelector(`label[for="${radioId}"]`);
        
        var container = event.target.closest('fieldset');
        var optionSwatch = event.target.parentElement;

        container.querySelector('.variant__label-info span').innerText = radioLabel.getAttribute('value');

        // var selectedVariantImage = optionSwatch.getAttribute('option-image');
        // if (selectedVariantImage.length > 0) {
        //   var selectedVariantImageIndex = elemProduct.querySelector(`.left__nav .product-single__media[image-id="${selectedVariantImage}"]`).getAttribute('image-index');
        //   var selectedVariantThumbnail = elemProduct.querySelector(`.product-slider-nav .product__thumb[data-index="${selectedVariantImageIndex}"]`);
        //   simulateClick(selectedVariantThumbnail);
        // }

        container.querySelector('label.selected').classList.remove('selected');
        elemProduct.querySelector(`label[for="${radioId}"]`).classList.add('selected');
      });
    });
  }
}

document.addEventListener('click', (event) => {
  const cardWrapperProduct = event.target.closest('.card--product');
  const sizeChartTrigger = event.target.closest('.size__chart-trigger');

  const mainProductQuantityButton = event.target.closest('.quantity__main-product button');
  const cartPageQuantityButton = event.target.closest('.cart-page .quantity__main button.quantity_box');

  const mobileFilterToggle = event.target.closest('.mobile-filter-icon');

  if ( !cardWrapperProduct &&
       !sizeChartTrigger &&
       !mainProductQuantityButton &&
       !cartPageQuantityButton &&
       !mobileFilterToggle
     ) return; //do nothing
  
  event.preventDefault();
  
  if (!!mainProductQuantityButton) {
    handleClickMainProductQuantityButton(mainProductQuantityButton);
  }

  if (!!cartPageQuantityButton) {
    handleClickCartPageQuantityButton(cartPageQuantityButton);
  }

  if (!!sizeChartTrigger) {
    handleSizeChartTriggerClick(sizeChartTrigger);
    return;
  }

  if (!!cardWrapperProduct) {
    if (!event.target.classList.contains('quick_view_btn') && !event.target.closest('.quick_view_btn')) {
      if (cardWrapperProduct.dataset.href) {
        window.location.href = cardWrapperProduct.dataset.href;
      }
    }
  }

  if (!!mobileFilterToggle) {
    handleClickMobileFilterToggle(mobileFilterToggle);
  }

});

document.addEventListener("change", (event) => {
  const optionSwatchRadio = event.target.closest('.grid-variant-input input[type="radio"]');
  const cartPageQuantityInput = event.target.closest('.cart-page .quantity__main [name="quantity"]');
  const mainProductQuantityInput = event.target.closest('.quantity__main-product input[type="number"]');

  if ( !optionSwatchRadio && !cartPageQuantityInput && !mainProductQuantityInput ) return; //do nothing

  if (!!cartPageQuantityInput) {
    handleChangeCartPageQuantityInput(cartPageQuantityInput);
  }

  if (!!mainProductQuantityInput) {
    handleChangeMainProductQuantityInput(mainProductQuantityInput);
  }

  if (!!optionSwatchRadio) {
    var optionSwatch = optionSwatchRadio.closest('.grid-variant-input');
    var cardWrapper = optionSwatchRadio.closest('.card-wrapper');
    var optionSwatchLabel = cardWrapper.querySelector(`label[for="${optionSwatchRadio.id}"]`);
    var selectedVariantImage = optionSwatch.getAttribute('image-src');
    cardWrapper.querySelectorAll('.grid-variant__button-label').forEach(function(label) {
      label.classList.remove('selected');
    });
    optionSwatchLabel.classList.add('selected');
    var unitPrice = optionSwatch.getAttribute('unit-price');
    if (unitPrice != "") {
      cardWrapper.querySelector('.card-details__wrapper small.unit-price').classList.remove('is-hidden');
    } else {
      cardWrapper.querySelector('.card-details__wrapper small.unit-price').classList.add('is-hidden');
    }

    var unitPrice = optionSwatch.getAttribute('unit-price');
    var referenceUnit = optionSwatch.getAttribute('referal-unit');
    var price = optionSwatch.dataset.price;
    var comparePrice = optionSwatch.dataset.comparePrice;
    var optionId = optionSwatch.getAttribute('option-id');

    if (!!cardWrapper.querySelector('.price [unit_price]') && unitPrice != undefined) {
      cardWrapper.querySelector('.price [unit_price]').innerHTML = unitPrice;  
    }
    
    if (!!cardWrapper.querySelector('.price [refereal_unit]') && referenceUnit != undefined) {
      cardWrapper.querySelector('.price [refereal_unit]').innerHTML = referenceUnit;  
    }
    
    if (!!cardWrapper.querySelector('.sale___price span.price-item.price-item--sale') && price != undefined) {
      cardWrapper.querySelector('.sale___price span.price-item.price-item--sale').innerHTML = price;  
    }
    
    if (!!cardWrapper.querySelector('.price__regular span.price-item.price-item--regular') && price != undefined) {
      cardWrapper.querySelector('.price__regular span.price-item.price-item--regular').innerHTML = price;  
    }
    
    if (!!cardWrapper.querySelector('.price_range span.price-item.price-item--regular') && price != undefined) {
      cardWrapper.querySelector('.price_range span.price-item.price-item--regular').innerHTML = price;  
    }
    
    if (!!cardWrapper.querySelector('.price__compare span.price-item.price-item--regular') && comparePrice != undefined) {
      cardWrapper.querySelector('.price__compare span.price-item.price-item--regular').innerHTML = comparePrice;  
    }

    if (!!cardWrapper.querySelector('[name="id"]') && optionId != undefined) {
      cardWrapper.querySelector('[name="id"]').setAttribute('value',optionId);
      cardWrapper.querySelector('[name="id"]').value = optionId;
      cardWrapper.querySelector('[name="id"]').setAttribute('value',optionId);
    }

    if (selectedVariantImage != "undefined" && selectedVariantImage != "" && selectedVariantImage != null) {
      cardWrapper.querySelector('.card__inner img').src = selectedVariantImage;

      /* if the card is inside a slider, resize the slider in case the variant image changes the height */
      if (!!cardWrapper.closest('.flickity-enabled')) {
        var parentSlider = cardWrapper.closest('.flickity-enabled');
        // Flickity.data(parentSlider).resize()
        setTimeout(function(){
          Flickity.data(parentSlider).resize()
        },400);
      }
    }
  }
});


// Swatch
if (!!document.querySelector('.template--product [data-template="main-product-template"]') == true) {
  var elemProduct = document.querySelector('.template--product [data-template="main-product-template"]');
  var inventoryListElem = elemProduct.querySelector('.js-variants-inventory');
  var elemOptionSwatches = elemProduct.querySelectorAll('.option-swatch');
  var elemOptionSwatchInputs = elemProduct.querySelectorAll('.option-swatch input');

  function swatchUpdateProduct() {
    var selectedVariantValue;
    var selectedVariantOptionIndex;
    var selectedArray = [];

    elemOptionSwatches.forEach(function(elemSwatch) {
      elemSwatch.classList.remove('CrossLine');
      elemSwatch.classList.remove('noCrossLine');
      elemSwatch.querySelector('input[type="radio"]').removeAttribute('disabled');
      elemSwatch.querySelector('label').removeAttribute('disabled');
    });

    elemOptionSwatchInputs.forEach(function(elemSwatchRadio) {
      if (elemSwatchRadio.checked == true) {
        selectedVariantValue = elemSwatchRadio.value;
        selectedVariantOptionIndex = Number(elemSwatchRadio.parentElement.dataset.optionIndex);
        selectedArray.push(selectedVariantValue);
      }
    });

    if (!!elemProduct.querySelector('.product-form__inpt[data-option-index="0"]') == true) {
      elemProduct.querySelectorAll('.product-form__inpt[data-option-index="0"] .option-swatch').forEach(function(optionSwatch) {
        let tempArray = selectedArray.slice();
        tempArray[0] = optionSwatch.dataset.value;
        optionSwatch.dataset.fullName = tempArray.join(' / ');
      });
    }

    if (!!elemProduct.querySelector('.product-form__inpt[data-option-index="1"]') == true) {
      elemProduct.querySelectorAll('.product-form__inpt[data-option-index="1"] .option-swatch').forEach(function(optionSwatch) {
        let tempArray = selectedArray.slice();
        tempArray[1] = optionSwatch.dataset.value;
        optionSwatch.dataset.fullName = tempArray.join(' / ');
      });
    }

    if (!!elemProduct.querySelector('.product-form__inpt[data-option-index="2"]') == true) {
      elemProduct.querySelectorAll('.product-form__inpt[data-option-index="2"] .option-swatch').forEach(function(optionSwatch) {
        let tempArray = selectedArray.slice();
        tempArray[2] = optionSwatch.dataset.value;
        optionSwatch.dataset.fullName = tempArray.join(' / ');
      });
    }

    elemOptionSwatchInputs.forEach(function(elemSwatchRadio) {
      if (elemSwatchRadio.checked == true) {

        selectedVariantValue = elemSwatchRadio.value;
        selectedVariantOptionIndex = Number(elemSwatchRadio.parentElement.dataset.optionIndex);

        if(inventoryListElem){

          inventoryListElem.querySelectorAll(`[data-option${selectedVariantOptionIndex}="${selectedVariantValue}"]`).forEach(function(matchingInventoryItem) {
            if (matchingInventoryItem.dataset.availability == "false") {
              elemProduct.querySelectorAll(`.option-swatch[data-full-name="${matchingInventoryItem.dataset.variantTitle}"]`).forEach(function(matchingSwatch) {
                matchingSwatch.classList.add('CrossLine');
                matchingSwatch.querySelector(`label`).setAttribute('disabled','disabled');
              });
            }

          });
        }

      }
    });    
  }

  if (inventoryListElem) {
    swatchUpdateProduct(inventoryListElem);
    setTimeout(function() {
      swatchUpdateProduct(inventoryListElem);
    }, 900);

    elemOptionSwatches.forEach(function(optionSwatch) {
      optionSwatch.addEventListener('click', function() {
        setTimeout(function() {
          swatchUpdateProduct(inventoryListElem);
        }, 350)
      });
    });
  }

}
// End swatches

// Quantity pickers
function handleChangeCartPageQuantityInput(cartPageQuantityInput) {
  var changedInput = cartPageQuantityInput;
  var section = changedInput.closest('.cart-page');
  
  var lineItemId = changedInput.getAttribute('line-item-id');
  var currentQuantity = changedInput.value;

  if (currentQuantity < 1) { currentQuantity = 1 }

  section.querySelectorAll(`input[type="number"][line-item-id="${lineItemId}"]`).forEach(function(input) {
    input.value = currentQuantity;
    input.setAttribute('value',currentQuantity);
  });

  if (document.body.classList.contains('template--cart')) {
    testQty(lineItemId, currentQuantity);
  }
}
function handleClickMainProductQuantityButton(mainProductQuantityButton) {
  var clickedButton = mainProductQuantityButton;
  var section = clickedButton.closest('.shopify-section');

  if (!!section.querySelector('[name="quantity"]')) {
    var quantityInputs = section.querySelectorAll('[name="quantity"]');
    var currentQuantity = parseInt(quantityInputs[0].value);
    if (clickedButton.classList.contains('quantity__decrease')) {
      currentQuantity--;
    } else {
      currentQuantity++;
    }
    if (currentQuantity < 1) { currentQuantity = 1 }
    quantityInputs.forEach(function(quantityInput) {
      quantityInput.value = currentQuantity;

      if (document.body.classList.contains('template--cart')) {
        var variantId = '';
        if (quantityInput.hasAttribute('line-item-id')) {
          variantId = quantityInput.getAttribute('line-item-id');
          testQty(variantId, currentQuantity);
        }
      }
    });
  }
}
function handleClickCartPageQuantityButton(cartPageQuantityButton) {
  var clickedButton = cartPageQuantityButton;
  var section = clickedButton.closest('.products-cart');

  var matchingInput = section.querySelector('[name="quantity"]');
  var lineItemId = matchingInput.getAttribute('line-item-id');
  var currentQuantity = matchingInput.value;

  if (clickedButton.classList.contains('quantity__decrease')) {
    currentQuantity--;
  } else {
    currentQuantity++;
  }
  if (currentQuantity < 1) { currentQuantity = 1 }
  section.querySelectorAll(`input[type="number"][line-item-id="${lineItemId}"]`).forEach(function(input) {
    input.value = currentQuantity;
    input.setAttribute('value',currentQuantity);
  });

  if (document.body.classList.contains('template--cart')) {
    testQty(lineItemId, currentQuantity);
  }
}
function handleChangeMainProductQuantityInput(mainProductQuantityInput) {
  var changedInput = mainProductQuantityInput;
  var section = changedInput.closest('.shopify-section');

  var currentQuantity = parseInt(changedInput.value);    
  if (currentQuantity < 1) { currentQuantity = 1 }
  if (!!section.querySelector('[name="quantity"]')) {
    var quantityInputs = section.querySelectorAll('[name="quantity"]');
    quantityInputs.forEach(function(quantityInput) {
      quantityInput.value = currentQuantity;
    });
  }
}
// Quantity pickers

// size chart start
function sizeChartTrapFocus(container, elementToFocus = container) {
  var elements = getFocusableElements(container);
  var first = elements[0];
  var last = elements[elements.length - 1];

  removeTrapFocus();

  elements.focusin = (event) => {
    if (
      event.target !== container &&
      event.target !== last &&
      event.target !== first
    )
      return;

    document.addEventListener('keydown', elements.keydown);
  };

  elements.focusout = function() {
    document.removeEventListener('keydown', elements.keydown);
  };

  elements.keydown = function(event) {
    if (event.code.toUpperCase() !== 'TAB') return; // If not TAB key
    // On the last focusable element and tab forward, focus the first element.
    if (event.target === last && !event.shiftKey) {
      event.preventDefault();
      first.focus();
    }

    //  On the first focusable element and tab backward, focus the last element.
    if (
      (event.target === container || event.target === first) &&
      event.shiftKey
    ) {
      event.preventDefault();
      last.focus();
    }
  };

  document.addEventListener('focusout', elements.focusout);
  document.addEventListener('focusin', elements.focusin);

  elementToFocus.focus();
}
function handleSizeChartTriggerClick(sizeChartTrigger) {
  if (!!document.querySelector('.size-chart-wrapper.popup-overlay')) {

    var popup = document.querySelector('.size-chart-wrapper.popup-overlay');
    popup.classList.toggle('is-active');

    sizeChartTrapFocus(
      popup,
      document.querySelector(".size-chart-wrapper button.close")
    );

    popup.addEventListener('click', function(event) {
      if (!event.target.closest('.popup-content')) {
        popup.classList.remove('is-active');
      }
      if (event.target.closest('button.close')) {
        event.preventDefault();
        popup.classList.remove('is-active');
        removeTrapFocus(sizeChartTrigger);
      }
      if (event.target.closest('.sizes-list button')) {
        var clickedSize = event.target.closest('.sizes-list button');
        popup.querySelector('.sizes-list button.is-selected').classList.remove('is-selected');
        popup.querySelector('.chart-content-wrapper.is-selected').classList.remove('is-selected');
        clickedSize.classList.add('is-selected');
        var size = clickedSize.dataset.size;
        popup.querySelector("[data-size-target=" + size + "]").classList.add('is-selected');
      }
      if (event.target.closest('.size-chart-wrapper.popup-overlay .chart-content_units .units .btn')) {
        event.preventDefault();
        var clickedUnits = event.target.closest('.size-chart-wrapper.popup-overlay .chart-content_units .units .btn');
        clickedUnits.classList.toggle('cm-selected');
        if (clickedUnits.classList.contains('cm-selected')) {
          var unit = 'cm';
        } else {
          var unit = 'in';
        }
        popup.querySelectorAll('.chart-content-wrapper .unit-value').forEach(function(unitValue) {
          if (unitValue.classList.contains(unit)) {
            unitValue.style.display = '';
          } else {
            unitValue.style.display = 'none';
          }
        });
      }
    });
  }
}
// size chart end

function handleClickMobileFilterToggle(mobileFilterToggle) {
  mobileFilterToggle.classList.toggle('show_cross');
  if (!!document.querySelector('.effortless-filter')) {
    document.querySelector('.effortless-filter').classList.toggle('show_mobile');
  }
}

var stopVideos = function () {
  var videos = document.querySelectorAll('lite-vimeo, lite-youtube iframe, video');
  Array.prototype.forEach.call(videos, function (video) {
    if (video.tagName.toLowerCase() === 'video') {
      video.pause();
    } else if (video.tagName.toLowerCase() === 'iframe') {
      /* pause youtube embeds */
      video.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
    } else if (video.tagName.toLowerCase() === 'lite-vimeo') {
      if (!!document.querySelector('lite-vimeo').shadowRoot) {
        if (!!document.querySelector('lite-vimeo').shadowRoot.querySelector('iframe')) {
          var videoIframe = video.shadowRoot.querySelector('iframe');
          var player = new Vimeo.Player(videoIframe);
          player.pause();
        }
      }
    }
  });
};

var masterSelects = document.querySelectorAll(`
  .main__product [action="${window.routes.cart_add_url}"] [name="id"],
  .featured__product [action="${window.routes.cart_add_url}"] [name="id"]`
);
if (masterSelects.length > 0) {
  masterSelects.forEach(function(masterSelect) {
    masterSelect.addEventListener('change', function(event) {
      var id = event.target.value;
      var container = event.target.closest('.shopify-section');
      var optionImageId = event.target.querySelector('option[value="'+id+'"]').dataset.imageId;

      if (!!optionImageId) {
        var target_media = container.querySelector('.product__thumbs [image-id="' + optionImageId + '"]');
        if (!!target_media) {
          simulateClick(target_media);
        }
      }
    });
  });
}

function sortfuntion() {
  setTimeout(function () {
    var url_sort = document.querySelector('[name="sort_by"]');
    url_sort = url_sort.value;
    window.location.href =
      document.querySelector('[rel="canonical"]').getAttribute("href") +
      "?sort_by=" +
      url_sort;
  }, 300);
}
theme.config = {
  hasSessionStorage: true,
  hasLocalStorage: true,
  isTouch:
    "ontouchstart" in window ||
    (window.DocumentTouch && window.document instanceof DocumentTouch) ||
    window.navigator.maxTouchPoints ||
    window.navigator.msMaxTouchPoints
      ? true
      : false,
  rtl: document.documentElement.getAttribute("dir") == "rtl" ? true : false,
};

(function () {
  "use strict";

  theme.delegate = {
    on: function (event, callback, options) {
      if (!this.namespaces) this.namespaces = {};

      this.namespaces[event] = callback;
      options = options || false;

      this.addEventListener(event.split(".")[0], callback, options);
      return this;
    },
    off: function (event) {
      if (!this.namespaces) {
        return;
      }
      this.removeEventListener(event.split(".")[0], this.namespaces[event]);
      delete this.namespaces[event];
      return this;
    },
  };

  theme.utils = {
    defaultTo: function (value, defaultValue) {
      return value == null || value !== value ? defaultValue : value;
    },

    wrap: function (el, wrapper) {
      el.parentNode.insertBefore(wrapper, el);
      wrapper.appendChild(el);
    },

    debounce: function (wait, callback, immediate) {
      var timeout;
      return function () {
        var context = this,
          args = arguments;
        var later = function () {
          timeout = null;
          if (!immediate) callback.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) callback.apply(context, args);
      };
    },

    throttle: function (limit, callback) {
      var waiting = false;
      return function () {
        if (!waiting) {
          callback.apply(this, arguments);
          waiting = true;
          setTimeout(function () {
            waiting = false;
          }, limit);
        }
      };
    },

    prepareTransition: function (el, callback) {
      el.addEventListener("transitionend", removeClass);

      function removeClass(evt) {
        el.classList.remove("is-transitioning");
        el.removeEventListener("transitionend", removeClass);
      }

      el.classList.add("is-transitioning");
      el.offsetWidth; // check offsetWidth to force the style rendering

      if (typeof callback === "function") {
        callback();
      }
    },

    // _.compact from lodash
    // Creates an array with all falsey values removed. The values `false`, `null`,
    // `0`, `""`, `undefined`, and `NaN` are falsey.
    // _.compact([0, 1, false, 2, '', 3]);
    // => [1, 2, 3]
    compact: function (array) {
      var index = -1,
        length = array == null ? 0 : array.length,
        resIndex = 0,
        result = [];

      while (++index < length) {
        var value = array[index];
        if (value) {
          result[resIndex++] = value;
        }
      }
      return result;
    },

    serialize: function (form) {
      var arr = [];
      Array.prototype.slice.call(form.elements).forEach(function (field) {
        if (
          !field.name ||
          field.disabled ||
          ["file", "reset", "submit", "button"].indexOf(field.type) > -1
        )
          return;
        if (field.type === "select-multiple") {
          Array.prototype.slice.call(field.options).forEach(function (option) {
            if (!option.selected) return;
            arr.push(
              encodeURIComponent(field.name) +
                "=" +
                encodeURIComponent(option.value)
            );
          });
          return;
        }
        if (["checkbox", "radio"].indexOf(field.type) > -1 && !field.checked)
          return;
        arr.push(
          encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value)
        );
      });
      return arr.join("&");
    },
  };

  // Init section function when it's visible, then disable observer
  theme.initWhenVisible = function (options) {
    var threshold = options.threshold ? options.threshold : 0;

    var observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (typeof options.callback === "function") {
              options.callback();
              observer.unobserve(entry.target);
            }
          }
        });
      },
      { rootMargin: "0px 0px " + threshold + "px 0px" }
    );

    observer.observe(options.element);
  };

  window.on = Element.prototype.on = theme.delegate.on;
  window.off = Element.prototype.off = theme.delegate.off;

  theme.a11y = {
    trapFocus: function (options) {
      var eventsName = {
        focusin: options.namespace ? "focusin." + options.namespace : "focusin",
        focusout: options.namespace
          ? "focusout." + options.namespace
          : "focusout",
        keydown: options.namespace
          ? "keydown." + options.namespace
          : "keydown.handleFocus",
      };

      var focusableEls = options.container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex^="-"])'
      );
      var elArray = [].slice.call(focusableEls);
      var focusableElements = elArray.filter((el) => el.offsetParent !== null);

      var firstFocusable = focusableElements[0];
      var lastFocusable = focusableElements[focusableElements.length - 1];

      if (!options.elementToFocus) {
        options.elementToFocus = options.container;
      }

      options.container.setAttribute("tabindex", "-1");
      options.elementToFocus.focus();

      document.documentElement.off("focusin");
      document.documentElement.on(eventsName.focusout, function () {
        document.documentElement.off(eventsName.keydown);
      });

      document.documentElement.on(eventsName.focusin, function (evt) {
        if (evt.target !== lastFocusable && evt.target !== firstFocusable)
          return;

        document.documentElement.on(eventsName.keydown, function (evt) {
          _manageFocus(evt);
        });
      });

      function _manageFocus(evt) {
        if (evt.keyCode !== 9) return;

        if (evt.target === firstFocusable && evt.shiftKey) {
          evt.preventDefault();
          lastFocusable.focus();
        }
      }
    },
    removeTrapFocus: function (options) {
      var eventName = options.namespace
        ? "focusin." + options.namespace
        : "focusin";

      if (options.container) {
        options.container.removeAttribute("tabindex");
      }

      document.documentElement.off(eventName);
    },

    lockMobileScrolling: function (namespace, element) {
      var el = element ? element : document.documentElement;
      document.documentElement.classList.add("lock-scroll");
      el.on("touchmove" + namespace, function () {
        return true;
      });
    },

    unlockMobileScrolling: function (namespace, element) {
      document.documentElement.classList.remove("lock-scroll");
      var el = element ? element : document.documentElement;
      el.off("touchmove" + namespace);
    },
  };

  document.documentElement.on("keyup.tab", function (evt) {
    if (evt.keyCode === 9) {
      document.documentElement.classList.add("tab-outline");
      document.documentElement.off("keyup.tab");
    }
  });

  theme.Sections = function Sections() {
    this.constructors = {};
    this.instances = [];

    document.addEventListener(
      "shopify:section:load",
      this._onSectionLoad.bind(this)
    );
    document.addEventListener(
      "shopify:section:unload",
      this._onSectionUnload.bind(this)
    );
    document.addEventListener(
      "shopify:section:select",
      this._onSelect.bind(this)
    );
    document.addEventListener(
      "shopify:section:deselect",
      this._onDeselect.bind(this)
    );
    document.addEventListener(
      "shopify:block:select",
      this._onBlockSelect.bind(this)
    );
    document.addEventListener(
      "shopify:block:deselect",
      this._onBlockDeselect.bind(this)
    );
  };

  theme.Sections.prototype = Object.assign({}, theme.Sections.prototype, {
    _createInstance: function (container, constructor, scope) {
      var id = container.getAttribute("data-section-id");
      var type = container.getAttribute("data-section-type");

      constructor = constructor || this.constructors[type];

      if (typeof constructor === "undefined") {
        return;
      }

      if (scope) {
        var instanceExists = this._findInstance(id);
        if (instanceExists) {
          this._removeInstance(id);
        }
      }

      var instance = Object.assign(new constructor(container), {
        id: id,
        type: type,
        container: container,
      });

      this.instances.push(instance);
    },

    _findInstance: function (id) {
      for (var i = 0; i < this.instances.length; i++) {
        if (this.instances[i].id === id) {
          return this.instances[i];
        }
      }
    },

    _removeInstance: function (id) {
      var i = this.instances.length;
      var instance;

      while (i--) {
        if (this.instances[i].id === id) {
          instance = this.instances[i];
          this.instances.splice(i, 1);
          break;
        }
      }

      return instance;
    },

    _onSectionLoad: function (evt, subSection, subSectionId) {
       animateElements();
      if (window.AOS) {
        AOS.refreshHard();
      }
      if (theme && theme.initGlobals) {
        theme.initGlobals();
      }

      var container = subSection ? subSection : evt.target;
      var section = subSection
        ? subSection
        : evt.target.querySelector("[data-section-id]");

      if (!section) {
        return;
      }

      this._createInstance(section);

      var instance = subSection
        ? subSectionId
        : this._findInstance(evt.detail.sectionId);

      var haveSubSections = container.querySelectorAll("[data-subsection]");
      if (haveSubSections.length) {
        this.loadSubSections(container);
      }

      if (instance && typeof instance.onLoad === "function") {
        instance.onLoad(evt);
      }

      setTimeout(function () {
        window.dispatchEvent(new Event("scroll"));
        window.dispatchEvent(new Event("resize"));
      }, 200);
    },

    _onSectionUnload: function (evt) {
      this.instances = this.instances.filter(function (instance) {
        var isEventInstance = instance.id === evt.detail.sectionId;

        if (isEventInstance) {
          if (typeof instance.onUnload === "function") {
            instance.onUnload(evt);
          }
        }

        return !isEventInstance;
      });
    },

    loadSubSections: function (scope) {
      var sections = scope
        ? scope.querySelectorAll("[data-subsection]")
        : document.querySelectorAll("[data-subsection]");

      sections.forEach((el) => {
        this._onSectionLoad(null, el, el.dataset.sectionId);
      });

      if (window.AOS) {
        AOS.refreshHard();
      }
    },

    _onSelect: function (evt) {
      var instance = this._findInstance(evt.detail.sectionId);

      if (
        typeof instance !== "undefined" &&
        typeof instance.onSelect === "function"
      ) {
        instance.onSelect(evt);
      }
    },

    _onDeselect: function (evt) {
      var instance = this._findInstance(evt.detail.sectionId);

      if (
        typeof instance !== "undefined" &&
        typeof instance.onDeselect === "function"
      ) {
        instance.onDeselect(evt);
      }
    },

    _onBlockSelect: function (evt) {
      var instance = this._findInstance(evt.detail.sectionId);

      if (
        typeof instance !== "undefined" &&
        typeof instance.onBlockSelect === "function"
      ) {
        instance.onBlockSelect(evt);
      }
    },

    _onBlockDeselect: function (evt) {
      var instance = this._findInstance(evt.detail.sectionId);

      if (
        typeof instance !== "undefined" &&
        typeof instance.onBlockDeselect === "function"
      ) {
        instance.onBlockDeselect(evt);
      }
    },

    register: function (type, constructor, scope) {
      this.constructors[type] = constructor;

      var sections = document.querySelectorAll(
        '[data-section-type="' + type + '"]'
      );

      if (scope) {
        sections = scope.querySelectorAll('[data-section-type="' + type + '"]');
      }

      sections.forEach(
        function (container) {
          this._createInstance(container, constructor, scope);
        }.bind(this)
      );
    },

    reinit: function (section) {
      for (var i = 0; i < this.instances.length; i++) {
        var instance = this.instances[i];
        if (instance["type"] === section) {
          if (typeof instance.forceReload === "function") {
            instance.forceReload();
          }
        }
      }
    },
  });

  theme.Modals = (function () {
    function Modal(id, name, options) {
      var defaults = {
        close: ".js-modal-close",
        open: ".js-modal-open-" + name,
        openClass: "modal--is-active",
        open_class: "open",
        closingClass: "modal--is-closing",
        bodyOpenClass: "modal-open",
        bodyOpenSolidClass: "modal-open--solid",
        bodyClosingClass: "modal-closing",
        closeOffContentClick: true,
      };

      this.id = id;
      this.modal = document.getElementById(id);
      if (!this.modal) {
        return false;
      }

      this.modalContent = this.modal.querySelector(".modal__inner");

      this.config = Object.assign(defaults, options);
      this.modalIsOpen = false;
      this.focusOnOpen = this.config.focusIdOnOpen
        ? document.getElementById(this.config.focusIdOnOpen)
        : this.modal;
      this.isSolid = this.config.solid;

      this.init();
    }

    Modal.prototype.init = function () {
      document.querySelectorAll(this.config.open).forEach((btn) => {
        btn.setAttribute("aria-expanded", "false");
        btn.addEventListener("click", this.open.bind(this));
      });

      this.modal.querySelectorAll(this.config.close).forEach((btn) => {
        btn.addEventListener("click", this.close.bind(this));
      });

      document.addEventListener(
        "drawerOpen",
        function () {
          this.close();
        }.bind(this)
      );
    };

    Modal.prototype.open = function (evt) {
      var externalCall = false;

      if (this.modalIsOpen) {
        return;
      }

      if (evt) {
        evt.preventDefault();
      } else {
        externalCall = true;
      }

      if (evt && evt.stopPropagation) {
        evt.stopPropagation();
        this.activeSource = evt.currentTarget.setAttribute(
          "aria-expanded",
          "true"
        );
      }

      if (this.modalIsOpen && !externalCall) {
        this.close();
      }

      this.modal.classList.add(this.config.openClass);
      var __th = this;
      setTimeout(function () {
        __th.modal.classList.add(__th.config.open_class);
      }, 50);
      document.documentElement.classList.add(this.config.bodyOpenClass);

      if (this.isSolid) {
        document.documentElement.classList.add(this.config.bodyOpenSolidClass);
      }

      this.modalIsOpen = true;

      theme.a11y.trapFocus({
        container: this.modal,
        elementToFocus: this.focusOnOpen,
        namespace: "modal_focus",
      });

      document.dispatchEvent(new CustomEvent("modalOpen"));
      document.dispatchEvent(new CustomEvent("modalOpen." + this.id));

      this.bindEvents();
    };

    Modal.prototype.close = function (evt) {
      if (!this.modalIsOpen) {
        return;
      }

      if (evt) {
        if (evt.target.closest(".js-modal-close")) {
        } else if (evt.target.closest(".modal__inner")) {
          return;
        }
      }

      document.activeElement.blur();

      this.modal.classList.remove(this.config.openClass);
      this.modal.classList.add(this.config.closingClass);
      var __th = this;
      setTimeout(function () {
        __th.modal.classList.add(__th.config.open_class);
      }, 50);

      document.documentElement.classList.remove(this.config.bodyOpenClass);
      document.documentElement.classList.add(this.config.bodyClosingClass);

      window.setTimeout(
        function () {
          document.documentElement.classList.remove(
            this.config.bodyClosingClass
          );
          this.modal.classList.remove(this.config.closingClass);
          if (
            this.activeSource &&
            this.activeSource.getAttribute("aria-expanded")
          ) {
            this.activeSource.setAttribute("aria-expanded", "false").focus();
          }
        }.bind(this),
        500
      );

      if (this.isSolid) {
        document.documentElement.classList.remove(
          this.config.bodyOpenSolidClass
        );
      }

      this.modalIsOpen = false;

      theme.a11y.removeTrapFocus({
        container: this.modal,
        namespace: "modal_focus",
      });

      document.dispatchEvent(new CustomEvent("modalClose." + this.id));

      this.unbindEvents();
    };

    Modal.prototype.bindEvents = function () {
      window.on(
        "keyup.modal",
        function (evt) {
          if (evt.keyCode === 27) {
            this.close();
          }
        }.bind(this)
      );

      if (this.config.closeOffContentClick) {
        this.modal.on("click.modal", this.close.bind(this));
      }
    };

    Modal.prototype.unbindEvents = function () {
      document.documentElement.off(".modal");

      if (this.config.closeOffContentClick) {
        this.modal.off(".modal");
      }
    };

    return Modal;
  })();

  theme.NewsletterPopup = (function () {
    function NewsletterPopup(container) {
      this.container = container;
      var sectionId = this.container.getAttribute("data-section-id");
      this.cookieName = "newsletter-" + sectionId;

      if (!container) {
        return;
      }

      if (window.location.pathname === "/challenge") {
        return;
      }

      this.data = {
        secondsBeforeShow: container.dataset.delaySeconds,
        daysBeforeReappear: container.dataset.delayDays,
        cookie: Cookies.get(this.cookieName),
        testMode: container.dataset.testMode,
      };

      this.modal = new theme.Modals(
        "NewsletterPopup-" + sectionId,
        "newsletter-popup-modal"
      );
      this.modalElem = document.getElementById("NewsletterPopup-" + sectionId);

      if (
        container.querySelector(".errors") ||
        container.querySelector(".note--success")
      ) {
        this.modal.open();
      }

      if (container.querySelector(".note--success")) {
        this.closePopup(true);
        return;
      }

      document.addEventListener(
        "modalClose." + container.id,
        this.closePopup.bind(this)
      );

      if (!this.data.cookie || this.data.testMode === "true") {
        this.initPopupDelay();
      }
    }

    NewsletterPopup.prototype = Object.assign({}, NewsletterPopup.prototype, {
      initPopupDelay: function () {
        if (Shopify && Shopify.designMode) {
          return;
        }

        // Open the modal directly when the ppopup was submitted
        if (this.modalElem.querySelector('.newsletter-form__message--success')) {
          if (
            window.localStorage.getItem("newsletter-popup_submitted")
          ) {
            this.modal.open();

            window.localStorage.removeItem(
              "newsletter-popup_submitted"
            );
            return;
          }
        } else {
            setTimeout(
              function () {
                this.modal.open();
                if(document
                  .querySelector('[data-section-id="newsletter-popup"] form')){
                document
                  .querySelector('[data-section-id="newsletter-popup"] form')
                  .addEventListener("submit", function () {
                    window.localStorage.setItem(
                      "newsletter-popup_submitted",
                      true
                    );
                  });
                }

              }.bind(this),
              this.data.secondsBeforeShow * 1000
            );
          }
      },

      closePopup: function (success) {
        if (this.data.testMode === "true") {
          Cookies.remove(this.cookieName, { path: "/" });
          return;
        }
        var expiry = success
          ? parseInt(this.data.daysBeforeReappear)
          : parseInt(this.data.daysBeforeReappear);
        Cookies.set(this.cookieName, "opened", { path: "/", expires: expiry });
      },

      onLoad: function () {
        this.modal.open();
      },

      onSelect: function () {
        this.modal.open();
      },

      onDeselect: function () {
        this.modal.close();
      },
    });

    return NewsletterPopup;
  })();

  // theme.Slideshow handles all flickity based sliders
  // Child navigation is only setup to work on product images
  theme.Slideshow = (function () {
    var classes = {
      animateOut: "animate-out",
      isPaused: "is-paused",
      isActive: "is-active",
    };

    var selectors = {
      allSlides: ".slideshow__slide",
      currentSlide: ".is-selected",
      wrapper: ".slider-wrapper",
      pauseButton: ".slideshow__pause",
    };

    var productSelectors = {
      thumb: ".product__thumb-item:not(.hide)",
      links: ".product__thumb-item:not(.hide) .product__thumb",
      arrow: ".product__thumb-arrow",
    };

    var defaults = {
      adaptiveHeight: false,
      autoPlay: false,
      avoidReflow: false,
      childNav: null, // instead of asNavFor
      childNavScroller: null, // element
      childVertical: false,
      fade: false,
      initialIndex: 0,
      pageDots: false,
      pauseAutoPlayOnHover: false,
      prevNextButtons: false,
      rightToLeft: theme.config.rtl,
      setGallerySize: true,
      wrapAround: true,
    };

    function slideshow(el, args) {
      this.el = el;
      this.args = Object.assign({}, defaults, args);

      // Setup listeners as part of arguments
      this.args.on = {
        ready: this.init.bind(this),
        change: this.slideChange.bind(this),
        settle: this.afterChange.bind(this),
      };

      if (this.args.childNav) {
        this.childNavEls = this.args.childNav.querySelectorAll(
          productSelectors.thumb
        );
        this.childNavLinks = this.args.childNav.querySelectorAll(
          productSelectors.links
        );
        this.arrows = this.args.childNav.querySelectorAll(
          productSelectors.arrow
        );
        if (this.childNavLinks.length) {
          this.initChildNav();
        }
      }

      if (this.args.avoidReflow) {
        avoidReflow(el);
      }

      this.slideshow = new Flickity(el, this.args);

      // Reset dimensions on resize
      window.on(
        "resize",
        theme.utils.debounce(
          300,
          function () {
            this.resize();
          }.bind(this)
        )
      );

      // Set flickity-viewport height to first element to
      // avoid awkward page reflows while initializing.
      // Must be added in a `style` tag because element does not exist yet.
      // Slideshow element must have an ID
      function avoidReflow(el) {
        if (!el.id) return;
        var firstChild = el.firstChild;
        while (firstChild != null && firstChild.nodeType == 3) {
          // skip TextNodes
          firstChild = firstChild.nextSibling;
        }
        var style = document.createElement("style");
        style.innerHTML = `#${el.id} .flickity-viewport{height:${firstChild.offsetHeight}px}`;
        document.head.appendChild(style);
      }
    }

    slideshow.prototype = Object.assign({}, slideshow.prototype, {
      init: function (el) {
        this.currentSlide = this.el.querySelector(selectors.currentSlide);

        // Optional onInit callback
        if (this.args.callbacks && this.args.callbacks.onInit) {
          if (typeof this.args.callbacks.onInit === "function") {
            this.args.callbacks.onInit(this.currentSlide);
          }
        }

        var focusableElements = [
          "a",
          "input",
          "select",
          "button",
          "iframe",
          'div[role="button"]',
        ];

        /* change tabbing focus when slide changes */
        this.el.querySelectorAll(selectors.allSlides).forEach((slide) => {
          focusableElements.forEach((focusableElement) => {
            slide.querySelectorAll(focusableElement).forEach((sliderLink) => {
              sliderLink.tabIndex = -1;
            });
          });
        });

        focusableElements.forEach((focusableElement) => {
          this.currentSlide
            .querySelectorAll(focusableElement)
            .forEach((sliderLink) => {
              sliderLink.tabIndex = 0;
            });
        });

        if (window.AOS) {
          AOS.refresh();
        }
      },

      slideChange: function (index) {
        // Outgoing fade styles
        if (this.args.fade && this.currentSlide) {
          this.currentSlide.classList.add(classes.animateOut);
          this.currentSlide.addEventListener(
            "transitionend",
            function () {
              this.currentSlide.classList.remove(classes.animateOut);
            }.bind(this)
          );
        }

        // Match index with child nav
        if (this.args.childNav) {
          this.childNavGoTo(index);
        }
        if (this.slideshow) {
          this.slideshow.cells.forEach((slide) => {
            slide.element.querySelectorAll("a").forEach((sliderLink) => {
              sliderLink.tabIndex = -1;
            });
          });

          this.slideshow.cells[index].element
            .querySelectorAll("a")
            .forEach((sliderLink) => {
              sliderLink.tabIndex = 0;
            });
        }

        // Optional onChange callback
        if (this.args.callbacks && this.args.callbacks.onChange) {
          if (typeof this.args.callbacks.onChange === "function") {
            this.args.callbacks.onChange(index);
          }
        }

        // Show/hide arrows depending on selected index
        if (this.arrows && this.arrows.length) {
          this.arrows[0].classList.toggle("hide", index === 0);
          this.arrows[1].classList.toggle(
            "hide",
            index === this.childNavLinks.length - 1
          );
        }
      },
      afterChange: function (index) {
        // Remove all fade animation classes after slide is done
        if (this.args.fade) {
          this.el.querySelectorAll(selectors.allSlides).forEach((slide) => {
            slide.classList.remove(classes.animateOut);
          });
        }

        // Match index with child nav (in case slider height changed first)
        if (this.args.childNav) {
          this.childNavGoTo(this.slideshow.selectedIndex);
        }
      },
      destroy: function () {
        if (this.args.childNav && this.childNavLinks.length) {
          this.childNavLinks.forEach((a) => {
            a.classList.remove(classes.isActive);
          });
        }
        this.slideshow.destroy();
      },
      _togglePause: function () {
        if (this.pauseBtn.classList.contains(classes.isPaused)) {
          this.pauseBtn.classList.remove(classes.isPaused);
          this.slideshow.playPlayer();
        } else {
          this.pauseBtn.classList.add(classes.isPaused);
          this.slideshow.pausePlayer();
        }
      },
      resize: function () {
        this.slideshow.resize();
      },
      play: function () {
        this.slideshow.playPlayer();
      },
      pause: function () {
        this.slideshow.pausePlayer();
      },
      goToSlide: function (i) {
        this.slideshow.select(i);
      },
      setDraggable: function (enable) {
        this.slideshow.options.draggable = enable;
        this.slideshow.updateDraggable();
      },

      initChildNav: function () {
        this.childNavLinks[this.args.initialIndex].classList.add("is-active");

        // Setup events
        this.childNavLinks.forEach((link, i) => {
          // update data-index because image-set feature may be enabled
          link.setAttribute("data-index", i);

          link.addEventListener(
            "click",
            function (evt) {
              evt.preventDefault();
              this.goToSlide(this.getChildIndex(evt.currentTarget));
            }.bind(this)
          );
          link.addEventListener(
            "focus",
            function (evt) {
              this.goToSlide(this.getChildIndex(evt.currentTarget));
            }.bind(this)
          );
          link.addEventListener(
            "keydown",
            function (evt) {
              if (evt.keyCode === 13) {
                this.goToSlide(this.getChildIndex(evt.currentTarget));
              }
            }.bind(this)
          );
        });

        // Setup optional arrows
        if (this.arrows.length) {
          this.arrows.forEach((arrow) => {
            arrow.addEventListener("click", this.arrowClick.bind(this));
          });
        }
      },

      getChildIndex: function (target) {
        return parseInt(target.dataset.index);
      },

      childNavGoTo: function (index) {
        this.childNavLinks.forEach((a) => {
          a.classList.remove(classes.isActive);
        });

        var el = this.childNavLinks[index];
        el.classList.add(classes.isActive);

        if (!this.args.childNavScroller) {
          return;
        }

        if (this.args.childVertical) {
          var elTop = el.offsetTop;
          this.args.childNavScroller.scrollTop = elTop - 100;
        } else {
          var elLeft = el.offsetLeft;
          this.args.childNavScroller.scrollLeft = elLeft - 100;
        }
        if (window.outerWidth < 901) {
          var elLeft = el.offsetLeft;
          this.args.childNavScroller.scrollLeft = elLeft - 100;
        }
      },

      arrowClick: function (evt) {
        if (
          evt.currentTarget.classList.contains("product__thumb-arrow--prev")
        ) {
          this.slideshow.previous();
        } else {
          this.slideshow.next();
        }
      },
    });

    return slideshow;
  })();

  theme.HeroSection = (function () {
    function HeroSection(container) {
      this.container = container;
      var sectionId = container.getAttribute("data-section-id");
      this.slideshow = container.querySelector("#HeroSlider-" + sectionId);
      this.namespace = "." + sectionId;

      this.initialIndex = 0;
      if (!this.slideshow) {
        return;
      }
      // Get shopify-created div that section markup lives in,
      // then get index of it inside its parent
      var sectionEl = container.parentElement;
      var sectionIndex = [].indexOf.call(
        sectionEl.parentElement.children,
        sectionEl
      );

      if (sectionIndex === 0) {
        this.init();
      } else {
        theme.initWhenVisible({
          element: this.container,
          callback: this.init.bind(this),
        });
      }
    }

    HeroSection.prototype = Object.assign({}, HeroSection.prototype, {
      init: function () {
        var slides = this.slideshow.querySelectorAll(".hero-slide");

        if (slides.length > 1) {
          var sliderArgs = {
            prevNextButtons: this.slideshow.hasAttribute("data-arrows"),
            pageDots: this.slideshow.hasAttribute("data-dots"),
            fade: true,
            lazyLoad: true,
            setGallerySize: false,
            initialIndex: this.initialIndex,
            autoPlay:
              this.slideshow.dataset.autoplay === "true"
                ? parseInt(this.slideshow.dataset.speed)
                : false,
          };

          this.flickity = new theme.Slideshow(this.slideshow, sliderArgs);
        } else {
          // Add loaded class to first slide
          slides[0].classList.add("is-selected");
        }
      },

      forceReload: function () {
        this.onUnload();
        this.init();
      },

      onUnload: function () {
        if (this.flickity && typeof this.flickity.destroy === "function") {
          this.flickity.destroy();
        }
      },

      onDeselect: function () {
        if (this.flickity && typeof this.flickity.play === "function") {
          this.flickity.play();
        }
      },

      onBlockSelect: function (evt) {
        var slide = this.slideshow.querySelector(
          ".hero__slide--" + evt.detail.blockId
        );
        var index = parseInt(slide.dataset.index);

        if (this.flickity && typeof this.flickity.pause === "function") {
          this.flickity.goToSlide(index);
          this.flickity.pause();
        } else {
          // If section reloads, slideshow might not have been setup yet, wait a second and try again
          this.initialIndex = index;
          setTimeout(
            function () {
              if (this.flickity && typeof this.flickity.pause === "function") {
                this.flickity.pause();
              }
            }.bind(this),
            1000
          );
        }
      },

      onBlockDeselect: function () {
        if (this.flickity && typeof this.flickity.play === "function") {
          if (this.flickity.args.autoPlay) {
            this.flickity.play();
          }
        }
      },
    });

    return HeroSection;
  })();

  theme.announcementBar = (function () {
    var args = {
      autoPlay: 5000,
      avoidReflow: true,
      adaptiveHeight: true,
      prevNextButtons: true,
      cellAlign: theme.config.rtl ? "right" : "left",
      fade: true,
    };
    var bar;
    var flickity;

    function init() {
      bar = document.getElementById("AnnouncementSlider");
      if (!bar) {
        return;
      }

      unload();

      if (bar.dataset.blockCount === 1) {
        return;
      }

      flickity = new theme.Slideshow(bar, args);
    }

    // Go to slide if selected in the editor
    function onBlockSelect(id) {
      var slide = bar.querySelector("#AnnouncementSlide-" + id);
      var index = parseInt(slide.dataset.index);

      if (flickity && typeof flickity.pause === "function") {
        flickity.goToSlide(index);
        flickity.pause();
      }
    }

    function onBlockDeselect() {
      if (flickity && typeof flickity.play === "function") {
        flickity.play();
      }
    }

    function unload() {
      if (flickity && typeof flickity.destroy === "function") {
        flickity.destroy();
      }
    }

    return {
      init: init,
      onBlockSelect: onBlockSelect,
      onBlockDeselect: onBlockDeselect,
      unload: unload,
    };
  })();

  theme.AnnouncementSection = (function () {
    function AnnouncementSection(container) {
      this.container = container;
      this.sectionId = this.container.getAttribute("data-section-id");
      this.init();
    }

    AnnouncementSection.prototype = Object.assign(
      {},
      AnnouncementSection.prototype,
      {
        init: function () {
          theme.announcementBar.init();
        },

        onBlockSelect: function (evt) {
          theme.announcementBar.onBlockSelect(evt.detail.blockId);
        },

        onBlockDeselect: function () {
          theme.announcementBar.onBlockDeselect();
        },

        onUnload: function () {
          theme.announcementBar.unload();
        },
      }
    );

    return AnnouncementSection;
  })();

  theme.FeaturedCollection = (function () {

    var defaults = {
      adaptiveHeight: true,
      avoidReflow: true,
      pageDots: false,
      prevNextButtons: true,
      groupCells: true,
      lazyLoad: 4,
      cellAlign: "left",
      wrapAround: false,
    };

    function FeaturedCollection(container) {
      this.container = container;
      this.timeout;
      var sectionId = container.getAttribute("data-section-id");
      this.slideshow = container.querySelector(
        "#CollectionSlider-" + sectionId
      );
      this.namespace = ".collectionSlider-" + sectionId;
      
      

      if(!document.querySelector(".main-featured-collection").classList.contains('featured-collection-jewel') && !document.querySelector(".main-featured-collection").classList.contains('featured-collection-food')){
        if (!this.slideshow) {
        return;
      }
    }
    

      theme.initWhenVisible({
        element: this.container,
        callback: this.init.bind(this),
        threshold: 600,
      });
    }

    FeaturedCollection.prototype = Object.assign(
      {},
      FeaturedCollection.prototype,
      {
        init: function () {
          // Do not wrap when only a few blocks
          if(!document.querySelector(".main-featured-collection").classList.contains('featured-collection-jewel') && !document.querySelector(".main-featured-collection").classList.contains('featured-collection-food')){
          if (this.slideshow.dataset.count <= 3) {
            defaults.wrapAround = false;
          }

          this.flickity = new theme.Slideshow(this.slideshow, defaults);

          // Autoscroll to next slide on load to indicate more blocks
          // if (this.slideshow.dataset.count > 2) {
          //   this.timeout = setTimeout(function() {
          //     this.flickity.goToSlide(0);
          //   }.bind(this), 1000);
          // } 
        }

          var var_click = document.querySelectorAll(".main-featured-collection .collection_link");
          for(var i=0; i < var_click.length; i++) {
              var_click[i].addEventListener("click", function(){
                      var collection_handle = this.id;
                      for(var j = 0; j < var_click.length; j++) {
                        var_click[j].classList.remove('active_tab');
                      }
                      this.classList.add('active_tab');
      
                     var child_list = document.querySelectorAll(".main-featured-collection .featured-collection-items-wrapper");
                      for(var j = 0; j < child_list.length; j++) {
                        child_list[j].classList.add('is-hidden');
                      }
                      document.querySelector('.' + collection_handle).classList.remove('is-hidden');	

                      if(document.querySelector(".featured-collection-jewel .link-button")){
                      var collection_url = this.dataset.url;
                      document.querySelector(".featured-collection-jewel .link-button").href = collection_url;
                      }

                      if(document.querySelector(".featured-collection-food .food_view_all_btn")){
                        var collection_url = this.dataset.url;
                        document.querySelector(".featured-collection-food .food_view_all_btn").href = collection_url;
                      }
              });
            } 
        },

        onUnload: function () {
          if (this.flickity && typeof this.flickity.destroy === "function") {
            this.flickity.destroy();
          }
        },

        onDeselect: function () {
          if (this.flickity && typeof this.flickity.play === "function") {
            this.flickity.pause();
          }
        },

        onBlockSelect: function (evt) {
          var slide = this.slideshow.querySelector(
            ".collection-slide--" + evt.detail.blockId
          );
          var index = parseInt(slide.dataset.index);

          clearTimeout(this.timeout);

          if (this.flickity && typeof this.flickity.pause === "function") {
            this.flickity.goToSlide(index);
            this.flickity.pause();
          }
        },

        onBlockDeselect: function () {
          if (this.flickity && typeof this.flickity.play === "function") {
            this.flickity.pause();
          }
        },
      }
    );

    return FeaturedCollection;
  })();

  theme.ReviewsSection = (function () {
    function ReviewsSection(container) {
      this.container = container;
      this.timeout;
      var sectionId = container.getAttribute("data-section-id");
      this.slideshow = container.querySelector("#ReviewsSlider-" + sectionId);
      this.namespace = ".reviewsSlider-" + sectionId;

      if (!this.slideshow) {
        return;
      }

      theme.initWhenVisible({
        element: this.container,
        callback: this.init.bind(this),
        threshold: 600,
      });
    }

    ReviewsSection.prototype = Object.assign({}, ReviewsSection.prototype, {
      init: function () {
        var slides = this.slideshow.querySelectorAll(".slideshow__slide");
        if (slides.length > 1) {
          var sliderArgs = {
            prevNextButtons: this.slideshow.hasAttribute("data-arrows"),
            pageDots: this.slideshow.hasAttribute("data-dots"),
            groupCells: true,
            cellAlign: "left",
            avoidReflow: true,
            wrapAround: true,
            autoPlay:
              this.slideshow.dataset.autoplay === "true"
                ? parseInt(this.slideshow.dataset.speed)
                : false,
          };
        }
        // Do not wrap when only a few blocks
        if (this.slideshow.dataset.count <= 3) {
          sliderArgs.wrapAround = false;
        }

        this.flickity = new theme.Slideshow(this.slideshow, sliderArgs);

        // Autoscroll to next slide on load to indicate more blocks
        if (this.slideshow.dataset.count > 2) {
          this.timeout = setTimeout(
            function () {
              this.flickity.goToSlide(0);
            }.bind(this),
            1000
          );
        }
      },

      onUnload: function () {
        if (this.flickity && typeof this.flickity.destroy === "function") {
          this.flickity.destroy();
        }
      },

      onDeselect: function () {
        if (this.flickity && typeof this.flickity.play === "function") {
          this.flickity.play();
        }
      },

      onBlockSelect: function (evt) {
        var slide = this.slideshow.querySelector(
          ".review-slide--" + evt.detail.blockId
        );
        var index = parseInt(slide.dataset.index);

        clearTimeout(this.timeout);

        if (this.flickity && typeof this.flickity.pause === "function") {
          this.flickity.goToSlide(index);
          this.flickity.pause();
        }
      },

      onBlockDeselect: function () {
        if (this.flickity && typeof this.flickity.play === "function") {
          this.flickity.play();
        }
      },
    });

    return ReviewsSection;
  })();

  theme.LogosSection = (function () {
    function LogosSection(container) {
      this.container = container;
      this.timeout;
      var sectionId = container.getAttribute("data-section-id");
      this.slideshow = container.querySelector("#LogosSlider-" + sectionId);
      this.namespace = ".logosSlider-" + sectionId;

      if (!this.slideshow) {
        return;
      }

      theme.initWhenVisible({
        element: this.container,
        callback: this.init.bind(this),
        threshold: 600,
      });
    }

    LogosSection.prototype = Object.assign({}, LogosSection.prototype, {
      init: function () {
        var slides = this.slideshow.querySelectorAll(".slideshow__slide");
        if (slides.length > 1) {
          var sliderArgs = {
            prevNextButtons: this.slideshow.hasAttribute("data-arrows"),
            pageDots: this.slideshow.hasAttribute("data-dots"),
            groupCells: true,
            cellAlign: "left",
            avoidReflow: true,
            wrapAround: true,
            autoPlay:
              this.slideshow.dataset.autoplay === "true"
                ? parseInt(this.slideshow.dataset.speed)
                : false,
          };
        }
        // Do not wrap when only a few blocks
        if (this.slideshow.dataset.count <= 3) {
          sliderArgs.wrapAround = false;
        }


        this.flickity = new theme.Slideshow(this.slideshow, sliderArgs);

                // Autoscroll to next slide on load to indicate more blocks
                if (this.slideshow.dataset.count > 2) {
                  this.timeout = setTimeout(
                    function () {
                      this.flickity.goToSlide(0);
                    }.bind(this),
                    1000
                  );
                }

      },

      onUnload: function () {
        if (this.flickity && typeof this.flickity.destroy === "function") {
          this.flickity.destroy();
        }
      },

      onDeselect: function () {
        if (this.flickity && typeof this.flickity.play === "function") {
          this.flickity.play();
        }
      },

      onBlockSelect: function (evt) {
        var slide = this.slideshow.querySelector(
          ".logo-slide--" + evt.detail.blockId
        );
        var index = parseInt(slide.dataset.index);

        clearTimeout(this.timeout);

        if (this.flickity && typeof this.flickity.pause === "function") {
          this.flickity.goToSlide(index);
          this.flickity.pause();
        }
      },

      onBlockDeselect: function () {
        if (this.flickity && typeof this.flickity.play === "function") {
          this.flickity.play();
        }
      },
    });

    return LogosSection;
  })();

  theme.TestimonialSection = (function () {
    function TestimonialSection(container) {
      this.container = container;
      var sectionId = container.getAttribute("data-section-id");
      this.slideshow = container.querySelector(
        "#TestimonialSlider-" + sectionId
      );
      this.namespace = "." + sectionId;

      this.initialIndex = 0;
      if (!this.slideshow) {
        return;
      }
      // Get shopify-created div that section markup lives in,
      // then get index of it inside its parent
      var sectionEl = container.parentElement;
      var sectionIndex = [].indexOf.call(
        sectionEl.parentElement.children,
        sectionEl
      );

      if (sectionIndex === 0) {
        this.init();
      } else {
        theme.initWhenVisible({
          element: this.container,
          callback: this.init.bind(this),
        });
      }
    }

    TestimonialSection.prototype = Object.assign(
      {},
      TestimonialSection.prototype,
      {
        init: function () {
          var slides = this.slideshow.querySelectorAll(".slideshow__slide");

          if (slides.length > 1) {
            var sliderArgs = {
              prevNextButtons: this.slideshow.hasAttribute("data-arrows"),
              pageDots: this.slideshow.hasAttribute("data-dots"),
              fade: true,
              lazyLoad: true,
              imagesLoaded: true,
              initialIndex: this.initialIndex,
              autoPlay:
                this.slideshow.dataset.autoplay === "true"
                  ? parseInt(this.slideshow.dataset.speed)
                  : false,
            };

            this.flickity = new theme.Slideshow(this.slideshow, sliderArgs);
          } else {
            // Add loaded class to first slide
            slides[0].classList.add("is-selected");
          }
        },

        forceReload: function () {
          this.onUnload();
          this.init();
        },

        onUnload: function () {
          if (this.flickity && typeof this.flickity.destroy === "function") {
            this.flickity.destroy();
          }
        },

        onDeselect: function () {
          if (this.flickity && typeof this.flickity.play === "function") {
            this.flickity.play();
          }
        },

        onBlockSelect: function (evt) {
          var slide = this.slideshow.querySelector(
            ".testimonial-slide--" + evt.detail.blockId
          );
          var index = parseInt(slide.dataset.index);

          if (this.flickity && typeof this.flickity.pause === "function") {
            this.flickity.goToSlide(index);
            this.flickity.pause();
          } else {
            // If section reloads, slideshow might not have been setup yet, wait a second and try again
            this.initialIndex = index;
            setTimeout(
              function () {
                if (
                  this.flickity &&
                  typeof this.flickity.pause === "function"
                ) {
                  this.flickity.pause();
                }
              }.bind(this),
              1000
            );
          }
        },

        onBlockDeselect: function () {
          if (this.flickity && typeof this.flickity.play === "function") {
            if (this.flickity.args.autoPlay) {
              this.flickity.play();
            }
          }
        },
      }
    );

    return TestimonialSection;
  })();

  theme.BlogSection = (function () {
    function BlogSection(container) {
      this.container = container;
      this.timeout;
      var sectionId = container.getAttribute("data-section-id");
      this.slideshow = container.querySelector("#BlogSlider-" + sectionId);
      this.namespace = ".blogSlider-" + sectionId;

      if (!this.slideshow) {
        return;
      }

      theme.initWhenVisible({
        element: this.container,
        callback: this.init.bind(this),
        threshold: 600,
      });
    }

    BlogSection.prototype = Object.assign({}, BlogSection.prototype, {
      init: function () {
        var slides = this.slideshow.querySelectorAll(".slideshow__slide");
        if (slides.length > 1) {
          var sliderArgs = {
            prevNextButtons: this.slideshow.hasAttribute("data-arrows"),
            pageDots: this.slideshow.hasAttribute("data-dots"),
            groupCells: true,
            cellAlign: "left",
            lazyLoad: 3,
            avoidReflow: true,
            wrapAround: true,
            autoPlay:
              this.slideshow.dataset.autoplay === "true"
                ? parseInt(this.slideshow.dataset.speed)
                : false,
          };
        }
        // Do not wrap when only a few blocks
        if (this.slideshow.dataset.count <= 3) {
          sliderArgs.wrapAround = false;
        }

        this.flickity = new theme.Slideshow(this.slideshow, sliderArgs);

        // Autoscroll to next slide on load to indicate more blocks
        if (this.slideshow.dataset.count > 2) {
          this.timeout = setTimeout(
            function () {
              this.flickity.goToSlide(0);
            }.bind(this),
            1000
          );
        }
      },

      onUnload: function () {
        if (this.flickity && typeof this.flickity.destroy === "function") {
          this.flickity.destroy();
        }
      },

      onDeselect: function () {
        if (this.flickity && typeof this.flickity.play === "function") {
          this.flickity.play();
        }
      },

      onBlockSelect: function (evt) {
        var slide = this.slideshow.querySelector(
          ".blog-slide--" + evt.detail.blockId
        );
        var index = parseInt(slide.dataset.index);

        clearTimeout(this.timeout);

        if (this.flickity && typeof this.flickity.pause === "function") {
          this.flickity.goToSlide(index);
          this.flickity.pause();
        }
      },

      onBlockDeselect: function () {
        if (this.flickity && typeof this.flickity.play === "function") {
          this.flickity.play();
        }
      },
    });

    return BlogSection;
  })();

  theme.ImageTextSection = (function () {
    function ImageTextSection(container) {
      this.container = container;
      this.timeout;
      var sectionId = container.getAttribute("data-section-id");
      this.slideshow = container.querySelector("#ImageTextSlider-" + sectionId);
      this.namespace = ".imageTextSlider-" + sectionId;

      if (!this.slideshow) {
        return;
      }

      theme.initWhenVisible({
        element: this.container,
        callback: this.init.bind(this),
        threshold: 600,
      });
    }

    ImageTextSection.prototype = Object.assign({}, ImageTextSection.prototype, {
      init: function () {
        var slides = this.slideshow.querySelectorAll(".slideshow__slide");
        if (slides.length > 1) {
          var sliderArgs = {
            prevNextButtons: false,
            pageDots: true,
            adaptiveHeight: true,
          };
        }

        this.flickity = new theme.Slideshow(this.slideshow, sliderArgs);

        // Autoscroll to next slide on load to indicate more blocks
        if (this.slideshow.dataset.count > 1) {
          this.timeout = setTimeout(
            function () {
              this.flickity.goToSlide(0);
            }.bind(this),
            1000
          );
        }
      },

      onUnload: function () {
        if (this.flickity && typeof this.flickity.destroy === "function") {
          this.flickity.destroy();
        }
      },

      onDeselect: function () {
        if (this.flickity && typeof this.flickity.play === "function") {
          this.flickity.play();
        }
      },

      onBlockSelect: function (evt) {
        var slide = this.slideshow.querySelector(
          ".image__slide--" + evt.detail.blockId
        );
        var index = parseInt(slide.dataset.index);

        clearTimeout(this.timeout);

        if (this.flickity && typeof this.flickity.pause === "function") {
          this.flickity.goToSlide(index);
          this.flickity.pause();
        }
      },

      onBlockDeselect: function () {
        if (this.flickity && typeof this.flickity.play === "function") {
          this.flickity.play();
        }
      },
    });

    return ImageTextSection;
  })();

  theme.Product = (function () {
    var classes = {
      hidden: "hide",
    };

    var selectors = {
      slide: ".product-main-slide",
      currentSlide: ".is-selected",
      startingSlide: ".starting-slide",
    };

    function Product(container) {
      this.container = container;
      var sectionId = (this.sectionId =
        container.getAttribute("data-section-id"));
      var blockId = (this.sectionId = container.getAttribute("data-block-id"));

      if (this.sectionId != "") {
        this.settings = {
          namespace: ".product-" + sectionId,
          hasImages: true,
          imageSetName: null,
          imageSetIndex: null,
          currentImageSet: null,
          imageSize: "620x",
          currentSlideIndex: 0,
        };

        this.selectors = {
          media: "[data-product-media-type-model]",
          closeMedia: ".product-single__close-media",
          photoThumbs: ".product__thumb-" + sectionId,
          thumbSlider: "#ProductThumbs-" + sectionId,
          thumbScroller: ".product__thumbs--scroller",
          mainSlider: "#ProductPhotos-" + blockId,
          imageContainer: "[data-product-images]",
          productImageMain: ".product-image-main--" + sectionId,
        };

        this.cacheElements();
        if (this.cache.mainSlider && this.cache.mainSlider.querySelector("img")) {
            
          this.firstProductImage = this.cache.mainSlider.querySelector("img");
        }

        if (!this.firstProductImage) {
          this.settings.hasImages = false;
        }

        var dataSetEl = this.cache.mainSlider.querySelector("[data-set-name]");
        if (dataSetEl) {
          this.settings.imageSetName = dataSetEl.dataset.setName;
        }

        this.init();
      }
    }

    Product.prototype = Object.assign({}, Product.prototype, {
      init: function () {
        if (!this.inModal) {
          this.formSetup();
          this.initProductSlider();
          //this.customMediaListners();
        }
      },

      cacheElements: function () {
        this.cache = {
          form: this.container.querySelector(this.selectors.form),
          mainSlider: this.container.querySelector(this.selectors.mainSlider),
          thumbSlider: this.container.querySelector(this.selectors.thumbSlider),
          thumbScroller: this.container.querySelector(
            this.selectors.thumbScroller
          ),
          productImageMain: this.container.querySelector(
            this.selectors.productImageMain
          ),
        };
      },

      formSetup: function () {
        // We know the current variant now so setup image sets
        if (this.settings.imageSetName) {
          this.updateImageSet();
        }
      },

      imageSetArguments: function (variant) {
        var variant = variant
          ? variant
          : this.variants
          ? this.variants.currentVariant
          : null;
        if (!variant) return;

        var setValue = (this.settings.currentImageSet = this.getImageSetName(
          variant[this.settings.imageSetIndex]
        ));
        var set = this.settings.imageSetName + "_" + setValue;

        // Always start on index 0
        this.settings.currentSlideIndex = 0;

        // Return object that adds cellSelector to mainSliderArgs
        return {
          cellSelector: '[data-group="' + set + '"]',
          imageSet: set,
          initialIndex: this.settings.currentSlideIndex,
        };
      },

      updateImageSet: function (evt) {
        // If called directly, use current variant
        var variant = evt
          ? evt.detail.variant
          : this.variants
          ? this.variants.currentVariant
          : null;
        if (!variant) {
          return;
        }

        var setValue = this.getImageSetName(
          variant[this.settings.imageSetIndex]
        );

        // Already on the current image group
        if (this.settings.currentImageSet === setValue) {
          return;
        }

        this.initProductSlider(variant);
      },

      // Show/hide thumbnails based on current image set
      updateImageSetThumbs: function (set) {
        this.cache.thumbSlider
          .querySelectorAll(".product__thumb-item")
          .forEach((thumb) => {
            thumb.classList.toggle(classes.hidden, thumb.dataset.group !== set);
          });
      },

      getImageSetName: function (string) {
        return string
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/-$/, "")
          .replace(/^-/, "");
      },

      /*============================================================================
        Product images
      ==============================================================================*/
      initProductSlider: function (variant) {
        // Stop if only a single image, but add active class to first slide
        if (
          this.cache.mainSlider.querySelectorAll(selectors.slide).length <= 1
        ) {
          var slide = this.cache.mainSlider.querySelector(selectors.slide);
          if (slide) {
            slide.classList.add("is-selected");
          }
          return;
        }

        // Destroy slider in preparation of new initialization
        if (this.flickity && typeof this.flickity.destroy === "function") {
          this.flickity.destroy();
        }

        // If variant argument exists, slideshow is reinitializing because of the
        // image set feature enabled and switching to a new group.
        // currentSlideIndex
        if (!variant) {
          var activeSlide = this.cache.mainSlider.querySelector(
            selectors.startingSlide
          );
          this.settings.currentSlideIndex = this._slideIndex(activeSlide);
        }

        var mainSliderArgs = {
          adaptiveHeight: true,
          avoidReflow: true,
          lazyLoad: 1,
          initialIndex: this.settings.currentSlideIndex,
          childNav: this.cache.thumbSlider,
          childNavScroller: this.cache.thumbScroller,
          childVertical: this.cache.thumbSlider.dataset.position === "beside",
          pageDots: false, // mobile only with CSS
          prevNextButtons: true,
          wrapAround: true,
          callbacks: {
            onChange: this.onSlideChange.bind(this),
          },
        };

        // Override default settings if image set feature enabled
        if (this.settings.imageSetName) {
          var imageSetArgs = this.imageSetArguments(variant);
          mainSliderArgs = Object.assign({}, mainSliderArgs, imageSetArgs);
          this.updateImageSetThumbs(mainSliderArgs.imageSet);
        }

        this.flickity = new theme.Slideshow(
          this.cache.mainSlider,
          mainSliderArgs
        );
      },

      onSlideChange: function (index) {
        if (!this.flickity) return;

        var prevSlide = this.cache.mainSlider.querySelector(
          '.product-main-slide[data-index="' +
            this.settings.currentSlideIndex +
            '"]'
        );

        stopVideos();
        // If previous slide has a video, pause it
        // prevSlide.querySelector('video')?.pause();
        // If previous slide has a youtube video, pause it
        // prevSlide.querySelector('.external_video iframe')?.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');

        // If imageSetName exists, use a more specific selector
        var nextSlide = this.settings.imageSetName
          ? this.cache.mainSlider.querySelectorAll(
              ".flickity-slider .product-main-slide"
            )[index]
          : this.cache.mainSlider.querySelector(
              '.product-main-slide[data-index="' + index + '"]'
            );

        this.flickity.slideshow.cells.forEach((slide) => {
          slide.element.querySelectorAll("a").forEach((sliderLink) => {
            sliderLink.tabIndex = -1;
          });
        });
        this.flickity.slideshow.cells[index].element
          .querySelectorAll("a")
          .forEach((sliderLink) => {
            sliderLink.tabIndex = 0;
          });

        // Update current slider index
        this.settings.currentSlideIndex = index;
      },

      _slideIndex: function (el) {
        return el.getAttribute("data-index");
      },

      mediaLoaded: function (evt) {
        this.container
          .querySelectorAll(this.selectors.closeMedia)
          .forEach((el) => {
            el.classList.remove(classes.hidden);
          });

        if (this.flickity) {
          this.flickity.setDraggable(false);
        }
      },

      mediaUnloaded: function (evt) {
        this.container
          .querySelectorAll(this.selectors.closeMedia)
          .forEach((el) => {
            el.classList.add(classes.hidden);
          });

        if (this.flickity) {
          this.flickity.setDraggable(true);
        }
      },

      onUnload: function () {
        // theme.ProductMedia.removeSectionModels(this.sectionId);

        if (this.flickity && typeof this.flickity.destroy === "function") {
          this.flickity.destroy();
        }
      },
    });

    return Product;
  })();

  theme.FeaturedProduct = (function () {
    function FeaturedProduct(container) {
      this.container = container;
      this.timeout;
      var sectionId = container.getAttribute("data-section-id");
      // this.slideshow = container.querySelector('#FeaturedProductSlider-' + sectionId);
      this.namespace = ".featuredProduct-" + sectionId;

      if (!this.slideshow) {
        return;
      }

      theme.initWhenVisible({
        element: this.container,
        callback: this.init.bind(this),
        threshold: 600,
      });
    }

    FeaturedProduct.prototype = Object.assign({}, FeaturedProduct.prototype, {
      init: function () {
        var slides = this.slideshow.querySelectorAll(".slideshow__slide");
        if (slides.length >= 1) {
          var sliderArgs = {
            prevNextButtons: false,
            draggable: false,
            pageDots: true,
          };
        }

        this.flickity = new theme.Slideshow(this.slideshow, sliderArgs);

        // Autoscroll to next slide on load to indicate more blocks
        // if (this.slideshow.dataset.count > 1) {
        //   this.timeout = setTimeout(function() {
        //     this.flickity.goToSlide(0);
        //   }.bind(this), 1000);
        // }
      },

      onUnload: function () {
        if (this.flickity && typeof this.flickity.destroy === "function") {
          this.flickity.destroy();
        }
      },

      onDeselect: function () {
        if (this.flickity && typeof this.flickity.play === "function") {
          this.flickity.pause();
        }
      },

      onBlockSelect: function (evt) {
        var slide = this.slideshow.querySelector(
          ".featuredProduct__slide--" + evt.detail.blockId
        );
        var index = parseInt(slide.dataset.index);

        clearTimeout(this.timeout);

        if (this.flickity && typeof this.flickity.pause === "function") {
          this.flickity.goToSlide(index);
          this.flickity.pause();
        }
      },

      onBlockDeselect: function () {
        if (this.flickity && typeof this.flickity.play === "function") {
          this.flickity.pause();
        }
      },
    });

    return FeaturedProduct;
  })();

  function DOMready(callback) {
    if (document.readyState != "loading") callback();
    else document.addEventListener("DOMContentLoaded", callback);
  }

  DOMready(function () {
    theme.sections = new theme.Sections();
    theme.sections.register("newsletter-popup", theme.NewsletterPopup);
    theme.sections.register("hero-section", theme.HeroSection);
    theme.sections.register("announcement-section", theme.AnnouncementSection);
    theme.sections.register("featured-collection", theme.FeaturedCollection);
    theme.sections.register("reviews-section", theme.ReviewsSection);
    theme.sections.register("logos-section", theme.LogosSection);
    theme.sections.register("testimonial-section", theme.TestimonialSection);
    theme.sections.register("blog-section", theme.BlogSection);
    theme.sections.register("image-with-text-section", theme.ImageTextSection);
    theme.sections.register("product", theme.Product);
    theme.sections.register("featured-product", theme.FeaturedProduct);
    document.dispatchEvent(new CustomEvent("page:loaded"));

    if (Shopify.designMode) {
      document.addEventListener("shopify:section:load", function (event) {
        var productRecommendationsSection = document.querySelector(
          ".product-slider-main"
        );
        if (productRecommendationsSection === null) {
          return;
        }
        const myTimeout = setTimeout(function () {
          // if (!!document.querySelector('.product-slider-main')) {
          //   var elemProductSliderMain = document.querySelector('.product-slider-main');
          //   var productSliderMainFlkty = new Flickity(elemProductSliderMain);
          //   productSliderMainFlkty.resize();
          // }

          /* resize all product gallery sliders when a change is made in Shopify.designMode*/
          var sliders = document.querySelectorAll('.product-slider-main, [id^="ProductPhotos-"]');
          if (sliders.length > 0) {
            sliders.forEach(function(slider) {
              var tempVariable = new Flickity(slider);
              tempVariable.resize();
            });
          }

        }, 300);
      });
    }
  });
})();
