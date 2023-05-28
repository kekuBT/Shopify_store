var Shopify = Shopify || {};
// ---------------------------------------------------------------------------
// Money format handler
// ---------------------------------------------------------------------------
var symboll = window.shop_symbol;
if (document.querySelector('[name="country_code"]') != null) {
  symboll = document
    .querySelector('[name="country_code"]')
    .getAttribute("symbol")  + "{{amount}}";;
}
if(document.querySelector('.template--cart')){
  var currentItemCount = Array.from(document.querySelector('.template--cart').querySelectorAll('[name="updates[]"]'))
  .reduce((total, quantityInput) => total + parseInt(quantityInput.value), 0);
}else{
  var currentItemCount = Array.from(document.querySelector('.cart-drawer').querySelectorAll('[name="quantity"]'))
  .reduce((total, quantityInput) => total + parseInt(quantityInput.value), 0);
}
Shopify.money_format = symboll;
Shopify.formatMoney = function (cents, format) {
  if (typeof cents == "string") {
    cents = cents.replace(".", "");
  }
  var value = "";
  var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  var formatString = format || this.money_format;

  function defaultOption(opt, def) {
    return typeof opt == "undefined" ? def : opt;
  }

  function formatWithDelimiters(number, precision, thousands, decimal) {
    precision = defaultOption(precision, 2);
    thousands = defaultOption(thousands, ",");
    decimal = defaultOption(decimal, ".");

    if (isNaN(number) || number == null) {
      return 0;
    }

    number = (number / 100.0).toFixed(precision);

    var parts = number.split("."),
      dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + thousands),
      cents = parts[1] ? decimal + parts[1] : "";
    return dollars + cents;
  }

  switch (formatString.match(placeholderRegex)[1]) {
    case "amount":
      value = formatWithDelimiters(cents, 2);
      break;
    case "amount_no_decimals":
      value = formatWithDelimiters(cents, 0);
      break;
    case "amount_with_comma_separator":
      value = formatWithDelimiters(cents, 2, ".", ",");
      break;
    case "amount_no_decimals_with_comma_separator":
      value = formatWithDelimiters(cents, 0, ".", ",");
      break;
  }

  return formatString.replace(placeholderRegex, value);
};
var languageRoot = Shopify.routes.root;
var languageRootRemovedLastSlash = languageRoot.slice(0,languageRoot.length-1);
const cartItem = `<div data-product="%VARIANT_ID%" data-gift-product="%giftProduct%" class="columns is-multiline is-mobile is-marginless cart-drawer__products item-%PRODUCT_ID% shopItem">
      <div class="column is-4-desktop is-4-tablet is-3-mobile productImage">
          <a href="${languageRootRemovedLastSlash}/products/%HANDLE%" aria-label="Product link">%PRODUCT_IMAGE%</a>
      </div>
      <div class="column is-8-desktop is-8-tablet is-8-mobile">
        <div class="cart__drawer--title">
          <a href="${languageRootRemovedLastSlash}/products/%HANDLE%" aria-label="Product Title" tabindex="0"
          class="margin-b-10 margin-b-10 product-title" tabindex="0">%PRODUCT_TITLE%</a>
          <div class="product-option">
            <span class="option-label">%OPTION_LABEL_1%</span>
            <p class="select__variant">%SELECTED_VARIANT_1%</p>
          </div>
          <div class="product-option">
            <span class="option-label">%OPTION_LABEL_2%</span>
            <p class="select__variant">%SELECTED_VARIANT_2%</p>
          </div>
          <div class="product-option">
            <span class="option-label">%OPTION_LABEL_3%</span>
            <p class="select__variant">%SELECTED_VARIANT_3%</p>
          </div>
          <p class="selling-plan"></p>
          <p class="product-price %PRODUCT_STATE%">
          <span class="price-item price-item--sale ">%FINAL_PRICE%</span> 
          <span class="price-item price-item--regular money" style="display:none">%COMPARE_PRICE%</span>
          </p>
          <div class="unit_price" unit_price>%UNIT_PRICE%</div>
        </div>
          <div class="form-field form-options js-required">

          <div class="product-form__input product-form__quantity">
           <div class="quantity__main quantity__main-cart">
              <button class="quantity_button quantity__decrease" name="minus">
                <span>-</span>
              </button>
              <div class="quantity_button quantity_num">
                <input id="quantity" name="quantity" type="number" min="1" value="%ITEM-QUANTITY%" variant_id="%PRODUCT_ID%">
              </div>
              <button class="quantity_button quantity__increase" name="plus">
                <span>+</span>
              </button>
            </div>
            <div class="cart-item__error" id="Line-item-error-%PRODUCT_ID%" role="alert">
            <small class="cart-item__error-text"></small>
            <svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-error" viewBox="0 0 13 13">
              <circle cx="6.5" cy="6.50049" r="5.5" stroke="white" stroke-width="2"/>
              <circle cx="6.5" cy="6.5" r="5.5" fill="#EB001B" stroke="#EB001B" stroke-width="0.7"/>
              <path d="M5.87413 3.52832L5.97439 7.57216H7.02713L7.12739 3.52832H5.87413ZM6.50076 9.66091C6.88091 9.66091 7.18169 9.37267 7.18169 9.00504C7.18169 8.63742 6.88091 8.34917 6.50076 8.34917C6.12061 8.34917 5.81982 8.63742 5.81982 9.00504C5.81982 9.37267 6.12061 9.66091 6.50076 9.66091Z" fill="white"/>
              <path d="M5.87413 3.17832H5.51535L5.52424 3.537L5.6245 7.58083L5.63296 7.92216H5.97439H7.02713H7.36856L7.37702 7.58083L7.47728 3.537L7.48617 3.17832H7.12739H5.87413ZM6.50076 10.0109C7.06121 10.0109 7.5317 9.57872 7.5317 9.00504C7.5317 8.43137 7.06121 7.99918 6.50076 7.99918C5.94031 7.99918 5.46982 8.43137 5.46982 9.00504C5.46982 9.57872 5.94031 10.0109 6.50076 10.0109Z" fill="white" stroke="#EB001B" stroke-width="0.7">
            </svg>
          </div>
          </div>
          </div>
          <a href="javascript:void(0)" onClick="removeItem(%VARIANT_ID%);" class="is-marginless removeItem">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M2 6H18V19C18 19.2652 17.8946 19.5196 17.7071 19.7071C17.5196 19.8946 17.2652 20 17 20H3C2.73478 20 2.48043 19.8946 2.29289 19.7071C2.10536 19.5196 2 19.2652 2 19V6ZM4 8V18H16V8H4ZM7 10H9V16H7V10ZM11 10H13V16H11V10ZM5 3V1C5 0.734784 5.10536 0.48043 5.29289 0.292893C5.48043 0.105357 5.73478 0 6 0H14C14.2652 0 14.5196 0.105357 14.7071 0.292893C14.8946 0.48043 15 0.734784 15 1V3H20V5H0V3H5ZM7 2V3H13V2H7Z" fill="#DB5858"/>
            </svg>
          </a>
      </div>
  </div>`;
