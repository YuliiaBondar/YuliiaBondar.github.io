$('.js-scroll').click(function (e) {
  e.preventDefault();
  if (($(window).width() >= 1200)) {
    $('body').addClass('popup-form-visible');
  } else {
    var id = $(this).attr("href"),
      top = $(id).offset().top;
    $("body,html").animate({ scrollTop: top }, 1000);
  }
});
$('.sticky-form__wrapper').click(function (e) {
  if ((!e.target.closest('.top__form_wrapper')) && !($(window).width() < 1200)) {
    $('body').removeClass('popup-form-visible');
  }
});
$('.popup-form__close-icon').click(function (e) {
  e.preventDefault();
  $('body').removeClass('popup-form-visible');
});
$(window).resize(function(){
  if ($(window).width() < 1200) {
    $('body').removeClass('popup-form-visible');
  }
});