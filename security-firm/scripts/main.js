const sliderMain = $('.slider__main');

$(window).ready(function(){
    if (window.innerWidth < 768) {
        if (!sliderMain.hasClass('slick-initialized')){
            sliderMain.slick({
                infinite: true,
                slidesToShow: 3,
                slidesToScroll: 1,
                arrows: false,
                dots: false,
                autoplay: true
            });
        }
    } else {
        if (sliderMain.hasClass('slick-initialized')){
            sliderMain.slick('unslick');
        }
    }
});

$(window).resize(function(){
    if (window.innerWidth < 768) {
        if (!sliderMain.hasClass('slick-initialized')){
            sliderMain.slick({
                infinite: true,
                slidesToShow: 3,
                slidesToScroll: 1,
                arrows: false,
                dots: false,
                autoplay: true
            });
        }
    } else {
        if (sliderMain.hasClass('slick-initialized')){
            sliderMain.slick('unslick');
        }
    }
});