var isOpen = false;

var addedSuggested = 0;
var timer;

document.addEventListener("click", (event) => {
  var clickedAtcButton = event.target.closest('.add-to-cart-btn') || event.target.closest('.product-form__submit');
  if ( !clickedAtcButton ) return; //do nothing
  
  if (window.settings.cartType === "cart-drawer") {
    event.preventDefault();

    var self = clickedAtcButton;

    var product_id = self.getAttribute('product_id');
    var metaf = self.getAttribute('metaf');

    var data = new FormData(self.closest("form"));
    
    addProductToCart(product_id, metaf, product_id, data);
  }
});

const cartDrawer = document.querySelector('.cart-drawer');

// CLICK
cartDrawer.addEventListener("click", (event) => {
  var clickedQuantityButton = event.target.closest('.quantity__main button');
  if ( !clickedQuantityButton ) return; //do nothing

  event.preventDefault();
  var quantityWrapper = event.target.closest('.quantity__main');
  var quantityInput = quantityWrapper.querySelector('input[type="number"]');
  var quantityButtonMinus = quantityWrapper.querySelector('button[name="minus"]');
  var quantityButtonPlus = quantityWrapper.querySelector('button[name="plus"]');

  var currentValue = quantityInput.value;

  if (clickedQuantityButton.getAttribute('name') == 'plus') {
    currentValue = parseFloat(currentValue) + 1;
  } else if (clickedQuantityButton.getAttribute('name') == 'minus') {
    if (currentValue > 0) {
      currentValue = parseFloat(currentValue) - 1;
    }
  }
  
  document.querySelectorAll('.quantity_button').forEach(el=>el.setAttribute('disabled', 'disabled'));
  setTimeout(function() {
    testQty(quantityWrapper.querySelector('[name="quantity"]').getAttribute('variant_id'), currentValue);
  }, 50);
});
// CLICK

// CHANGE
cartDrawer.addEventListener("change", (event) => {
  const changedQuantityElement = event.target.closest('[name="quantity"]');
  if ( !changedQuantityElement ) return; //do nothing

  event.preventDefault();
  var currentValue = changedQuantityElement.value;
  setTimeout(function() {
    testQty(changedQuantityElement.getAttribute("variant_id"), currentValue);
  }, 50);
});
// CHANGE


function addProductToCart(formID, metafields, productID, target) {
  window.localStorage.setItem("timer", new Date().getTime() + 10 * 60 * 1000);

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
      }
      /* gift wrap code */
      var productOrQuickViewWrapper = document.querySelector('.quick-view_grid') || document.querySelector('.product__detail');

      if (productOrQuickViewWrapper.querySelector('.product__wrapping') && productOrQuickViewWrapper.querySelector('#add_gift_wrapping').checked == true) {
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
        var data = {
          items: [],
        };
        data["items"].push(gift);
        
        fetch(window.routes.cart_add_url + '.js', {
          body: JSON.stringify(data),
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

function testQty(itemID, value) {
  if (value != "Dummy") {
    changeItem(itemID, value);
  }
}

function fetchCart(line) {
  fetch(window.routes.cart_url + '.js')
  .then((response) => response.json())
  .then((response) => {
    var cart = response;
    onCartUpdate(cart);
    renderCart(cart,line);
  });
}

function changeItem(line, quantity, callback) {
  if (isNotLoading()) {
    startLoading();
  }
  // Check if this product has gift wrapping
  if (!!document.querySelector(`.cart [data-gift-product="${line}"]`)) {
    var new_id = document.querySelector(`.cart [data-gift-product="${line}"]`).dataset.product;
    var data = {}
    data['id'] = line.toString();
    data['quantity'] = quantity;
  } else {
    var data = {}
    data['id'] = line.toString();
    data['quantity'] = quantity;
  }

  var original_quantity = 
  fetch(window.routes.cart_change_url + ".js", {
      method: "POST",
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
  })
  .then(function (response) {
      return response.json();
  }) 
  .then(function (cart) {
    if (document.body.classList.contains('template--cart')) {
      // Error message
      const container = document.querySelector('.cart-page');
      const textwrapper = container.querySelector(`#Line-item-error-${line} .cart-item__error-text`);
      if(currentItemCount === cart.item_count){

        var quantity = '';
        for (let index = 0; index < cart.items.length; index++) {
          const item = cart.items[index];
          if(item.id === line*1){
            quantity = item.quantity;
            console.log(container.querySelector(`[line-item-id='${line}']`).value);
            if(container.querySelector(`[line-item-id='${line}']`).value){

            }
          }
        }
        const text = window.cartStrings.quantityError.replace(
          '[quantity]',
          quantity
        );
        textwrapper.textContent = text;
      }else{
        textwrapper.textContent = ''; 
      }
      document.querySelectorAll('.quantity_button').forEach(el=>el.removeAttribute('disabled'));

      currentItemCount = cart.item_count;

      if (!!document.querySelector('.products-cart')) {
        document.querySelectorAll('.products-cart').forEach(function(productElem) {
          var elementRemove = 0;
          var elementId = productElem.dataset.idCart;
          cart.items.forEach(function (elem, index) {
            if (elem.id == elementId) { elementRemove = 1 };
          });
          if (elementRemove == 0) {
            productElem.remove();
          }
        });
      }

      cart.items.forEach(function (item, index) {
        if (!!document.querySelector('[data-id-cart="' + item.id + '"]')) {
          var cartItemElem = document.querySelector('[data-id-cart="' + item.id + '"]');
          var cross_new = parseFloat(item.price) * parseFloat(item.quantity);
          cartItemElem.querySelector('.product-price-cart .price-cart').innerText = Shopify.formatMoney(item.final_price);
          if (!!cartItemElem.querySelector('.product-line-price del.cart-item__old-price')) {
            cartItemElem.querySelector('.product-line-price del.cart-item__old-price').innerText = Shopify.formatMoney(cross_new);  
          }
          cartItemElem.querySelector('.product-line-price span').innerText = Shopify.formatMoney(item.final_line_price);
          cartItemElem.querySelector('[name="quantity"]').value = item.quantity;
          cartItemElem.querySelector('[name="quantity"]').setAttribute("value", item.quantity);
        }
      });
      if (!!document.querySelector('p.totals__subtotal-value')) {
        document.querySelector('p.totals__subtotal-value').innerText = Shopify.formatMoney(cart.total_price) + ' ' + Shopify.currency.active;  
      }
    }
      if (typeof callback === "function") {
        callback(cart);
      } else {
        onCartUpdate(cart);
        fetchCart(line);
      }

      if (cart.item_count < 1) {
        if (!!document.querySelector('.cart-page')) {
          document.querySelector('.cart-page').innerHTML = `<div class="cart__warnings"> <h2 class="cart__empty-text">${window.cartStrings.empty}</h2> <a href="${window.routes.collection_url}" class="link button button--primary"> Continue shopping </a> </div>`;
        }
      }
  })
  .catch(function (error){
      // Catch errors
      console.warn(error);
  });
}

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, "g"), replace);
}

