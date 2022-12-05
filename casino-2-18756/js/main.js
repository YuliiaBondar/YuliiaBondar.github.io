document.addEventListener('DOMContentLoaded', function() {
    const date = new Date();
    const year = date.getFullYear();
    document.querySelector('.year').innerText = year;



    const arrowTop = document.querySelector('.arrow__top');
    arrowTop.hidden = true;

    function showArrows() {
        if (pageYOffset < 250) arrowTop.hidden = true;
        else arrowTop.hidden = false;
    }

    window.addEventListener("scroll", showArrows);
    window.addEventListener("resize", showArrows);

    arrowTop.addEventListener("click", function() {
        scrollTo({
            top: pageXOffset,
            left: 0,
            behavior: "smooth"});
    });
});
