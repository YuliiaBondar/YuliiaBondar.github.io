document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(
    ".js-footer-nav .menu-item-has-children"
  );
  const ngLinks = document.querySelectorAll(
    ".js-footer-nav .no-register_block a"
  );

  const removeStyles = (list) => {
    list.forEach((item) => {
      item.children[0].classList.remove("is-opened");
      item.children[1].classList.remove("is-opened");
    });
  };

  items.forEach((item) => {
    const link = item.children[0];
    const menu = item.children[1];

    link.addEventListener("click", (e) => {
      e.preventDefault();

      if (link.matches(".is-opened")) {
        link.classList.remove("is-opened");
        menu.classList.remove("is-opened");
      } else {
        removeStyles(items);
        link.classList.toggle("is-opened");
        menu.classList.toggle("is-opened");
      }
    });
  });

  // ng links
  ngLinks.forEach((link) =>
    link.addEventListener("click", (e) => e.preventDefault())
  );
});