function removeItem(itemID) {
  if (!!document.querySelector(".item-" + itemID)) {
    changeItem(itemID, 0);
    document.querySelector(".item-" + itemID).remove();  
  }
}

function onCartUpdate(cart) {
  // Do nothing, logic handled before render
}

function addToCartOk(product) {
  if (isNotLoading()) {
    startLoading();
  }
  if (!isCartOpen()) {
    openCart();
  }
  setTimeout(() => fetchCart(), 300);
}

function addToCartFail() {
  console.warn("Error adding to cart: -------------------");
}

function renderCart(cart,line) {
  var container = document.querySelector('.cart-drawer');

  const cartItemHolder = document.querySelector('.cart-drawer__cart');

  if (cart.items.length != 0) {
    document.querySelector('.cartEmptyHolder').classList.add('is-hidden');
    document.querySelector('.cartItemHolder').classList.remove('is-hidden');
  } else {
    document.querySelector('.cartEmptyHolder').classList.remove('is-hidden');
    document.querySelector('.cartItemHolder').classList.add('is-hidden');
  }

  if (!!document.querySelector('#product1Variant')) {
    document.getElementById('product1Variant').addEventListener('change', function(event) {
      document.getElementById('product1_price').innerText = product1_price[this.value];
      document.getElementById('product1_compare').innerText = product1_compare[this.value];
    });
  }

  if (document.querySelector('.header-cart-count')) {
    if (cart.item_count > 0) {
      document.querySelector('.header-cart-count').closest('.cart-count-bubble').style.display = "flex";
    }else{
      document.querySelector('.header-cart-count').closest('.cart-count-bubble').style.display = "none";
    }
    document.querySelector('.header-cart-count').innerText = cart.item_count;  


  }
  

  if (!!document.querySelector('.shopItem')) {
    document.querySelectorAll('.shopItem').forEach(function(shopItem) {
      shopItem.remove();
    });
  }

  var cartTotal = 0;

  if (!!document.querySelector('#product1Form')) {
    document.querySelector('#product1Form').style.display = 'block';
  }
  if (!!document.querySelector('#product2Form')) {
    document.querySelector('#product2Form').style.display = 'block';
  }
  addedSuggested = 0;

  cart.items.forEach(function (item, index) {
    var productHandle = item.url.split('?')[0];
    var compare_price = '';

    fetch(productHandle + '.js') 
    .then(res => res.json())
    .then(function (res) {
      var prod = res;
      var _indx = prod.variants.findIndex(function (x) {
        return x.id == item.id;
      });
      compare_price = prod.variants[_indx].compare_at_price;
      if (compare_price != "" && compare_price != null) {
        var selector = ".item-" + item.id;
        var cartItemElem = document.querySelector(selector);
        if(!!cartItemElem.querySelector('p.product-price.price--on-regular span.price-item.price-item--regular.money')) {
          cartItemElem.querySelector('p.product-price.price--on-regular span.price-item.price-item--regular.money').innerText = Shopify.formatMoney(compare_price);
          cartItemElem.querySelector('p.product-price.price--on-regular span.price-item.price-item--regular.money').style.display = 'inline-block';
        }
      } else {
        var discount_price = item.discounted_price;
        var original_price = item.price;
        if (original_price != discount_price) {
          compare_price = original_price;
          var selector1 = ".item-" + item.id;
          var cartItemElem1 = document.querySelector(selector1);
          if (!!cartItemElem1.querySelector('p.product-price.price--on-regular span.price-item.price-item--regular.money')) {
            cartItemElem1.querySelector('p.product-price.price--on-regular span.price-item.price-item--regular.money').innerText = Shopify.formatMoney(compare_price);
            cartItemElem1.querySelector('p.product-price.price--on-regular span.price-item.price-item--regular.money').style.display = 'inline-block';
          }
        }
      }
    })
    .catch(function() {
      // This is where you run code if the server returns any errors
      console.warn('Something went wrong: error fetching products in store.js fetchCart');
    });

    cartTotal += item.quantity;
    var subtotal = "" + Shopify.formatMoney(cart.items_subtotal_price);
    var original_subtotal = "" + Shopify.formatMoney(cart.original_total_price);
    var discounted_cal =
      parseFloat(cart.original_total_price) -
      parseFloat(cart.items_subtotal_price);
    var discounted_amount = "" + Shopify.formatMoney(discounted_cal);
    var cost = "" + Shopify.formatMoney(item.discounted_price);
    var cost2 = cost;
    if (item.unit_price != undefined) {
      var unit_price = Shopify.formatMoney(item.unit_price);
      var referal_unit = "";
      if (item.unit_price_measurement.reference_value != 1) {
        referal_unit =
          item.unit_price_measurement.reference_value +
          item.unit_price_measurement.reference_unit;
      } else {
        referal_unit = item.unit_price_measurement.reference_unit;
      }
      var unit_price_referal = unit_price + " / " + referal_unit;
    } else {
      unit_price_referal = "";
    }
    var _imgr = "";
    if (item.image != null) {
      var img_tag_src = item.image
        .replace(".png", "_170x170_crop_center.png")
        .replace(".jpg", "_170x170_crop_center.jpg");
      _imgr = '<img src="' + img_tag_src + '" loading="lazy" alt="product" />';
    } else {
      _imgr =
        '<svg xmlns="http://www.w3.org/2000/svg" class="has-background-light" viewBox="0 0 525.5 525.5"><path d="M375.5 345.2c0-.1 0-.1 0 0 0-.1 0-.1 0 0-1.1-2.9-2.3-5.5-3.4-7.8-1.4-4.7-2.4-13.8-.5-19.8 3.4-10.6 3.6-40.6 1.2-54.5-2.3-14-12.3-29.8-18.5-36.9-5.3-6.2-12.8-14.9-15.4-17.9 8.6-5.6 13.3-13.3 14-23 0-.3 0-.6.1-.8.4-4.1-.6-9.9-3.9-13.5-2.1-2.3-4.8-3.5-8-3.5h-54.9c-.8-7.1-3-13-5.2-17.5-6.8-13.9-12.5-16.5-21.2-16.5h-.7c-8.7 0-14.4 2.5-21.2 16.5-2.2 4.5-4.4 10.4-5.2 17.5h-48.5c-3.2 0-5.9 1.2-8 3.5-3.2 3.6-4.3 9.3-3.9 13.5 0 .2 0 .5.1.8.7 9.8 5.4 17.4 14 23-2.6 3.1-10.1 11.7-15.4 17.9-6.1 7.2-16.1 22.9-18.5 36.9-2.2 13.3-1.2 47.4 1 54.9 1.1 3.8 1.4 14.5-.2 19.4-1.2 2.4-2.3 5-3.4 7.9-4.4 11.6-6.2 26.3-5 32.6 1.8 9.9 16.5 14.4 29.4 14.4h176.8c12.9 0 27.6-4.5 29.4-14.4 1.2-6.5-.5-21.1-5-32.7zm-97.7-178c.3-3.2.8-10.6-.2-18 2.4 4.3 5 10.5 5.9 18h-5.7zm-36.3-17.9c-1 7.4-.5 14.8-.2 18h-5.7c.9-7.5 3.5-13.7 5.9-18zm4.5-6.9c0-.1.1-.2.1-.4 4.4-5.3 8.4-5.8 13.1-5.8h.7c4.7 0 8.7.6 13.1 5.8 0 .1 0 .2.1.4 3.2 8.9 2.2 21.2 1.8 25h-30.7c-.4-3.8-1.3-16.1 1.8-25zm-70.7 42.5c0-.3 0-.6-.1-.9-.3-3.4.5-8.4 3.1-11.3 1-1.1 2.1-1.7 3.4-2.1l-.6.6c-2.8 3.1-3.7 8.1-3.3 11.6 0 .2 0 .5.1.8.3 3.5.9 11.7 10.6 18.8.3.2.8.2 1-.2.2-.3.2-.8-.2-1-9.2-6.7-9.8-14.4-10-17.7 0-.3 0-.6-.1-.8-.3-3.2.5-7.7 3-10.5.8-.8 1.7-1.5 2.6-1.9h155.7c1 .4 1.9 1.1 2.6 1.9 2.5 2.8 3.3 7.3 3 10.5 0 .2 0 .5-.1.8-.3 3.6-1 13.1-13.8 20.1-.3.2-.5.6-.3 1 .1.2.4.4.6.4.1 0 .2 0 .3-.1 13.5-7.5 14.3-17.5 14.6-21.3 0-.3 0-.5.1-.8.4-3.5-.5-8.5-3.3-11.6l-.6-.6c1.3.4 2.5 1.1 3.4 2.1 2.6 2.9 3.5 7.9 3.1 11.3 0 .3 0 .6-.1.9-1.5 20.9-23.6 31.4-65.5 31.4h-43.8c-41.8 0-63.9-10.5-65.4-31.4zm91 89.1h-7c0-1.5 0-3-.1-4.2-.2-12.5-2.2-31.1-2.7-35.1h3.6c.8 0 1.4-.6 1.4-1.4v-14.1h2.4v14.1c0 .8.6 1.4 1.4 1.4h3.7c-.4 3.9-2.4 22.6-2.7 35.1v4.2zm65.3 11.9h-16.8c-.4 0-.7.3-.7.7 0 .4.3.7.7.7h16.8v2.8h-62.2c0-.9-.1-1.9-.1-2.8h33.9c.4 0 .7-.3.7-.7 0-.4-.3-.7-.7-.7h-33.9c-.1-3.2-.1-6.3-.1-9h62.5v9zm-12.5 24.4h-6.3l.2-1.6h5.9l.2 1.6zm-5.8-4.5l1.6-12.3h2l1.6 12.3h-5.2zm-57-19.9h-62.4v-9h62.5c0 2.7 0 5.8-.1 9zm-62.4 1.4h62.4c0 .9-.1 1.8-.1 2.8H194v-2.8zm65.2 0h7.3c0 .9.1 1.8.1 2.8H259c.1-.9.1-1.8.1-2.8zm7.2-1.4h-7.2c.1-3.2.1-6.3.1-9h7c0 2.7 0 5.8.1 9zm-7.7-66.7v6.8h-9v-6.8h9zm-8.9 8.3h9v.7h-9v-.7zm0 2.1h9v2.3h-9v-2.3zm26-1.4h-9v-.7h9v.7zm-9 3.7v-2.3h9v2.3h-9zm9-5.9h-9v-6.8h9v6.8zm-119.3 91.1c-2.1-7.1-3-40.9-.9-53.6 2.2-13.5 11.9-28.6 17.8-35.6 5.6-6.5 13.5-15.7 15.7-18.3 11.4 6.4 28.7 9.6 51.8 9.6h6v14.1c0 .8.6 1.4 1.4 1.4h5.4c.3 3.1 2.4 22.4 2.7 35.1 0 1.2.1 2.6.1 4.2h-63.9c-.8 0-1.4.6-1.4 1.4v16.1c0 .8.6 1.4 1.4 1.4H256c-.8 11.8-2.8 24.7-8 33.3-2.6 4.4-4.9 8.5-6.9 12.2-.4.7-.1 1.6.6 1.9.2.1.4.2.6.2.5 0 1-.3 1.3-.8 1.9-3.7 4.2-7.7 6.8-12.1 5.4-9.1 7.6-22.5 8.4-34.7h7.8c.7 11.2 2.6 23.5 7.1 32.4.2.5.8.8 1.3.8.2 0 .4 0 .6-.2.7-.4 1-1.2.6-1.9-4.3-8.5-6.1-20.3-6.8-31.1H312l-2.4 18.6c-.1.4.1.8.3 1.1.3.3.7.5 1.1.5h9.6c.4 0 .8-.2 1.1-.5.3-.3.4-.7.3-1.1l-2.4-18.6H333c.8 0 1.4-.6 1.4-1.4v-16.1c0-.8-.6-1.4-1.4-1.4h-63.9c0-1.5 0-2.9.1-4.2.2-12.7 2.3-32 2.7-35.1h5.2c.8 0 1.4-.6 1.4-1.4v-14.1h6.2c23.1 0 40.4-3.2 51.8-9.6 2.3 2.6 10.1 11.8 15.7 18.3 5.9 6.9 15.6 22.1 17.8 35.6 2.2 13.4 2 43.2-1.1 53.1-1.2 3.9-1.4 8.7-1 13-1.7-2.8-2.9-4.4-3-4.6-.2-.3-.6-.5-.9-.6h-.5c-.2 0-.4.1-.5.2-.6.5-.8 1.4-.3 2 0 0 .2.3.5.8 1.4 2.1 5.6 8.4 8.9 16.7h-42.9v-43.8c0-.8-.6-1.4-1.4-1.4s-1.4.6-1.4 1.4v44.9c0 .1-.1.2-.1.3 0 .1 0 .2.1.3v9c-1.1 2-3.9 3.7-10.5 3.7h-7.5c-.4 0-.7.3-.7.7 0 .4.3.7.7.7h7.5c5 0 8.5-.9 10.5-2.8-.1 3.1-1.5 6.5-10.5 6.5H210.4c-9 0-10.5-3.4-10.5-6.5 2 1.9 5.5 2.8 10.5 2.8h67.4c.4 0 .7-.3.7-.7 0-.4-.3-.7-.7-.7h-67.4c-6.7 0-9.4-1.7-10.5-3.7v-54.5c0-.8-.6-1.4-1.4-1.4s-1.4.6-1.4 1.4v43.8h-43.6c4.2-10.2 9.4-17.4 9.5-17.5.5-.6.3-1.5-.3-2s-1.5-.3-2 .3c-.1.2-1.4 2-3.2 5 .1-4.9-.4-10.2-1.1-12.8zm221.4 60.2c-1.5 8.3-14.9 12-26.6 12H174.4c-11.8 0-25.1-3.8-26.6-12-1-5.7.6-19.3 4.6-30.2H197v9.8c0 6.4 4.5 9.7 13.4 9.7h105.4c8.9 0 13.4-3.3 13.4-9.7v-9.8h44c4 10.9 5.6 24.5 4.6 30.2z"/><path d="M286.1 359.3c0 .4.3.7.7.7h14.7c.4 0 .7-.3.7-.7 0-.4-.3-.7-.7-.7h-14.7c-.3 0-.7.3-.7.7zm5.3-145.6c13.5-.5 24.7-2.3 33.5-5.3.4-.1.6-.5.4-.9-.1-.4-.5-.6-.9-.4-8.6 3-19.7 4.7-33 5.2-.4 0-.7.3-.7.7 0 .4.3.7.7.7zm-11.3.1c.4 0 .7-.3.7-.7 0-.4-.3-.7-.7-.7H242c-19.9 0-35.3-2.5-45.9-7.4-.4-.2-.8 0-.9.3-.2.4 0 .8.3.9 10.8 5 26.4 7.5 46.5 7.5h38.1zm-7.2 116.9c.4.1.9.1 1.4.1 1.7 0 3.4-.7 4.7-1.9 1.4-1.4 1.9-3.2 1.5-5-.2-.8-.9-1.2-1.7-1.1-.8.2-1.2.9-1.1 1.7.3 1.2-.4 2-.7 2.4-.9.9-2.2 1.3-3.4 1-.8-.2-1.5.3-1.7 1.1s.2 1.5 1 1.7z"/><path d="M275.5 331.6c-.8 0-1.4.6-1.5 1.4 0 .8.6 1.4 1.4 1.5h.3c3.6 0 7-2.8 7.7-6.3.2-.8-.4-1.5-1.1-1.7-.8-.2-1.5.4-1.7 1.1-.4 2.3-2.8 4.2-5.1 4zm5.4 1.6c-.6.5-.6 1.4-.1 2 1.1 1.3 2.5 2.2 4.2 2.8.2.1.3.1.5.1.6 0 1.1-.3 1.3-.9.3-.7-.1-1.6-.8-1.8-1.2-.5-2.2-1.2-3-2.1-.6-.6-1.5-.6-2.1-.1zm-38.2 12.7c.5 0 .9 0 1.4-.1.8-.2 1.3-.9 1.1-1.7-.2-.8-.9-1.3-1.7-1.1-1.2.3-2.5-.1-3.4-1-.4-.4-1-1.2-.8-2.4.2-.8-.3-1.5-1.1-1.7-.8-.2-1.5.3-1.7 1.1-.4 1.8.1 3.7 1.5 5 1.2 1.2 2.9 1.9 4.7 1.9z"/><path d="M241.2 349.6h.3c.8 0 1.4-.7 1.4-1.5s-.7-1.4-1.5-1.4c-2.3.1-4.6-1.7-5.1-4-.2-.8-.9-1.3-1.7-1.1-.8.2-1.3.9-1.1 1.7.7 3.5 4.1 6.3 7.7 6.3zm-9.7 3.6c.2 0 .3 0 .5-.1 1.6-.6 3-1.6 4.2-2.8.5-.6.5-1.5-.1-2s-1.5-.5-2 .1c-.8.9-1.8 1.6-3 2.1-.7.3-1.1 1.1-.8 1.8 0 .6.6.9 1.2.9z"/></svg>';
    }

    var cartItem2 = replaceAll(cartItem, "%PRODUCT_TITLE%", item.product_title);
    cartItem2 = replaceAll(cartItem2, "%PRODUCT_IMAGE%", _imgr);
    cartItem2 = replaceAll(cartItem2, "%PRODUCT_STATE%", "price--on-regular");
    cartItem2 = replaceAll(cartItem2, "%FINAL_PRICE%", cost2);
    cartItem2 = replaceAll(cartItem2, "%UNIT_PRICE%", unit_price_referal);

    if (compare_price > 0) {
      cartItem2 = replaceAll(
        cartItem2,
        "%COMPARE_PRICE%",
        Shopify.formatMoney(compare_price)
      );
    }
    cartItem2 = replaceAll(cartItem2, "%ITEM-QUANTITY%", item.quantity);

    if (item.variant_options[0] != "Default Title") {
      if(item.options_with_values[0]?.value){
        cartItem2 = replaceAll(
          cartItem2,
          "%SELECTED_VARIANT_1%",
          item.options_with_values[0]?.value
        );
      } else {
        cartItem2 = replaceAll(cartItem2, "%SELECTED_VARIANT_1%", " ");
      }
      if(item.options_with_values[1]?.value){
        cartItem2 = replaceAll(
          cartItem2,
          "%SELECTED_VARIANT_2%",
          item.options_with_values[1]?.value
        );
      } else {
        cartItem2 = replaceAll(cartItem2, "%SELECTED_VARIANT_2%", " ");
      }
      if(item.options_with_values[2]?.value){
        cartItem2 = replaceAll(
          cartItem2,
          "%SELECTED_VARIANT_3%",
          item.options_with_values[2]?.value
        );
      } else {
        cartItem2 = replaceAll(cartItem2, "%SELECTED_VARIANT_3%", " ");
      }
      if(item.options_with_values[0]?.name){
        cartItem2 = replaceAll(
          cartItem2,
          "%OPTION_LABEL_1%",
          item.options_with_values[0]?.name + ":"
        );
      } else {
        cartItem2 = replaceAll(cartItem2, "%OPTION_LABEL_1%", " ");
      }
      if(item.options_with_values[1]?.name){
        cartItem2 = replaceAll(
          cartItem2,
          "%OPTION_LABEL_2%",
          item.options_with_values[1]?.name + ":"
        );
      } else {
        cartItem2 = replaceAll(cartItem2, "%OPTION_LABEL_2%", " ");
      }
      if(item.options_with_values[2]?.name){
        cartItem2 = replaceAll(
          cartItem2,
          "%OPTION_LABEL_3%",
          item.options_with_values[2]?.name + ":"
        );
      } else {
        cartItem2 = replaceAll(cartItem2, "%OPTION_LABEL_3%", " ");
      }
    } else {
      cartItem2 = replaceAll(cartItem2, "%OPTION_LABEL_1%", " ");
      cartItem2 = replaceAll(cartItem2, "%OPTION_LABEL_2%", " ");
      cartItem2 = replaceAll(cartItem2, "%OPTION_LABEL_3%", " ");
      cartItem2 = replaceAll(cartItem2, "%SELECTED_VARIANT_1%", " ");
      cartItem2 = replaceAll(cartItem2, "%SELECTED_VARIANT_2%", " ");
      cartItem2 = replaceAll(cartItem2, "%SELECTED_VARIANT_3%", " ");
    }

    cartItem2 = replaceAll(cartItem2, "%PRODUCT_ID%", item.id);
    cartItem2 = replaceAll(cartItem2, "%VARIANT_ID%", item.variant_id);
    cartItem2 = replaceAll(cartItem2, "%HANDLE%", item.handle);
    if (item.properties && item.properties._gift_wrapping_product) {
      cartItem2 = replaceAll(
        cartItem2,
        "%giftProduct%",
        item.properties._gift_wrapping_product
      );
    } else {
      cartItem2 = replaceAll(cartItem2, "%giftProduct%", "");
    }

    // cartItemHolder.prepend(cartItem2);
    var cartParser = new DOMParser();
    var cartDocument = cartParser.parseFromString(cartItem2, "text/html");
    var cartHtml = cartDocument.querySelector('.cart-drawer__products');
    cartItemHolder.prepend(cartHtml);

    var itemElement = document.querySelector(`.item-${item.id}`)

    if (item.selling_plan_allocation == "undefined") {
      itemElement.querySelector(`p.selling-plan`).innerText = item.selling_plan_allocation.selling_plan.name;
    }
    if (!!document.querySelector('.items_subtotal')) {
      document.querySelector('.items_subtotal').innerText = subtotal;
    }
    
    var symboll = window.shop_symbol;
    if (document.querySelector('[name="country_code"]') != null) {
      symboll = document
        .querySelector('[name="country_code"]')
        .getAttribute("symbol") + "{{amount}}";;
    }
    var vlue_zero = Shopify.formatMoney("0.00");
    if (discounted_amount != vlue_zero) {
      document.querySelector('.disocunt_calculate p').innerText = discounted_amount;
    } else {
      document.querySelector('.disocunt_calculate p').innerText = window.cartStrings.discount_policy;
    }

    if (!!document.querySelector(`#QTY-${item.id} option:nth-child(${Number(item.quantity) + 1})`)) {
      document.querySelector(`#QTY-${item.id} option:nth-child(${Number(item.quantity) + 1})`).setAttribute('selected','selected');
    }
  });
  if (cart.item_count > 1) {
    itemTimer(cart);
  } else if (cart.item_count == 1) {
    itemTimer(cart);
  } else {
    if (!!document.querySelector('.items_subtotal')) {
      document.querySelector('.items_subtotal').innerText = "Empty";
    }
    itemTimer(cart);
  }
  var text = document.querySelector('.view_cart-btn').innerText;
  var new_text = text.replace(/\(.*?\)/g, '(' + cart.item_count + ')');
  document.querySelector('.view_cart-btn').innerText = new_text;
  
  // Error message
  if(container && container.querySelector(`#Line-item-error-${line}`)?.querySelector('.cart-item__error-text'))
  var textwrapper = container.querySelector(`#Line-item-error-${line}`)
  .querySelector('.cart-item__error-text');
  
  if(!textwrapper) return false;
  
  if(currentItemCount === cart.item_count){
    var quantity = '';
    for (let index = 0; index < cart.items.length; index++) {
      const item = cart.items[index];
      if(item.id === line*1){
        quantity = item.quantity;
      }
    }
    const text = window.cartStrings.quantityError.replace(
      '[quantity]',
      quantity
    );
    textwrapper.textContent = text;
  }else{
    textwrapper.textContent = ''
  }
  currentItemCount = cart.item_count;
  stopLoading();
  document.querySelectorAll('.quantity_button').forEach(el=>el.removeAttribute('disabled'));
}

