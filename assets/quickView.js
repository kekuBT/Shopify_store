class VariantSelectsQuickview extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("change", this.onQuickViewVariantChange);
  }
  onQuickViewVariantChange(event) {
    this.updateInputStatus(event);
    this.updateOptions();
    this.updateMasterId();
    this.addtocart_btnUpdated();
    this.updatePrice_quickview();
    // this.updateMediaPrice();
    document.querySelector('.quick-view_grid [name="id"]').value = this.currentVariant.id;
  }
  updatePrice_quickview() {
    if (this.currentVariant != undefined) {
      if (
        this.currentVariant != "undefined" ||
        this.currentVariant != undefined ||
        this.currentVariant != null ||
        this.currentVariant != ""
      ) {
        var price_cal = this.currentVariant.price;
        var unit_price_cal = this.currentVariant.unit_price;
        var compare_price_cal = this.currentVariant.compare_at_price;
        var symboll = window.shop_symbol;
        if (document.querySelector('[name="country_code"]') != null) {
          symboll = document
            .querySelector('[name="country_code"]')
            .getAttribute("symbol");
        }
        price_cal = Shopify.formatMoney(price_cal);
        if (unit_price_cal != undefined) {
          var referal = "";
          if (this.currentVariant.unit_price_measurement.reference_value != 1) {
            referal =
              this.currentVariant.unit_price_measurement.reference_value +
              this.currentVariant.unit_price_measurement.reference_unit;
          } else {
            referal = this.currentVariant.unit_price_measurement.reference_unit;
          }
          document
            .querySelector(".quick_view_price small.unit-price")
            .classList.remove("is-hidden");
          document.querySelector(".quick_view_price [unit_price]").innerHTML =
            Shopify.formatMoney(unit_price_cal);
          document.querySelector(
            ".quick_view_price [refereal_unit]"
          ).innerHTML = referal;
        } else {
          document
            .querySelector(".quick_view_price small.unit-price")
            .classList.add("is-hidden");
        }
        document.querySelector(".quick_view_price [regular-price]").innerHTML =
          price_cal;
        document.querySelector(
          ".quick_view_price [regular-price-sale]"
        ).innerHTML = price_cal;
        if (compare_price_cal != null) {
          compare_price_cal = Shopify.formatMoney(compare_price_cal);
          document.querySelector(
            ".quick_view_price [regular-price-compare]"
          ).innerHTML = compare_price_cal;
          document.querySelector(
            ".quick_view_price [regular-price-compare]"
          ).style.opacity = "1";
        } else {
          document.querySelector(
            ".quick_view_price [regular-price-compare]"
          ).style.opacity = "0";
        }
      }
    }
  }
  addtocart_btnUpdated() {

    var elemSubmitBtn = document.querySelector(".quick-view_grid button.product-form___submit");

    var add_to_cart = elemSubmitBtn.dataset.add_to_cart;
    var sold_out = elemSubmitBtn.dataset.sold_out;

    if (this.currentVariant != undefined) {
      if (this.currentVariant.available == false) {
        elemSubmitBtn.setAttribute('disabled','disabled');
        elemSubmitBtn.textContent = sold_out;
      } else {
        elemSubmitBtn.removeAttribute('disabled');
        elemSubmitBtn.textContent = add_to_cart;
      }
    } else {
      elemSubmitBtn.setAttribute('disabled','disabled');
      elemSubmitBtn.textContent = sold_out;
    }
  }
  updateOptions() {
    this.options = Array.from(
      this.querySelectorAll("select"),
      (select) => select.value
    );
  }

  updateInputStatus(event) {
    const changedRadioButton = event.target.closest('fieldset.quickview-form__input input[type="radio"]');
    if ( !changedRadioButton ) return; //do nothing
    
    var changedRadioButtonName = changedRadioButton.name;
    var changedRadioButtonId = changedRadioButton.id;

    quickViewModal.querySelectorAll(`fieldset[data_options="${changedRadioButtonName}"] label`).forEach(function(label) {
      label.classList.remove('selected');
    });

    quickViewModal.querySelector(`label[for="${changedRadioButtonId}"]`).classList.add('selected');

    var selectedVariantsArray = [];
    quickViewModal.querySelectorAll('label.selected').forEach(function(label) {
      selectedVariantsArray.push(label.getAttribute('value'))
    });
    var selectedVariantsText = selectedVariantsArray.join(' / ');

    quickViewModal.querySelector('.quickView_variant-info p').innerText = selectedVariantsText;

    quickViewModal.querySelector(`fieldset[data_options="${changedRadioButtonName}"] .variant__label-info span`).innerText = changedRadioButton.value;

    var select_img = changedRadioButton.parentElement.dataset.imageSrc;

    if (select_img != 'undefined' && select_img != '' && select_img != null) {
      quickViewModal.querySelector('.quick-view_image img').src = select_img;
    }

    const sectionId = 'quick-view-template';
    const productId = document.querySelector('[data-quick-view-inventory-list]').dataset.productId;
    var inventoryListElem = document.getElementById(`inventory-list-${sectionId}-${productId}`);
    var productHasOnlyDefaultVariant = inventoryListElem.dataset.hasOnlyDefaultVariant;
    setTimeout(function () {
      if (productHasOnlyDefaultVariant == 'false') {
        swatchUpdateQuickView(inventoryListElem);
      }
    }, 250);
  }
  updateMasterId() {
    this.currentVariant = this.getVariantData().find((variant) => {
      return !variant.options
        .map((option, index) => {
          return this.options[index] === option;
        })
        .includes(false);
    });
  }
  getVariantData() {
    this.variantData =
      this.variantData ||
      JSON.parse(this.querySelector('[type="application/json"]').textContent);
    return this.variantData;
  }
}
class VariantQuickview extends VariantSelectsQuickview {
  constructor() {
    super();
  }
  updateOptions() {
    const fieldsets = Array.from(this.querySelectorAll("fieldset"));
    this.options = fieldsets.map((fieldset) => {
      return Array.from(fieldset.querySelectorAll("input")).find(
        (radio) => radio.nextElementSibling.classList.contains('selected')
      ).value;
    });
  }
}
customElements.define("variant-quickview", VariantQuickview);

