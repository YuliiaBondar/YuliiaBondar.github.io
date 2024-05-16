let sortedLang = "all";

const imageExists = async (imageUrl) => {
	try {
		const response = await fetch(imageUrl, { method: "HEAD" });
		return response.ok;
	} catch {
		return false;
	}
};

const mainStuff = async (reactTemplates) => {
	const iframes = document.querySelector(".screenshots");
	const filter = document.querySelector(".filter");
	const loader = document.querySelector(".loader");

	filter.classList.add("inactive");
	loader.classList.remove("hidden");

	// Используем Promise.all для параллельной проверки существования изображений
	const existencePromises = reactTemplates.map((templ) => {
		return imageExists(`./images/${templ}.jpg`);
	});

	const existences = await Promise.all(existencePromises);

	// Перебираем результаты и отображаем существующие изображения
	existences.forEach((exists, index) => {
		const templ = reactTemplates[index];
		if (exists) {
			iframes.insertAdjacentHTML(
				"beforeend",
				`<div class="screenshots-item">
                     <div class="screenshots-inner">
                         <div class="screenshots-img">
                             <a href="./images/${templ}.jpg">
                                 <img src="./images/${templ}.jpg" loading="lazy" />
                             </a>
                         </div>
                     </div>
                     <div class="screenshots-title">${templ}</div>
                 </div>`
			);
		} else {
			console.log(`${templ} не найдено в папке с изображениями`);
		}
	});

	filter.classList.remove("inactive");
	loader.classList.add("hidden");
};

const filterAndDisplayTemplates = async () => {
	const response = await fetch("./templates.json");
	const templatesObj = await response.json();

	const languageFilter = {
		all: () => true,
		ar: (langs) => langs.includes("ar"),
		es: (langs) => langs.includes("ea") || langs.includes("es"),
		de: (langs) => langs.includes("de"),
		en: (langs) => langs.includes("en"),
		it: (langs) => langs.includes("it"),
		pt: (langs) => langs.includes("pt"),
		nl: (langs) => langs.includes("nl"),
	};

	let filteredTemplates = templatesObj.data.filter((template) => {
		const templateLang = template.languages;
		return languageFilter[sortedLang](templateLang);
	});

	filteredTemplates.sort((a, b) => a.template.localeCompare(b.template));

	mainStuff(filteredTemplates.map((template) => template.template));
};

const changeLanguage = async (newLang) => {
	sortedLang = newLang;
	await filterAndDisplayTemplates();
};

filterAndDisplayTemplates();

document.querySelectorAll(".button").forEach((button) => {
	button.addEventListener("click", async (event) => {
		const iframes = document.querySelector(".screenshots");

		iframes.innerHTML = "";

		document.querySelector(".title__filter").innerText = event.target.innerText;

		const selectedLang = event.target.getAttribute("data-lang");

		await changeLanguage(selectedLang);
	});
});

const backToTopButton = document.getElementById("backToTop");

const scrollToTop = () => {
	window.scrollTo({
		top: 0,
		behavior: "smooth",
	});
};

backToTopButton.addEventListener("click", scrollToTop);

window.addEventListener("scroll", () => {
	if (window.pageYOffset > 700) {
		backToTopButton.classList.remove("hidden");
	} else {
		backToTopButton.classList.add("hidden");
	}
});