function onTidioChatApiReady() {
  setTimeout(function() {
    if (!!document.querySelector('#tidio-chat-iframe')) {
      document.querySelector('#tidio-chat-iframe').style.zIndex = 699;
    }
  },500)
}

document.addEventListener("DOMContentLoaded", function () {
  fetchCart();
});

function closeCart() {
  document.documentElement.style.overflowY = 'scroll';
  isOpen = false;
  document.querySelector('.cart-flyout').classList.add('is-closing');
  document.querySelector('.cart-flyout').classList.remove('is-active');
  // document.querySelector('.cart-flyout').style.display = 'none';
  document.querySelector('.cartOverlay').style.display = 'none';
  
  setTimeout(function() {
    document.querySelector('.cart-flyout').classList.remove('is-closing');
    document.querySelector('.cart-flyout').style.display = 'none';
  },750);

  removeTrapFocus(document.getElementById("cart-icon-bubble"));
}

function openCart() {
  document.documentElement.style.overflowY = 'hidden';
  isOpen = true;
  document.querySelector('.cart-flyout').style.display = '';
  document.querySelector('.cart-flyout').classList.remove('is-closing');
  document.querySelector('.cart-flyout').classList.add('is-active');
  let drawerCartElem = document.querySelector(".cart-drawer");

  trapFocus(
    drawerCartElem,
    document.querySelector(".cart-drawer__close > button")
  );

  drawerCartElem.addEventListener("keyup", function (event) {
    if (event.code == "Escape") {
      closeCart();
    }
  });

  setTimeout(() => document.querySelector('.cartOverlay').style.display = 'block', 50);
}
document
  .getElementById("cart-icon-bubble")
  .addEventListener("click", function (event) {
    if (window.settings.cartType !== "cart-drawer") {
      return;
    }
    event.preventDefault();
    if (!document.body.classList.contains('template--cart')) {
      toggleCart();
    }
  });

