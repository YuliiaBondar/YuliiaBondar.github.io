window.addEventListener('DOMContentLoaded', () => {
    const gallery = document.getElementById('gallery');

    // Викликаємо функцію для завантаження зображень з папки
    loadImagesFromFolder('images/', gallery);
});

function loadImagesFromFolder(folder, targetElement) {
    // Отримуємо список файлів з папки
    fetch(folder)
        .then(response => response.text())
        .then(text => {
            const parser = new DOMParser();
            const htmlDocument = parser.parseFromString(text, 'text/html');
            const imageElements = htmlDocument.querySelectorAll('a[href$=".jpg"], a[href$=".jpeg"], a[href$=".png"], a[href$=".gif"]');

            // Проходимо по кожному зображенню та додаємо його на сторінку
            imageElements.forEach(imageElement => {
                const imageUrl = imageElement.getAttribute('href');
                const imageName = imageElement.textContent;
                const image = document.createElement('img');
                image.src = imageUrl;

                const imageContainer = document.createElement('div');
                imageContainer.className = 'image-container';
                const nameElement = document.createElement('div');
                nameElement.textContent = imageName.slice(0, imageName.lastIndexOf('.'));
                const imageWrapper = document.createElement('div');
                imageWrapper.className = 'image-wrapper';
                imageWrapper.appendChild(image);
                imageContainer.appendChild(imageWrapper);
                imageContainer.appendChild(nameElement);
                targetElement.appendChild(imageContainer);
            });
        })
        .catch(error => {
            console.error('Помилка завантаження зображень:', error);
        });
}
