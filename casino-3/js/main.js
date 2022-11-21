document.addEventListener('DOMContentLoaded', function() {
    const date = new Date();
    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    const monthNum = date.getMonth();
    const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][monthNum];
    const monthF = ['January', 'February', 'March', 'April', 'May', 'June', 'Jule', 'August', 'September', 'October', 'November', 'December'][monthNum];
    const year = date.getFullYear();
    document.querySelector('.time').innerText = month + '. ' + day;
    document.querySelector('.time2').innerText = monthF + ' ' + year;
    document.querySelector('.time3').innerText = monthF + ' ' + year;
    document.querySelector('.time4').innerText = year;

    const arrowTop = document.querySelector('.arrow__top');
    arrowTop.hidden = true;

    function showArrows() {
        let anchorHeight = document.querySelector('.arrow__anchor').getBoundingClientRect().top + window.pageYOffset;
        if (pageYOffset < anchorHeight) arrowTop.style.display = 'none';
        else arrowTop.style.display = 'flex';
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