function toggleCart() {
  event.preventDefault();
  if (isCartOpen()) {
    closeCart();
    return false;
  } else {
    openCart();
    return false;
  }
}

function isCartOpen() {
  return isOpen;
}

function clickOverlay() {
  toggleCart();
}

function addSuggested(formID, metafields, itemID, productID) {
  window.localStorage.setItem("timer", new Date().getTime() + 10 * 60 * 1000);
  if (isNotLoading()) {
    startLoading();
  }
  if (!isCartOpen()) {
    openCart();
  }

  if (!!document.querySelector(`#${productID}Variant`)) {
    if (document.querySelector(`#${productID}Variant`) != null) {
      itemID = document.querySelector(`#${productID}Variant`).value;
    }
  }
  if (!!document.querySelector(`#${productID}Qty`) && !!document.querySelector(`#${productID}Select`)) {
    document.querySelector(`#${productID}Qty`).setAttribute('value', document.querySelector(`#${productID}Select`).value);
    document.querySelector(`#${productID}Input`).setAttribute('value', itemID);
    addProductToCart(formID, metafields, itemID);
    document.querySelector(`#${productID}Form`).style.display = 'none';
  }
}

function startLoading() {
  document.querySelector('.cartLoader').classList.remove('is-hidden');
}

function stopLoading() {
  document.querySelector('.cartLoader').classList.add('is-hidden');
}