var quickViewModal = document.querySelector('.quick-view-model');

function initQuickView() {

  function addProductToCart(formID, metafields, productID, target) {
    window.localStorage.setItem("timer", new Date().getTime() + 10 * 60 * 1000);
      
    /* gift wrap code */
    var productOrQuickViewWrapper = document.querySelector('.quick-view_grid') || document.querySelector('.product__detail');
    if (productOrQuickViewWrapper && productOrQuickViewWrapper.querySelector('.product__wrapping') && productOrQuickViewWrapper.querySelector('#add_gift_wrapping').checked == true) {
      var gift_wrapping_container = productOrQuickViewWrapper.querySelector('.product__wrapping');
      var gift_wrapping_id = gift_wrapping_container.dataset.giftId;
      var message = gift_wrapping_container.querySelector("textarea").value;
      var product = gift_wrapping_container.dataset.giftProduct;
      var gift = {
        id: gift_wrapping_id,
        quantity: 1,
        properties: {
          _gift_wrapping_message: message,
          _gift_wrapping_product: product,
        },
      };
      var gift_data = {
        items: [],
      };
      gift_data["items"].push(gift);
    }
    fetch(window.routes.cart_add_url + '.js', {
      body: target,
      headers: {
        'X-Requested-With':'xmlhttprequest'
      },
      method: 'POST'
    }).then(function (response) {
      return response.json();
    })
    .then(function addProductToCartSuccess(response) {

      if (response.status) {
        handleErrorMessage(response.description);
        return;
      }else{
        document.querySelector('#quick-view').style.display = 'none';
        document.querySelector('#quick-view').classList.remove('active_quickView');
      }

        /* gift wrap code */
        
        if (gift_data) {
          fetch(window.routes.cart_add_url + '.js', {
            body: JSON.stringify(gift_data),
            credentials: 'same-origin',
            headers: {
              'Content-Type': 'application/json',
              'X-Requested-With':'xmlhttprequest'
            },
            method: 'POST'
          }).then(function (response) {
            return response.json();
          })
          .then(function addProductToCartSuccess(response) {
            var this_data = response;
            addToCartOk(this_data);
          });
        }else{
          var data = response;
          addToCartOk(data);
        }
  
    })
    .catch(function errorHandler(error) {
      console.warn('Something went wrong with store.js addProductToCart.', error);
    });
    if (metafields != "") {
      window.localStorage.setItem("metafields-" + productID, metafields);
    }
    return false;
  }


  function handleErrorMessage(errorMessage = false) {
    let errorMessageWrapper = document.querySelector('.product-form__error-message-wrapper');
    let this_errorMessage = errorMessageWrapper.querySelector('.product-form__error-message');
  
    errorMessageWrapper.toggleAttribute('hidden', !errorMessage);
  
    if (errorMessage) {
      this_errorMessage.textContent = errorMessage;
    }
  
  }

  document.addEventListener("click", (event) => {

    const clickedQuickViewBtn = event.target.closest('.quick_view_btn');

    if ( !clickedQuickViewBtn ) return; //do nothing

    var self = clickedQuickViewBtn;
 
    var elemCardWrapper = self.closest('.card-wrapper') ? self.closest('.card-wrapper') : self.closest('.card');
    var elemCardWrapperCheckedVariant = elemCardWrapper.querySelector('.grid-variant-input input:checked');

    if (elemCardWrapperCheckedVariant != undefined) {
      var selected_color = elemCardWrapperCheckedVariant.nextElementSibling.getAttribute('value');
    }

    let product = self.dataset.product;
    var pathname = window.location.pathname;
    var lang = pathname.split("/")[1];
    if (lang.length === 2) {
      var url = `/${lang}/products/${product}?view=quick-view`;
    } else {
      var url = `/products/${product}?view=quick-view`;
    }

    
    document.querySelector('#quick-view').style.display = '';
    document.querySelector('.loader-quickview').style.display = '';
    document.querySelector('#quick-view').dataset.productHandle = product;
    
    fetch(url).then(function (response) {
      return response.text();
    })
    .then(function fulfillHandler(data) {
        document.querySelector('.loader-quickview').style.display = 'none';
        var parser = new DOMParser();
        var dataHtml = parser.parseFromString(data, "text/html");
        var filteredData = dataHtml.querySelector('.quick-view_grid');
        
        if(document.querySelectorAll('.quick-view_grid').length){
          document.querySelectorAll('.quick-view_grid').forEach(function(item){
            item.remove();
          });
        }

        document.querySelector('#quick-view .modal-content').append(filteredData);

        if (selected_color != undefined) {
          let elemSelectedVariant = document.querySelector(`#quick-view .modal-content [value='${selected_color}']`);
          simulateClick(elemSelectedVariant);
        }

        document.querySelector('#quick-view').style.display = '';
        setTimeout(function() {
          document.querySelector('#quick-view').classList.add('active_quickView');
        },100);

        const sectionId = 'quick-view-template';
        const productId = document.querySelector('[data-quick-view-inventory-list]').dataset.productId;
        var inventoryListElem = document.getElementById(`inventory-list-${sectionId}-${productId}`);
        var productHasOnlyDefaultVariant = inventoryListElem.dataset.hasOnlyDefaultVariant;
        if (productHasOnlyDefaultVariant == 'false') {
          swatchUpdateQuickView(inventoryListElem);
        }
        
        setTimeout(function() {
          getFocusableElements(document.querySelector(".quick-view-model"));
          trapFocus(document.querySelector(".quick-view-model"), document.querySelector(".modal-content .close"));
        }, 300);

        quickViewModal.querySelector('.quantity__input').addEventListener('input', () => {
          var quickViewQtyInput = quickViewModal.querySelector('.quantity__input');
          quickViewModal.querySelector('form[data-type="add-to-cart-form"] input[name="quantity"]').value = quickViewQtyInput.value;
        });
        
    })
    .catch(function errorHandler(error) { console.warn('Something went wrong with quick view.', error) });

  });

  document.querySelector('#quick-view').addEventListener("click", (event) => {
    if (!event.target.closest('.quick-view-model')) {
      // Clicked outside the element...
      document.querySelector('#quick-view').classList.remove('active_quickView');
      let returnFocusHandle = document.getElementById("quick-view").dataset.productHandle;
      // removeTrapFocus(
      //   document.querySelector(
      //     '.quick_view_btn[data-product="' + returnFocusHandle + '"]'
      //   )
      // );
      setTimeout(function () {
        document.querySelector('.quick-view_grid').remove()
        document.querySelector('#quick-view').style.display = 'none';
      }, 800);
    }
  });

  document.querySelector('.modal-content .close').addEventListener("click", (event) => {
    document.querySelector('#quick-view').classList.remove('active_quickView');
    let returnFocusHandle = document.getElementById("quick-view").dataset.productHandle;
    // removeTrapFocus(
    //   document.querySelector(
    //     '.quick_view_btn[data-product="' + returnFocusHandle + '"]'
    //   )
    // );
    setTimeout(function () {
      document.querySelector('.quick-view_grid').remove()
      document.querySelector('#quick-view').style.display = 'none';
    }, 800);
  });

  document.addEventListener("click", (event) => {
    const clickedQuickViewAdd = event.target.closest('#quick-view_add');
    if ( !clickedQuickViewAdd ) return; //do nothing
    
    event.preventDefault();
    var self = clickedQuickViewAdd;

    var product_id = self.getAttribute('product_id');
    var metaf = self.getAttribute('metaf');

    var product_id = quickViewModal.querySelector("." + product_id).querySelector('[name="id"]').value;
    var metaf = self.getAttribute('metaf');

    var data = new FormData(self.closest("form"));
    
    addProductToCart(product_id, metaf, product_id, data);
  });
}

