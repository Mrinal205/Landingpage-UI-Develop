function handleNewsletterSubmit(event) {
  event.preventDefault();

  var $form = $(this);

  // prevent multiple submits
  if ($form.is('.newsletter-form--is-loading')) {
    return false;
  }

  // simple html5 validation
  var field = $form.find('input[type=email]').get(0);

  // if valid, submit the form
  if (field.checkValidity() && field.value !== '') {
    var params = $form.serialize() + "&ajax=1";

    // set as loading
    $form.addClass('newsletter-form--is-loading');

    $.ajax({
      url: $form.prop('action'),
      data: params,
      dataType: "jsonp"
    }).done(function(response) {
      $form.html('<p class="newsletter-form__success-message">Thank you for signing up to Moon Assist!</p>');
    }).fail(function(jqXHR, textStatus) {
      console.error("Request failed: " + textStatus);
    }).always(function(){
      $form.removeClass('newsletter-form--is-loading');
    })

    // and reset value
    field.value = '';
    $(this).find('.newsletter-form__error').removeClass('newsletter-form__error--is-visible');

  } else {
    $(this).find('.newsletter-form__error').addClass('newsletter-form__error--is-visible');
  }

}

/**
 * Handle Support form submission
 *
 * @param {Object} event
 * @returns
 */
function handleSupportFormSubmit(event) {
  event.preventDefault();

  var $form = $(this);

  // prevent multiple submits
  if ($form.is('.contact-form--is-loading')) {
    return false;
  }

  // simple html5 validation
  var $fields = $form.find('input[name=name], input[name=email], textarea');
  var isValid = true;

  var errorClass = 'contact-form__error--is-visible'

  $fields.each(function(index, field) {
    if (field.checkValidity() === false || field.value === '') {
      isValid = false;
      $(field).parent().find('.contact-form__error').addClass(errorClass)
    } else {
      $(field).parent().find('.contact-form__error').removeClass(errorClass)
    }
  });


  if (isValid === false) {
    return;
  }

  $.ajax({
    url: $form.prop('action'),
    method: 'POST',
    data: $form.serialize()
  }).done(function(response) {
    $message = $('.contact-form__success-message');
    $form.html($message.clone());
    $('.contact-form__success-message').fadeIn();
  }).fail(function(jqXHR, textStatus) {
    console.error("Request failed: " + textStatus);
  }).always(function(){
    $form.removeClass('contact-form--is-loading');
  })
}

/**
 * Handle response from coinmarket app
 * @param {Array} data
 */
function handleTicker(data) {
  $.each(data,function(idx,coin) {
    var $coinDiv = $('[data-coin-id=' + coin.symbol);
    $coinDiv.find('.coin__price').html(parseFloat(coin.price_usd).toFixed(2));
    $coinDiv.find('.coin__change').html(coin.percent_change_24h);
    $coinDiv.find('.coin__change').addClass(coin.percent_change_24h > 0 ? 'up': 'down');
  });

  $('.coin__change').each(function(){
    var change = parseFloat($(this).html());
    $(this).html(Math.abs(change));
    if(Math.abs(change) > 0){
      $(this).removeClass('down up').addClass(change < 0 ? 'down' : 'up');
    }
  });

  $('.exchange-rates').removeClass('exchange-rates--loading');
}

/**
 * Handle paralax effect on homepage
 */
function initInterfaceParalax() {
  var $image = $('.app-interface__image');
  if ($image.length === 0 || $(window).width() < 640) {
    return;
  }

  var scrollDelay = 720;

  $(window).on('scroll', function() {
    var scrollTop = $(window).scrollTop();
    if (scrollTop < scrollDelay || scrollTop > 1600) {
      return;
    }
    var imgPos = -1 * (scrollTop - scrollDelay) / 6 + 'px';
    $image.css('transform', 'translateY(' + imgPos + ')');
  });
}

function initExternalLinksHandling() {
  $links = $('.faq a, .static-content a, [rel="external"]')
  $links.on('click', function(event) {
    $link = $(this)
    // only open external & absolute links in the new tab
    if ($link.attr('href').indexOf('//') > -1) {
      event.preventDefault()
      window.open($link.prop('href'));
    }
  });
}

function initFaq() {
  var $faqItems = $('.faq__item-title');
  if ($faqItems.length === 0) {
    return;
  }

  // bind click events
  $faqItems.on('click', function(event) {
    $(this).next().toggleClass('faq__item-content--collapsed');
  });

  // make first visible
  $('.faq__item-title').first().addClass('faq__item-title--active');
  $('.faq__item-content').first().removeClass('faq__item-content--collapsed');
}

jQuery(document).ready(function($){
  // newsletter form handling
  $('.newsletter-form').on('submit', handleNewsletterSubmit);

  // Coin ticker handling
  $.ajax('https://api.coinmarketcap.com/v1/ticker/?limit=50').done(handleTicker);

  // Homepage paralax
  // initInterfaceParalax();

  // Handle external links
  initExternalLinksHandling();

  // Handle FAQ links
  // initFaq();

  // Support form handling
  $('.contact-form__form').on('submit', handleSupportFormSubmit);
});