function isNotLoading() {
  return document.querySelector('.cartLoader').classList.contains('is-hidden');
}

function itemTimer(cart) {
  var isSingle = true;
  if (cart.item_count > 1) isSingle = false;
  var second = 1000,
    minute = second * 60,
    hour = minute * 60,
    day = hour * 24;
  if (timer || cart.item_count === 0) {
    clearInterval(timer);
  }
  window.localStorage.setItem("timer", new Date().getTime() + 10 * 60 * 1000);
  var countDown = Number(window.localStorage.getItem("timer"));
  if (cart.item_count > 0) {
    timer = setInterval(function () {
      var now = new Date().getTime(),
          distance = countDown - now;

      if (!!document.querySelector('.itemCount')) {
        var itemCount = document.querySelector('.itemCount');
        itemCount.classList.remove('is-hidden');

        if (isSingle) {
          itemCount.innerText = ":" + " " + window.cartItems.cart_count.one.replace("{{ count }}", cart.item_count);
        } else {
          itemCount.innerText = ":" + " " + window.cartItems.cart_count.other.replace("{{ count }}", cart.item_count);
        }
        if (distance > 0) {} else {
          if (isSingle) {
            itemCount.innerText = ":" + " " + window.cartItems.cart_count.one.replace("{{ count }}", cart.item_count);
          } else {
            itemCount.innerText = ":" + " " + window.cartItems.cart_count.other.replace("{{ count }}", cart.item_count);
          }
        }
      }     
    }, 1000);
  } else {
    if (!!document.querySelector('.itemCount')) {
      document.querySelector('.itemCount').classList.add('is-hidden');
    }
  }
}