function swatchUpdateQuickView(inventoryListElem) {
  
  var selectedVariantValue;
  var selectedVariantOptionIndex;
  var selectedArray = [];

  document.querySelectorAll('.quick-view_grid .option-swatch').forEach(function(elemSwatch) {
    elemSwatch.classList.remove('CrossLine');
    elemSwatch.classList.remove('noCrossLine');
    elemSwatch.querySelector('input[type="radio"]').removeAttribute('disabled');
    elemSwatch.querySelector('label').removeAttribute('disabled');
  });


  // Create array ["Black", "XS"];
  document.querySelectorAll('.quick-view_grid .option-swatch input').forEach(function(elemSwatchRadio) {
    if (elemSwatchRadio.checked == true) {
      selectedVariantValue = elemSwatchRadio.value;
      selectedVariantOptionIndex = Number(elemSwatchRadio.parentElement.dataset.index)+1;
      selectedArray.push(selectedVariantValue);
    }
  });

  if (!!document.querySelector('.quickview-form__input[data-option-index="1"]') == true) {
    document.querySelectorAll('.quickview-form__input[data-option-index="1"] .option-swatch').forEach(function(optionSwatch) {
      let tempArray = selectedArray.slice();
      tempArray[0] = optionSwatch.dataset.value;
      optionSwatch.dataset.fullName = tempArray.join(' / ');
    });
  }

  if (!!document.querySelector('.quickview-form__input[data-option-index="2"]') == true) {
    document.querySelectorAll('.quickview-form__input[data-option-index="2"] .option-swatch').forEach(function(optionSwatch) {
      let tempArray = selectedArray.slice();
      tempArray[1] = optionSwatch.dataset.value;
      optionSwatch.dataset.fullName = tempArray.join(' / ');
    });
  }

  if (!!document.querySelector('.quickview-form__input[data-option-index="3"]') == true) {
    document.querySelectorAll('.quickview-form__input[data-option-index="3"] .option-swatch').forEach(function(optionSwatch) {
      let tempArray = selectedArray.slice();
      tempArray[2] = optionSwatch.dataset.value;
      optionSwatch.dataset.fullName = tempArray.join(' / ');
    });
  }

  document.querySelectorAll('.quick-view_grid .option-swatch input').forEach(function(elemSwatchRadio) {
    if (elemSwatchRadio.checked == true) {

      selectedVariantValue = elemSwatchRadio.value;
      selectedVariantOptionIndex = Number(elemSwatchRadio.parentElement.dataset.index)+1;

      inventoryListElem.querySelectorAll(`[data-option${selectedVariantOptionIndex}="${selectedVariantValue}"]`).forEach(function(matchingInventoryItem) {
        if (matchingInventoryItem.dataset.availability == "false") {
          document.querySelectorAll(`.quickview-form__input .option-swatch[data-full-name="${matchingInventoryItem.dataset.variantTitle}"]`).forEach(function(matchingSwatch) {
              matchingSwatch.classList.add('CrossLine');
              matchingSwatch.querySelector(`label`).setAttribute('disabled','disabled');
          });
        }
      });
    }
  });
}

/* clicking on quantity plus/minus buttons */
quickViewModal.addEventListener("click", (event) => {
  const clickedQuickViewQtyBtn = event.target.closest('button.quantity_box');
  if ( !clickedQuickViewQtyBtn ) return; //do nothing
  // the rest of the code (if the button was clicked)

  var quickViewQtyInput = quickViewModal.querySelector('input[name="quantity"]');
  if (clickedQuickViewQtyBtn.classList.contains('quantity__increase')) {
    quickViewQtyInput.value ++;
    quickViewModal.querySelector('form[data-type="add-to-cart-form"] input[name="quantity"]').value = quickViewQtyInput.value;
  }
  if (quickViewQtyInput.value > 1) {
    if (clickedQuickViewQtyBtn.classList.contains('quantity__decrease')) {
      quickViewQtyInput.value --;
      quickViewModal.querySelector('form[data-type="add-to-cart-form"] input[name="quantity"]').value = quickViewQtyInput.value;
    }
  }
  
});


function quickViewDocumentReady(fn) {
  if (document.readyState !== 'loading') {
    initQuickView();
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      initQuickView();
    });
  }
}
quickViewDocumentReady();

