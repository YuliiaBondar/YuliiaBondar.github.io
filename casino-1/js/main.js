document.addEventListener('DOMContentLoaded', function() {
    const date = new Date();
    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    document.querySelector('.updated-date').innerText = day + '/' + month + '/' + year;

    const faqItems = document.querySelectorAll('.faq__item_title');
    for (let i = 0; i < faqItems.length; i++) {
        faqItems[i].addEventListener('click', toggleItem, false);
    }
    function toggleItem() {
        let itemClass = this.className;
        for (let i = 0; i < faqItems.length; i++) {
            faqItems[i].className = 'faq__item_title closed';
        }
        if (itemClass === 'faq__item_title closed') {
            this.className = 'faq__item_title';
        }
    }


    const arrowTop = document.querySelector('.arrow__top');
    arrowTop.hidden = true;

    function showArrows() {
        // высота окна (клиентской части области просмотра браузера)
        let viewportHeight = document.documentElement.clientHeight;

        if (pageYOffset < viewportHeight) arrowTop.hidden = true;
        else arrowTop.hidden = false;

        // высота HTML-страницы
        let htmlHeight = document.documentElement.scrollHeight;
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