document.addEventListener("DOMContentLoaded", function() {

  document.addEventListener("change", (event) => {
    const changedColorRadio = event.target.closest('[data_options="color"] input[type="radio"]');
    if ( !changedColorRadio ) return; //do nothing

    if (changedColorRadio.value != undefined) {
      if (!!changedColorRadio.closest('.product-form__input')) {
        let productFormInput = changedColorRadio.closest('.product-form__input');
        if (!!productFormInput.querySelector('.form__label span')) {
          productFormInput.querySelector('.form__label span').innerText = changedColorRadio.value;  
        }
      }
    }
  });

  var selectors = {
    termsCheckbox: ".cart__terms-checkbox",
    requiresTerms: false,
  };

  if (!!document.querySelector('.js-cart-terms-checkboxes')) {
    var termsCheckboxes = document.querySelectorAll('.js-cart-terms-checkboxes');
    var requiresTerms = true;

    termsCheckboxes.forEach(function(termsCheckbox) {
      termsCheckbox.addEventListener('change', function(event) {
        var checkedStatus = event.target.checked;

        termsCheckboxes.forEach(function(termsCheckbox) {
          termsCheckbox.checked = checkedStatus;
        });
      });
    });
  } else {
    var requiresTerms = false;
  }


  document.querySelectorAll('.cart-drawer__proceed-to-checkout,button.cart__checkout-button.button').forEach(function(checkoutButton) {
    checkoutButton.addEventListener('click', function(e) {
      if (requiresTerms == true) {
        if (document.querySelectorAll('.js-cart-terms-checkboxes')[0].checked) {
          // continue to checkout
        } else {
          alert(window.cartStrings.cartTermsConfirmation);
          e.preventDefault();
          return false;
        }
      }

      e.preventDefault();

      var closestForm = document.querySelectorAll('form[action="' + window.routes.cart_url + '"]')[0];
      var formData = new URLSearchParams(new FormData(closestForm)).toString();

      fetch(window.routes.cart_url, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      .then(function (response) {
        return response.json();
      }) 
      .then(function (cart) {
        window.location.href = "/checkout";
      })
      .catch(function (error){
        // Catch errors
        addToCartFail()
      });      

    });
  });
});


class VariantProductcardSelects extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("change", this.onVariantProductcardChange);
  }
  onVariantProductcardChange() {
    this.updateOptions();
    this.updateMasterId();
    this.updateMediaPrice();
    this.closest(".card-wrapper")
      .querySelector('[name="id"]')
      .setAttribute("value", this.currentVariant.id);
  }

  updateOptions() {
    this.options = Array.from(
      this.querySelectorAll("select"),
      (select) => select.value
    );
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
  updateMediaPrice() {
    this.closest(".card-wrapper").querySelector(
      ".price__regular .price-item--regular"
    ).innerHTML = `From ${Shopify.formatMoney(this.currentVariant.price)}`;
    if (this.currentVariant.featured_image != null) {
      this.closest(".card-wrapper")
        .querySelector(".primery_card_image")
        .setAttribute("src", this.currentVariant.featured_image.src);
    }
  }
}
class VariantProductcard extends VariantProductcardSelects {
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

customElements.define("variant-productcard", VariantProductcard);

if(document.querySelector(".accordion-content")){
  let accordionBtn = document.querySelector(".accordion-btn");
  let accordionContent = document.querySelector(".accordion-content");
  let accordionTextarea = accordionContent?.querySelector("textarea");
  
  accordionBtn.addEventListener("click", function () {
    accordionBtn.classList.toggle("isOpen");
    toggleAccordionContent();
  });
  
  accordionBtn.addEventListener("keyup", function (event) {
    if (event.code == "Escape") {
      accordionBtn.classList.remove("isOpen");
      hideAccordionContent();
      event.preventDefault();
    }
  });
  
  accordionContent.addEventListener("keyup", function (event) {
    if (event.code == "Escape") {
      accordionBtn.classList.remove("isOpen");
      hideAccordionContent();
      event.preventDefault();
    }
  });
  
  function hideAccordionContent() {
    accordionContent.style.maxHeight = null;
    accordionTextarea.tabIndex = -1;
    accordionBtn.focus();
  }
  
  function showAccordionContent() {
    accordionContent.style.maxHeight = accordionContent.scrollHeight + "px";
    accordionTextarea.tabIndex = 0;
    accordionTextarea.focus();
  }
  
  function toggleAccordionContent() {
    if (accordionContent.style.maxHeight) {
      hideAccordionContent();
    } else {
      showAccordionContent();
    }
  }
}

if (document.getElementById('complementary_slider')) {
  var elem = document.getElementById('complementary_slider');
  var flkty = new Flickity( elem, {
    // options
    cellAlign: 'center',
    contain: true
  });
}

if (!!document.querySelector('#CartNote')) {
  document.querySelector('#CartNote').addEventListener('change', debounce((event) => {
    const body = JSON.stringify({ note: event.target.value });
    fetch(`${routes.cart_update_url}`, {...fetchConfig(), ...{ body }});
  }, 300))
}
