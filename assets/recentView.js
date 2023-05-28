window.recentlyViewed = {};
recentlyViewed.selectors = {
  template: "#RecentlyViewedProduct",
  outputContainer: "#recentView-template-grid",
};
recentlyViewed.promises = [];
recentlyViewed.currentProduct = document.querySelector('.js-recentView-template').dataset.currentProduct;
recentlyViewed.recent = JSON.parse(localStorage.getItem("recentlyViewed"));
(recentlyViewed.init = function (handle) {
  for (handle in recentlyViewed.recent) {
    if (handle !== "undefined") {
      recentlyViewed.promises.push(
        this.getProductInfo(recentlyViewed.recent[handle])
      );
    }
  }

  Promise.all(recentlyViewed.promises).then(
    function (result) {
      recentlyViewed.setupOutput(result);
      var elem = document.querySelector('#recentView-template-grid');
      var recentlyViewedFlkty = new Flickity(elem, {
        cellAlign: "left",
        contain: true,
        cellSelector: ".recentView-item",
        wrapAround: true,
        pageDots: false,
        groupCells: true
      });
      recentlyViewedFlkty.select(0);
      var focusableElements = ['a','input','select','button','iframe','div[role="button"]'];
      recentlyViewedFlkty.on( 'select', function( index ) {
        recentlyViewedFlkty.cells.forEach(function(cell) {
            cell.element.tabIndex = -1;
            focusableElements.forEach((focusableElement) => {
              cell.element.querySelectorAll(focusableElement).forEach((sliderLink) => {
                sliderLink.tabIndex = -1;
              });
            });
        })
        recentlyViewedFlkty.selectedCells.forEach(function(cell) {
          cell.element.tabIndex = 0;
          focusableElements.forEach((focusableElement) => {
            cell.element.querySelectorAll(focusableElement).forEach((sliderLink) => {
              sliderLink.tabIndex = 0;
            });
          });
        })
      });
      recentlyViewedFlkty.on( 'settle', function( index ) {
        recentlyViewedFlkty.cells.forEach(function(cell) {
            cell.element.tabIndex = -1;
            focusableElements.forEach((focusableElement) => {
              cell.element.querySelectorAll(focusableElement).forEach((sliderLink) => {
                sliderLink.tabIndex = -1;
              });
            });
        })
        recentlyViewedFlkty.selectedCells.forEach(function(cell) {
          cell.element.tabIndex = 0;
          focusableElements.forEach((focusableElement) => {
            cell.element.querySelectorAll(focusableElement).forEach((sliderLink) => {
              sliderLink.tabIndex = 0;
            });
          });
        })
      });

    }.bind(this),
    function (error) {
      console.warn("Theme | recently viewed products failed to load");
    }
  );

  recentlyViewed.Productrecent();
}),
  (recentlyViewed.getProductInfo = function (handle) {
    return new Promise(function (resolve, reject) {
      async function fetchProductJSON() {
        const response = await fetch('/products/' + handle + '.js');
        const data = await response.json();
        return data;
      }
      fetchProductJSON().then(product => {
        resolve(product);
      });
    });
  }),
  (recentlyViewed.setupOutput = function (products) {
    var allProducts = [];
    var data = {};
    var limit = 4;

    var i = 0;
    for (key in products) {
      var product = products[key];
      // Ignore current product
      if (product.handle === recentlyViewed.currentProduct) {
        continue;
      }
      i++;
      // New or formatted properties
      product.url_formatted = recentlyViewed.recent[product.handle]
        ? recentlyViewed.recent[product.handle].url
        : product.url;
      // product.image_responsive_url = _imgr;
      // product.image_aspect_ratio = product.featured_image.aspectRatio;
      product.on_sale = product.compare_at_price > product.price;
      product.sold_out = !product.available;
      product.available = product.available;
      product.price_formatted = Shopify.formatMoney(product.price);
      product.compare_at_price_formatted = Shopify.formatMoney(
        product.compare_at_price
      );
      product.price_min_formatted = Shopify.formatMoney(product.price_min);
      product.money_saved = Shopify.formatMoney(
        product.compare_at_price - product.price
      );
      product.id = product.id;
      product.handle = product.handle;
      product.media_all = product.images;
      product.variant_id = product.variants[0].id;
      if (product.images.length > 1) {
        product.secondery_image_avaliable = true;
        product.secondery_image = product.images[1];
      } else {
        product.secondery_image = false;
      }
      allProducts.unshift(product);
    }

    data = {
      items: allProducts.slice(0, limit),
      grid_item_width: "small--one-half medium-up--one-third",
    };

    if (allProducts.length === 0) {
      return;
    }
    // Prep handlebars template
    var source = document.querySelector(recentlyViewed.selectors.template).innerHTML;
    var template = Handlebars.compile(source);
    allProducts.forEach(function (line_item, index) {
      var all_images = "";
      var all_options = "";
      if (line_item.media != undefined) {
        line_item.media.forEach(function (image, indx) {
          if (image.media_type == "image") {
            var imgg =
              '<img image-id="' +
              image.id +
              '" src="' +
              image.src +
              '" alt="' +
              image.alt +
              '" style="display:none" class="data-aos aos-animate">';
          }
          all_images = all_images + imgg;
        });
      } else {
        all_images =
          '<svg xmlns="http://www.w3.org/2000/svg" class="has-background-light" viewBox="0 0 525.5 525.5"><path d="M375.5 345.2c0-.1 0-.1 0 0 0-.1 0-.1 0 0-1.1-2.9-2.3-5.5-3.4-7.8-1.4-4.7-2.4-13.8-.5-19.8 3.4-10.6 3.6-40.6 1.2-54.5-2.3-14-12.3-29.8-18.5-36.9-5.3-6.2-12.8-14.9-15.4-17.9 8.6-5.6 13.3-13.3 14-23 0-.3 0-.6.1-.8.4-4.1-.6-9.9-3.9-13.5-2.1-2.3-4.8-3.5-8-3.5h-54.9c-.8-7.1-3-13-5.2-17.5-6.8-13.9-12.5-16.5-21.2-16.5h-.7c-8.7 0-14.4 2.5-21.2 16.5-2.2 4.5-4.4 10.4-5.2 17.5h-48.5c-3.2 0-5.9 1.2-8 3.5-3.2 3.6-4.3 9.3-3.9 13.5 0 .2 0 .5.1.8.7 9.8 5.4 17.4 14 23-2.6 3.1-10.1 11.7-15.4 17.9-6.1 7.2-16.1 22.9-18.5 36.9-2.2 13.3-1.2 47.4 1 54.9 1.1 3.8 1.4 14.5-.2 19.4-1.2 2.4-2.3 5-3.4 7.9-4.4 11.6-6.2 26.3-5 32.6 1.8 9.9 16.5 14.4 29.4 14.4h176.8c12.9 0 27.6-4.5 29.4-14.4 1.2-6.5-.5-21.1-5-32.7zm-97.7-178c.3-3.2.8-10.6-.2-18 2.4 4.3 5 10.5 5.9 18h-5.7zm-36.3-17.9c-1 7.4-.5 14.8-.2 18h-5.7c.9-7.5 3.5-13.7 5.9-18zm4.5-6.9c0-.1.1-.2.1-.4 4.4-5.3 8.4-5.8 13.1-5.8h.7c4.7 0 8.7.6 13.1 5.8 0 .1 0 .2.1.4 3.2 8.9 2.2 21.2 1.8 25h-30.7c-.4-3.8-1.3-16.1 1.8-25zm-70.7 42.5c0-.3 0-.6-.1-.9-.3-3.4.5-8.4 3.1-11.3 1-1.1 2.1-1.7 3.4-2.1l-.6.6c-2.8 3.1-3.7 8.1-3.3 11.6 0 .2 0 .5.1.8.3 3.5.9 11.7 10.6 18.8.3.2.8.2 1-.2.2-.3.2-.8-.2-1-9.2-6.7-9.8-14.4-10-17.7 0-.3 0-.6-.1-.8-.3-3.2.5-7.7 3-10.5.8-.8 1.7-1.5 2.6-1.9h155.7c1 .4 1.9 1.1 2.6 1.9 2.5 2.8 3.3 7.3 3 10.5 0 .2 0 .5-.1.8-.3 3.6-1 13.1-13.8 20.1-.3.2-.5.6-.3 1 .1.2.4.4.6.4.1 0 .2 0 .3-.1 13.5-7.5 14.3-17.5 14.6-21.3 0-.3 0-.5.1-.8.4-3.5-.5-8.5-3.3-11.6l-.6-.6c1.3.4 2.5 1.1 3.4 2.1 2.6 2.9 3.5 7.9 3.1 11.3 0 .3 0 .6-.1.9-1.5 20.9-23.6 31.4-65.5 31.4h-43.8c-41.8 0-63.9-10.5-65.4-31.4zm91 89.1h-7c0-1.5 0-3-.1-4.2-.2-12.5-2.2-31.1-2.7-35.1h3.6c.8 0 1.4-.6 1.4-1.4v-14.1h2.4v14.1c0 .8.6 1.4 1.4 1.4h3.7c-.4 3.9-2.4 22.6-2.7 35.1v4.2zm65.3 11.9h-16.8c-.4 0-.7.3-.7.7 0 .4.3.7.7.7h16.8v2.8h-62.2c0-.9-.1-1.9-.1-2.8h33.9c.4 0 .7-.3.7-.7 0-.4-.3-.7-.7-.7h-33.9c-.1-3.2-.1-6.3-.1-9h62.5v9zm-12.5 24.4h-6.3l.2-1.6h5.9l.2 1.6zm-5.8-4.5l1.6-12.3h2l1.6 12.3h-5.2zm-57-19.9h-62.4v-9h62.5c0 2.7 0 5.8-.1 9zm-62.4 1.4h62.4c0 .9-.1 1.8-.1 2.8H194v-2.8zm65.2 0h7.3c0 .9.1 1.8.1 2.8H259c.1-.9.1-1.8.1-2.8zm7.2-1.4h-7.2c.1-3.2.1-6.3.1-9h7c0 2.7 0 5.8.1 9zm-7.7-66.7v6.8h-9v-6.8h9zm-8.9 8.3h9v.7h-9v-.7zm0 2.1h9v2.3h-9v-2.3zm26-1.4h-9v-.7h9v.7zm-9 3.7v-2.3h9v2.3h-9zm9-5.9h-9v-6.8h9v6.8zm-119.3 91.1c-2.1-7.1-3-40.9-.9-53.6 2.2-13.5 11.9-28.6 17.8-35.6 5.6-6.5 13.5-15.7 15.7-18.3 11.4 6.4 28.7 9.6 51.8 9.6h6v14.1c0 .8.6 1.4 1.4 1.4h5.4c.3 3.1 2.4 22.4 2.7 35.1 0 1.2.1 2.6.1 4.2h-63.9c-.8 0-1.4.6-1.4 1.4v16.1c0 .8.6 1.4 1.4 1.4H256c-.8 11.8-2.8 24.7-8 33.3-2.6 4.4-4.9 8.5-6.9 12.2-.4.7-.1 1.6.6 1.9.2.1.4.2.6.2.5 0 1-.3 1.3-.8 1.9-3.7 4.2-7.7 6.8-12.1 5.4-9.1 7.6-22.5 8.4-34.7h7.8c.7 11.2 2.6 23.5 7.1 32.4.2.5.8.8 1.3.8.2 0 .4 0 .6-.2.7-.4 1-1.2.6-1.9-4.3-8.5-6.1-20.3-6.8-31.1H312l-2.4 18.6c-.1.4.1.8.3 1.1.3.3.7.5 1.1.5h9.6c.4 0 .8-.2 1.1-.5.3-.3.4-.7.3-1.1l-2.4-18.6H333c.8 0 1.4-.6 1.4-1.4v-16.1c0-.8-.6-1.4-1.4-1.4h-63.9c0-1.5 0-2.9.1-4.2.2-12.7 2.3-32 2.7-35.1h5.2c.8 0 1.4-.6 1.4-1.4v-14.1h6.2c23.1 0 40.4-3.2 51.8-9.6 2.3 2.6 10.1 11.8 15.7 18.3 5.9 6.9 15.6 22.1 17.8 35.6 2.2 13.4 2 43.2-1.1 53.1-1.2 3.9-1.4 8.7-1 13-1.7-2.8-2.9-4.4-3-4.6-.2-.3-.6-.5-.9-.6h-.5c-.2 0-.4.1-.5.2-.6.5-.8 1.4-.3 2 0 0 .2.3.5.8 1.4 2.1 5.6 8.4 8.9 16.7h-42.9v-43.8c0-.8-.6-1.4-1.4-1.4s-1.4.6-1.4 1.4v44.9c0 .1-.1.2-.1.3 0 .1 0 .2.1.3v9c-1.1 2-3.9 3.7-10.5 3.7h-7.5c-.4 0-.7.3-.7.7 0 .4.3.7.7.7h7.5c5 0 8.5-.9 10.5-2.8-.1 3.1-1.5 6.5-10.5 6.5H210.4c-9 0-10.5-3.4-10.5-6.5 2 1.9 5.5 2.8 10.5 2.8h67.4c.4 0 .7-.3.7-.7 0-.4-.3-.7-.7-.7h-67.4c-6.7 0-9.4-1.7-10.5-3.7v-54.5c0-.8-.6-1.4-1.4-1.4s-1.4.6-1.4 1.4v43.8h-43.6c4.2-10.2 9.4-17.4 9.5-17.5.5-.6.3-1.5-.3-2s-1.5-.3-2 .3c-.1.2-1.4 2-3.2 5 .1-4.9-.4-10.2-1.1-12.8zm221.4 60.2c-1.5 8.3-14.9 12-26.6 12H174.4c-11.8 0-25.1-3.8-26.6-12-1-5.7.6-19.3 4.6-30.2H197v9.8c0 6.4 4.5 9.7 13.4 9.7h105.4c8.9 0 13.4-3.3 13.4-9.7v-9.8h44c4 10.9 5.6 24.5 4.6 30.2z"/><path d="M286.1 359.3c0 .4.3.7.7.7h14.7c.4 0 .7-.3.7-.7 0-.4-.3-.7-.7-.7h-14.7c-.3 0-.7.3-.7.7zm5.3-145.6c13.5-.5 24.7-2.3 33.5-5.3.4-.1.6-.5.4-.9-.1-.4-.5-.6-.9-.4-8.6 3-19.7 4.7-33 5.2-.4 0-.7.3-.7.7 0 .4.3.7.7.7zm-11.3.1c.4 0 .7-.3.7-.7 0-.4-.3-.7-.7-.7H242c-19.9 0-35.3-2.5-45.9-7.4-.4-.2-.8 0-.9.3-.2.4 0 .8.3.9 10.8 5 26.4 7.5 46.5 7.5h38.1zm-7.2 116.9c.4.1.9.1 1.4.1 1.7 0 3.4-.7 4.7-1.9 1.4-1.4 1.9-3.2 1.5-5-.2-.8-.9-1.2-1.7-1.1-.8.2-1.2.9-1.1 1.7.3 1.2-.4 2-.7 2.4-.9.9-2.2 1.3-3.4 1-.8-.2-1.5.3-1.7 1.1s.2 1.5 1 1.7z"/><path d="M275.5 331.6c-.8 0-1.4.6-1.5 1.4 0 .8.6 1.4 1.4 1.5h.3c3.6 0 7-2.8 7.7-6.3.2-.8-.4-1.5-1.1-1.7-.8-.2-1.5.4-1.7 1.1-.4 2.3-2.8 4.2-5.1 4zm5.4 1.6c-.6.5-.6 1.4-.1 2 1.1 1.3 2.5 2.2 4.2 2.8.2.1.3.1.5.1.6 0 1.1-.3 1.3-.9.3-.7-.1-1.6-.8-1.8-1.2-.5-2.2-1.2-3-2.1-.6-.6-1.5-.6-2.1-.1zm-38.2 12.7c.5 0 .9 0 1.4-.1.8-.2 1.3-.9 1.1-1.7-.2-.8-.9-1.3-1.7-1.1-1.2.3-2.5-.1-3.4-1-.4-.4-1-1.2-.8-2.4.2-.8-.3-1.5-1.1-1.7-.8-.2-1.5.3-1.7 1.1-.4 1.8.1 3.7 1.5 5 1.2 1.2 2.9 1.9 4.7 1.9z"/><path d="M241.2 349.6h.3c.8 0 1.4-.7 1.4-1.5s-.7-1.4-1.5-1.4c-2.3.1-4.6-1.7-5.1-4-.2-.8-.9-1.3-1.7-1.1-.8.2-1.3.9-1.1 1.7.7 3.5 4.1 6.3 7.7 6.3zm-9.7 3.6c.2 0 .3 0 .5-.1 1.6-.6 3-1.6 4.2-2.8.5-.6.5-1.5-.1-2s-1.5-.5-2 .1c-.8.9-1.8 1.6-3 2.1-.7.3-1.1 1.1-.8 1.8 0 .6.6.9 1.2.9z"/></svg>';
      }
      line_item.options.forEach(function (option, indx) {
        var option_name = option.name.toUpperCase();
        var options_lbgth = line_item.options.length;
        if (option_name == "COLOR" || option_name == "COLOUR") {
          option.values.forEach(function (values, idx) {
            if (idx < 4) {
              var all_variant_title_available = "";
              var show_variable = 0;
              var select_price = '';
              var orig_price = '';
              var comp_price = '';
              var option_id = 0;
              var img_idd = "";
              var referal_unit = "";
              var unit_price = "";
              var image = '';
              line_item.variants.forEach(function (item, indx) {
                show_variable = 0;
                if (item.title.indexOf(values) != -1) {
                  if (select_price == 0) {
                    if (item.price != null && item.price != '') {
                      orig_price = item.price;
                      orig_price = Shopify.formatMoney(orig_price)
                    }
                    if (item.compare_at_price != null && item.compare_at_price != '') {
                      comp_price = item.compare_at_price;
                      comp_price = Shopify.formatMoney(comp_price)
                    }
                    
                    if (item.unit_price != undefined) {
                      unit_price = Shopify.formatMoney(item.unit_price);

                      if (item.unit_price_measurement.reference_value != 1) {
                        referal_unit =
                          item.unit_price_measurement.reference_value +
                          item.unit_price_measurement.reference_unit;
                      } else {
                        referal_unit =
                          item.unit_price_measurement.reference_unit;
                      }
                      var unit_price_referal =
                        unit_price + " / " + referal_unit;
                    } else {
                      unit_price_referal = "";
                    }
                    option_id = item.id;
                    if (item.featured_media != undefined) {
                      img_idd = item.featured_media.id;
                    }
                    if(item.featured_image != undefined){
                      image = item.featured_image.src;
                      if (image.indexOf('.jpg') > -1 ) {
                        var image_list = image.split('.jpg');
                        image = image_list[0] + '_380x.jpg' + image_list[1];
                      }else if (image.indexOf('.png') > -1 ){
                        var image_list = image.split('.png');
                        image = image_list[0] + '_380x.png' + image_list[1];
                      }else if((image.indexOf('.jpeg') > -1 )){
                        var image_list = image.split('.jpeg');
                        image = image_list[0] + '_380x.jpeg' + image_list[1];
                      }
                        
                    }
                    select_price = 1;
                  }
                  if (options_lbgth > 1) {
                    if (!item.available == "false") {
                      var quantity_available =
                        '<div class="quantity" available="' +
                        item.available +
                        '">' +
                        item.title +
                        "</div>";
                      all_variant_title_available =
                        all_variant_title_available + quantity_available;
                    } else {
                      var quantity_available =
                        '<div class="quantity" available="' +
                        item.available +
                        '">' +
                        item.title +
                        "</div>";
                      all_variant_title_available =
                        all_variant_title_available + quantity_available;
                      show_variable = 1;
                    }
                  }
                }
              });
              if (show_variable != 1) {
                var vlueee =
                  '<div class="grid-variant-input option-swatch" option-id="' +
                  option_id +
                  '" data-index="Color1" data-value="' +
                  values +
                  '" option-image="' +
                  img_idd +
                  '"image-src="' + 
                  image +
                  '" data-option-name="COLOR" referal-unit="' +
                  referal_unit +
                  '" unit-price="' +
                  unit_price +
                  '" data-price="' +
                  orig_price +
                  '" data-compare-price="' +
                  comp_price +
                  '">' +
                  '<input type="radio" id="radio-' +
                  option_id +
                  "-" +
                  index +
                  indx +
                  idx +
                  "-" +
                  img_idd +
                  '" name="Color-' +
                  index +
                  '">' +
                  '<label value="' +
                  values +
                  '" name="Color" for="radio-' +
                  option_id +
                  "-" +
                  index +
                  indx +
                  idx +
                  "-" +
                  img_idd +
                  '" class="grid-variant__button-label  " id="template--15766607298790__featured_collection-Color-1" style="background: ' +
                  values +
                  '">' +
                  values +
                  "</label>" +
                  '<div class="inventory_update" style="display:none" black="">' +
                  all_variant_title_available +
                  "</div></div>";
                all_options = all_options + vlueee;
              }
            }
          });
        }
      });
      var count_option = "";
      var _indx = line_item.options.findIndex(function (x) {
        var colr_sml = x.name.toLowerCase();
        if (colr_sml == "color") {
          return colr_sml == "color";
        } else if (colr_sml == "colour") {
          return colr_sml == "colour";
        }
      });
      var variant_index = line_item.variants.findIndex(function (x) {
        return x.available == true;
      });
      if (variant_index < 0) {
        variant_index = 0;
      }
      if (_indx > -1) {
        if (line_item.options[_indx].values.length > 4) {
          var remain_option = line_item.options[_indx].values.length - 4;
          count_option =
            '<div class="maximum-options-count">(' + remain_option + "+)</div>";
        }
      }
      var compare_price = "";
      if (line_item.variants[variant_index].compare_at_price != null) {
        compare_price = Shopify.formatMoney(
          line_item.variants[variant_index].compare_at_price
        );
      }
      var _imgr = "";
      if(line_item.variants && line_item.variants[0] && line_item.variants[0].featured_image){
        var image = line_item.variants[0].featured_image.src;
        if (image.indexOf('.jpg') > -1 ) {
          var image_list = image.split('.jpg');
          image = image_list[0] + '_380x.jpg' + image_list[1];
        }else if (image.indexOf('.png') > -1 ){
          var image_list = image.split('.png');
          image = image_list[0] + '_380x.png' + image_list[1];
        }else if((image.indexOf('.jpeg') > -1 )){
          var image_list = image.split('.jpeg');
          image = image_list[0] + '_380x.jpeg' + image_list[1];
        }
          
        _imgr =
        '<img src="' +
        image +
        '" alt="' +
        line_item.variants[0].title +
        '" loading="lazy">';
      }
      else if (line_item.featured_image != null) {
        _imgr =
          '<img src="' +
          line_item.featured_image +
          '" alt="' +
          line_item.featured_image +
          '" loading="lazy">';
      } else {
        _imgr =
          '<svg xmlns="http://www.w3.org/2000/svg" class="has-background-light" viewBox="0 0 525.5 525.5"><path d="M375.5 345.2c0-.1 0-.1 0 0 0-.1 0-.1 0 0-1.1-2.9-2.3-5.5-3.4-7.8-1.4-4.7-2.4-13.8-.5-19.8 3.4-10.6 3.6-40.6 1.2-54.5-2.3-14-12.3-29.8-18.5-36.9-5.3-6.2-12.8-14.9-15.4-17.9 8.6-5.6 13.3-13.3 14-23 0-.3 0-.6.1-.8.4-4.1-.6-9.9-3.9-13.5-2.1-2.3-4.8-3.5-8-3.5h-54.9c-.8-7.1-3-13-5.2-17.5-6.8-13.9-12.5-16.5-21.2-16.5h-.7c-8.7 0-14.4 2.5-21.2 16.5-2.2 4.5-4.4 10.4-5.2 17.5h-48.5c-3.2 0-5.9 1.2-8 3.5-3.2 3.6-4.3 9.3-3.9 13.5 0 .2 0 .5.1.8.7 9.8 5.4 17.4 14 23-2.6 3.1-10.1 11.7-15.4 17.9-6.1 7.2-16.1 22.9-18.5 36.9-2.2 13.3-1.2 47.4 1 54.9 1.1 3.8 1.4 14.5-.2 19.4-1.2 2.4-2.3 5-3.4 7.9-4.4 11.6-6.2 26.3-5 32.6 1.8 9.9 16.5 14.4 29.4 14.4h176.8c12.9 0 27.6-4.5 29.4-14.4 1.2-6.5-.5-21.1-5-32.7zm-97.7-178c.3-3.2.8-10.6-.2-18 2.4 4.3 5 10.5 5.9 18h-5.7zm-36.3-17.9c-1 7.4-.5 14.8-.2 18h-5.7c.9-7.5 3.5-13.7 5.9-18zm4.5-6.9c0-.1.1-.2.1-.4 4.4-5.3 8.4-5.8 13.1-5.8h.7c4.7 0 8.7.6 13.1 5.8 0 .1 0 .2.1.4 3.2 8.9 2.2 21.2 1.8 25h-30.7c-.4-3.8-1.3-16.1 1.8-25zm-70.7 42.5c0-.3 0-.6-.1-.9-.3-3.4.5-8.4 3.1-11.3 1-1.1 2.1-1.7 3.4-2.1l-.6.6c-2.8 3.1-3.7 8.1-3.3 11.6 0 .2 0 .5.1.8.3 3.5.9 11.7 10.6 18.8.3.2.8.2 1-.2.2-.3.2-.8-.2-1-9.2-6.7-9.8-14.4-10-17.7 0-.3 0-.6-.1-.8-.3-3.2.5-7.7 3-10.5.8-.8 1.7-1.5 2.6-1.9h155.7c1 .4 1.9 1.1 2.6 1.9 2.5 2.8 3.3 7.3 3 10.5 0 .2 0 .5-.1.8-.3 3.6-1 13.1-13.8 20.1-.3.2-.5.6-.3 1 .1.2.4.4.6.4.1 0 .2 0 .3-.1 13.5-7.5 14.3-17.5 14.6-21.3 0-.3 0-.5.1-.8.4-3.5-.5-8.5-3.3-11.6l-.6-.6c1.3.4 2.5 1.1 3.4 2.1 2.6 2.9 3.5 7.9 3.1 11.3 0 .3 0 .6-.1.9-1.5 20.9-23.6 31.4-65.5 31.4h-43.8c-41.8 0-63.9-10.5-65.4-31.4zm91 89.1h-7c0-1.5 0-3-.1-4.2-.2-12.5-2.2-31.1-2.7-35.1h3.6c.8 0 1.4-.6 1.4-1.4v-14.1h2.4v14.1c0 .8.6 1.4 1.4 1.4h3.7c-.4 3.9-2.4 22.6-2.7 35.1v4.2zm65.3 11.9h-16.8c-.4 0-.7.3-.7.7 0 .4.3.7.7.7h16.8v2.8h-62.2c0-.9-.1-1.9-.1-2.8h33.9c.4 0 .7-.3.7-.7 0-.4-.3-.7-.7-.7h-33.9c-.1-3.2-.1-6.3-.1-9h62.5v9zm-12.5 24.4h-6.3l.2-1.6h5.9l.2 1.6zm-5.8-4.5l1.6-12.3h2l1.6 12.3h-5.2zm-57-19.9h-62.4v-9h62.5c0 2.7 0 5.8-.1 9zm-62.4 1.4h62.4c0 .9-.1 1.8-.1 2.8H194v-2.8zm65.2 0h7.3c0 .9.1 1.8.1 2.8H259c.1-.9.1-1.8.1-2.8zm7.2-1.4h-7.2c.1-3.2.1-6.3.1-9h7c0 2.7 0 5.8.1 9zm-7.7-66.7v6.8h-9v-6.8h9zm-8.9 8.3h9v.7h-9v-.7zm0 2.1h9v2.3h-9v-2.3zm26-1.4h-9v-.7h9v.7zm-9 3.7v-2.3h9v2.3h-9zm9-5.9h-9v-6.8h9v6.8zm-119.3 91.1c-2.1-7.1-3-40.9-.9-53.6 2.2-13.5 11.9-28.6 17.8-35.6 5.6-6.5 13.5-15.7 15.7-18.3 11.4 6.4 28.7 9.6 51.8 9.6h6v14.1c0 .8.6 1.4 1.4 1.4h5.4c.3 3.1 2.4 22.4 2.7 35.1 0 1.2.1 2.6.1 4.2h-63.9c-.8 0-1.4.6-1.4 1.4v16.1c0 .8.6 1.4 1.4 1.4H256c-.8 11.8-2.8 24.7-8 33.3-2.6 4.4-4.9 8.5-6.9 12.2-.4.7-.1 1.6.6 1.9.2.1.4.2.6.2.5 0 1-.3 1.3-.8 1.9-3.7 4.2-7.7 6.8-12.1 5.4-9.1 7.6-22.5 8.4-34.7h7.8c.7 11.2 2.6 23.5 7.1 32.4.2.5.8.8 1.3.8.2 0 .4 0 .6-.2.7-.4 1-1.2.6-1.9-4.3-8.5-6.1-20.3-6.8-31.1H312l-2.4 18.6c-.1.4.1.8.3 1.1.3.3.7.5 1.1.5h9.6c.4 0 .8-.2 1.1-.5.3-.3.4-.7.3-1.1l-2.4-18.6H333c.8 0 1.4-.6 1.4-1.4v-16.1c0-.8-.6-1.4-1.4-1.4h-63.9c0-1.5 0-2.9.1-4.2.2-12.7 2.3-32 2.7-35.1h5.2c.8 0 1.4-.6 1.4-1.4v-14.1h6.2c23.1 0 40.4-3.2 51.8-9.6 2.3 2.6 10.1 11.8 15.7 18.3 5.9 6.9 15.6 22.1 17.8 35.6 2.2 13.4 2 43.2-1.1 53.1-1.2 3.9-1.4 8.7-1 13-1.7-2.8-2.9-4.4-3-4.6-.2-.3-.6-.5-.9-.6h-.5c-.2 0-.4.1-.5.2-.6.5-.8 1.4-.3 2 0 0 .2.3.5.8 1.4 2.1 5.6 8.4 8.9 16.7h-42.9v-43.8c0-.8-.6-1.4-1.4-1.4s-1.4.6-1.4 1.4v44.9c0 .1-.1.2-.1.3 0 .1 0 .2.1.3v9c-1.1 2-3.9 3.7-10.5 3.7h-7.5c-.4 0-.7.3-.7.7 0 .4.3.7.7.7h7.5c5 0 8.5-.9 10.5-2.8-.1 3.1-1.5 6.5-10.5 6.5H210.4c-9 0-10.5-3.4-10.5-6.5 2 1.9 5.5 2.8 10.5 2.8h67.4c.4 0 .7-.3.7-.7 0-.4-.3-.7-.7-.7h-67.4c-6.7 0-9.4-1.7-10.5-3.7v-54.5c0-.8-.6-1.4-1.4-1.4s-1.4.6-1.4 1.4v43.8h-43.6c4.2-10.2 9.4-17.4 9.5-17.5.5-.6.3-1.5-.3-2s-1.5-.3-2 .3c-.1.2-1.4 2-3.2 5 .1-4.9-.4-10.2-1.1-12.8zm221.4 60.2c-1.5 8.3-14.9 12-26.6 12H174.4c-11.8 0-25.1-3.8-26.6-12-1-5.7.6-19.3 4.6-30.2H197v9.8c0 6.4 4.5 9.7 13.4 9.7h105.4c8.9 0 13.4-3.3 13.4-9.7v-9.8h44c4 10.9 5.6 24.5 4.6 30.2z"/><path d="M286.1 359.3c0 .4.3.7.7.7h14.7c.4 0 .7-.3.7-.7 0-.4-.3-.7-.7-.7h-14.7c-.3 0-.7.3-.7.7zm5.3-145.6c13.5-.5 24.7-2.3 33.5-5.3.4-.1.6-.5.4-.9-.1-.4-.5-.6-.9-.4-8.6 3-19.7 4.7-33 5.2-.4 0-.7.3-.7.7 0 .4.3.7.7.7zm-11.3.1c.4 0 .7-.3.7-.7 0-.4-.3-.7-.7-.7H242c-19.9 0-35.3-2.5-45.9-7.4-.4-.2-.8 0-.9.3-.2.4 0 .8.3.9 10.8 5 26.4 7.5 46.5 7.5h38.1zm-7.2 116.9c.4.1.9.1 1.4.1 1.7 0 3.4-.7 4.7-1.9 1.4-1.4 1.9-3.2 1.5-5-.2-.8-.9-1.2-1.7-1.1-.8.2-1.2.9-1.1 1.7.3 1.2-.4 2-.7 2.4-.9.9-2.2 1.3-3.4 1-.8-.2-1.5.3-1.7 1.1s.2 1.5 1 1.7z"/><path d="M275.5 331.6c-.8 0-1.4.6-1.5 1.4 0 .8.6 1.4 1.4 1.5h.3c3.6 0 7-2.8 7.7-6.3.2-.8-.4-1.5-1.1-1.7-.8-.2-1.5.4-1.7 1.1-.4 2.3-2.8 4.2-5.1 4zm5.4 1.6c-.6.5-.6 1.4-.1 2 1.1 1.3 2.5 2.2 4.2 2.8.2.1.3.1.5.1.6 0 1.1-.3 1.3-.9.3-.7-.1-1.6-.8-1.8-1.2-.5-2.2-1.2-3-2.1-.6-.6-1.5-.6-2.1-.1zm-38.2 12.7c.5 0 .9 0 1.4-.1.8-.2 1.3-.9 1.1-1.7-.2-.8-.9-1.3-1.7-1.1-1.2.3-2.5-.1-3.4-1-.4-.4-1-1.2-.8-2.4.2-.8-.3-1.5-1.1-1.7-.8-.2-1.5.3-1.7 1.1-.4 1.8.1 3.7 1.5 5 1.2 1.2 2.9 1.9 4.7 1.9z"/><path d="M241.2 349.6h.3c.8 0 1.4-.7 1.4-1.5s-.7-1.4-1.5-1.4c-2.3.1-4.6-1.7-5.1-4-.2-.8-.9-1.3-1.7-1.1-.8.2-1.3.9-1.1 1.7.7 3.5 4.1 6.3 7.7 6.3zm-9.7 3.6c.2 0 .3 0 .5-.1 1.6-.6 3-1.6 4.2-2.8.5-.6.5-1.5-.1-2s-1.5-.5-2 .1c-.8.9-1.8 1.6-3 2.1-.7.3-1.1 1.1-.8 1.8 0 .6.6.9 1.2.9z"/></svg>';
      }
      if (line_item.available) {
        var _form =
          '<button type="button" tabindex="0" class="quick-add-btn quick_view_btn enabled button button--primary" title="Quick View" role="button" data-product="' +
          line_item.handle +
          `">${window.variantStrings.quickview}</button>`;
        var _badge = "";
      } else {
        var _form = "";
        var _badge = `<span class="badge color-soldout" aria-hidden="true">${window.variantStrings.soldOut}</span>`;
      }
      if(window.enable_color_swatch){
        var color_swatches = '<div class="grid-options">' +
        '<fieldset class="js product-form__inpt color__main" option-index="0" data_options="Color">' +
        '<div class="product-grid-option-name">' +
        all_options +
        "</div>" +
        count_option +
        "</fieldset>" +
        "</div>"
      }else{
        var color_swatches = '';
      }

       var get_style = document.querySelector('.recentView-template').dataset.style;
      
       if(get_style == 'default' || get_style == 'electronic'){

        var template_append_grid =
        '<div class="recentView-item" data-item-index="' +
        index +
        '"><div class="card-wrapper">' +
        '<span class="is-hidden">' +
        line_item.title +
        "</span>" +
        // '<div class="card card--product" tabindex="-1">'+
        '<div class="card card--product" tabindex="-1" data-href="' +
        Shopify.routes.root + line_item.url.slice(1,line_item.url.length) +
        '">' +
        '<div class="onhover-card">' +
        '<div class="card_icons">' +
        '<a href="#" onclick="return false;" class="quick_view_btn enabled" title="Quick View" data-product="' +
        line_item.handle +
        '">' +
        '<span class="screen-reader-only">Quick View</span> <svg class="icon--mrparker-search vib-center" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 20 20" height="18px" xml:space="preserve">' +
        '<g class="hover-fill" fill="var(--button-text)">' +
        '<path d="M19.875 9.625c-.125-.25-4.5-5.875-9.875-5.875S.25 9.375.125 9.625a.797.797 0 0 0 0 .75c.125.25 4.5 5.875 9.875 5.875s9.75-5.625 9.875-5.875a.797.797 0 0 0 0-.75ZM10 15c-4 0-7.5-3.75-8.625-5C2.5 8.75 6 5 10 5s7.5 3.75 8.625 5C17.5 11.25 14 15 10 15Z"></path>' +
        '<path d="M10 6.875A3.095 3.095 0 0 0 6.875 10 3.095 3.095 0 0 0 10 13.125 3.095 3.095 0 0 0 13.125 10 3.095 3.095 0 0 0 10 6.875Zm0 5C9 11.875 8.125 11 8.125 10S9 8.125 10 8.125 11.875 9 11.875 10 11 11.875 10 11.875Z"></path></g>' +
        "</svg>" +     
        "</a>" +
        "</div>" +
        "</div>" +
        '<div class="card__inner"><div>' +
        '<div class="media">' +
        _imgr +
        "</div>" +
        '</div><div class="card_badge">' +
        _badge +
        "</div>" +
        '<div class="link-wrapper hover_show">' +
        _form +
        "</div>" +
        "</div>" +
        "</div>" +
        '<div class="card-details">' +
        '<div class="card-details__wrapper"><a href="' +
        line_item.url +
        '">' +
        '<span class="card-details__text h4">' +
        line_item.title +
        "</span>" +
        '</a><span class=""></span>' +
        '<div class="price price--on-sale ">' +
        '<dl><div class="price__regular">' +
        "<dt>" +
        '<span class="is-hidden">Regular price</span>' +
        "</dt>" +
        "<dd>" +
        '<span class="price-item price-item--regular">' +
        Shopify.formatMoney(line_item.price) +
        "</span>" +
        "</dd>" +
        "</div>" +
        '<div class="price__sale">' +
        '<dt class="price__compare_hidden">' +
        ' <span class="is-hidden">Regular price</span>' +
        "</dt>" +
        "<dt>" +
        ' <span class="is-hidden">Sale price</span>' +
        " </dt>" +
        ' <dd class="price__compare">' +
        ' <span class="price-item price-item--regular">' +
        compare_price +
        "</span>" +
        "</dd>" +
        '<dd class="sale___price">' +
        '<span class="price-item price-item--sale">' +
        Shopify.formatMoney(line_item.variants[variant_index].price) +
        "</span>" +
        "</dd>" +
        "</div>" +
        '<small class="unit-price caption is-hidden">' +
        '<dt class="is-hidden">Unit price</dt>' +
        "<dd>" +
        "<span unit_price></span>" +
        '<span aria-hidden="true">/</span>' +
        '<span class="is-hidden">&nbsp;per&nbsp;</span>' +
        "<span refereal_unit></span>" +
        "</dd>" +
        "</small>" +
        "</dl></div>" +
        color_swatches +
        "</div>" +
        "</div>" +
        "</div></div>";

       }else{

      var template_append_grid =
        '<div class="recentView-item" data-item-index="' +
        index +
        '"><div class="card-wrapper">' +
        '<span class="is-hidden">' +
        line_item.title +
        "</span>" +
        // '<div class="card card--product" tabindex="-1">'+
        '<div class="card card--product" tabindex="-1" data-href="' +
        Shopify.routes.root + line_item.url.slice(1,line_item.url.length) +
        '">' +
        '<div class="onhover-card">' +
        '<div class="card_icons">' +
        '<a href="#" onclick="return false;" class="quick_view_btn enabled" title="Quick View" data-product="' +
        line_item.handle +
        '">' +
        '<span class="screen-reader-only">Quick View</span> <svg title="Quick View" class="icon--mrparker-search vib-center quick_view_zoom" width="16" height="16" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">'+
        '<path d="M9.0155 8.3085L11.157 10.4495L10.4495 11.157L8.3085 9.0155C7.51187 9.65411 6.521 10.0015 5.5 10C3.016 10 1 7.984 1 5.5C1 3.016 3.016 1 5.5 1C7.984 1 10 3.016 10 5.5C10.0015 6.521 9.65411 7.51187 9.0155 8.3085ZM8.0125 7.9375C8.64706 7.28494 9.00143 6.41021 9 5.5C9 3.566 7.4335 2 5.5 2C3.566 2 2 3.566 2 5.5C2 7.4335 3.566 9 5.5 9C6.41021 9.00143 7.28494 8.64706 7.9375 8.0125L8.0125 7.9375V7.9375ZM5 5V3.5H6V5H7.5V6H6V7.5H5V6H3.5V5H5Z" fill="var(--color-base-solid-button-labels)"/>'+
        '</svg>'+      
        "</a>" +
        "</div>" +
        "</div>" +
        '<div class="card__inner"><div>' +
        '<div class="media">' +
        _imgr +
        "</div>" +
        '</div><div class="card_badge">' +
        _badge +
        "</div>" +
        '<div class="link-wrapper hover_show">' +
        _form +
        "</div>" +
        "</div>" +
        "</div>" +
        '<div class="card-details">' +
        '<div class="card-details__wrapper"><a href="' +
        line_item.url +
        '">' +
        '<span class="card-details__text h4">' +
        line_item.title +
        "</span>" +
        '</a><span class=""></span>' +
        '<div class="price price--on-sale ">' +
        '<dl><div class="price__regular">' +
        "<dt>" +
        '<span class="is-hidden">Regular price</span>' +
        "</dt>" +
        "<dd>" +
        '<span class="price-item price-item--regular">' +
        Shopify.formatMoney(line_item.price) +
        "</span>" +
        "</dd>" +
        "</div>" +
        '<div class="price__sale">' +
        '<dt class="price__compare_hidden">' +
        ' <span class="is-hidden">Regular price</span>' +
        "</dt>" +
        "<dt>" +
        ' <span class="is-hidden">Sale price</span>' +
        " </dt>" +
        ' <dd class="price__compare">' +
        ' <span class="price-item price-item--regular">' +
        compare_price +
        "</span>" +
        "</dd>" +
        '<dd class="sale___price">' +
        '<span class="price-item price-item--sale">' +
        Shopify.formatMoney(line_item.variants[variant_index].price) +
        "</span>" +
        "</dd>" +
        "</div>" +
        '<small class="unit-price caption is-hidden">' +
        '<dt class="is-hidden">Unit price</dt>' +
        "<dd>" +
        "<span unit_price></span>" +
        '<span aria-hidden="true">/</span>' +
        '<span class="is-hidden">&nbsp;per&nbsp;</span>' +
        "<span refereal_unit></span>" +
        "</dd>" +
        "</small>" +
        "</dl></div>" +
        color_swatches +
        "</div>" +
        "</div>" +
        "</div></div>";

      }

      document.querySelector(recentlyViewed.selectors.outputContainer).innerHTML += template_append_grid;

      var elemRecentViewItem = document.querySelector(`.recentView-item[data-item-index="${index}"]`);

      if (line_item.variants[variant_index].compare_at_price == null) {
        let elemSaleBadge = elemRecentViewItem.querySelector('.card_badge span.badge.color-sale');
        if (elemSaleBadge != undefined) {
          elemSaleBadge.style.display = 'none';
        }
      }

      var elemFirstOptionSwatch = elemRecentViewItem.querySelectorAll('.product-grid-option-name .option-swatch')[0]
      if (elemFirstOptionSwatch != undefined) {
        elemFirstOptionSwatch.querySelector('label').classList.add('selected');
      }

      var elemSalePrice = elemRecentViewItem.querySelector('.sale___price span.price-item.price-item--regular');
      if (elemSalePrice != undefined && elemFirstOptionSwatch != undefined) {
        elemSalePrice.innerText = elemFirstOptionSwatch.dataset.price;
      }

      if (line_item.variants[variant_index].unit_price != undefined) {
        elemRecentViewItem.querySelector('small.unit-price').classList.remove('is-hidden');
        var unit_price = Shopify.formatMoney(line_item.variants[variant_index].unit_price);
        var referal_unit = "";
        if (line_item.variants[variant_index].unit_price_measurement.reference_value != 1) {
          referal_unit = line_item.variants[variant_index].unit_price_measurement.reference_value +
                         line_item.variants[variant_index].unit_price_measurement.reference_unit;
        } else {
          referal_unit = line_item.variants[variant_index].unit_price_measurement.reference_unit;
        }
      } else {
        elemRecentViewItem.querySelector('small.unit-price').classList.add('is-hidden');
      }

      elemRecentViewItem.querySelector('.unit-price [unit_price]').innerText = unit_price;
      elemRecentViewItem.querySelector('.unit-price [refereal_unit]').innerText = referal_unit;
    });
    document.querySelector('.js-recentView-template').style.display = '';
  }),
  (recentlyViewed.Productrecent = function () {
    if (JSON.parse(localStorage.getItem("recentlyViewed")) != null) {
      var products = JSON.parse(localStorage.getItem("recentlyViewed"));
    } else {
      var products = [];
    }
    products.unshift(recentlyViewed.currentProduct);
    products = products.filter(recentlyViewed.onlyUnique);
    localStorage.setItem("recentlyViewed", JSON.stringify(products));
  }),
  (recentlyViewed.onlyUnique = function (value, index, self) {
    return self.indexOf(value) === index;
  });
