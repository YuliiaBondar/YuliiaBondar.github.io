// Function to check if an image exists
const imageExists = (imageUrl) => {
	return new Promise((resolve) => {
		const img = new Image();
		img.onload = () => resolve(true);
		img.onerror = () => resolve(false);
		img.src = imageUrl;
	});
};

let sortedLang = "all"; // Current language for filtering

// Function to change language and filter templates
const changeLanguage = (newLang) => {
	sortedLang = newLang;
	filterAndDisplayTemplates();
};

// Function to filter and display templates
const filterAndDisplayTemplates = async () => {
	// Fetch templates data from JSON file
	const response = await fetch("./templates.json");
	const templatesObj = await response.json();

	// Define the filter criteria for each language
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

	// Filter templates based on the selected language
	let filteredTemplates = templatesObj.data.filter((template) => {
		const templateLang = template.languages;
		return languageFilter[sortedLang](templateLang);
	});

	// Sort the filtered templates alphabetically by their template name
	filteredTemplates.sort((a, b) => a.template.localeCompare(b.template));

	// Pass the sorted templates to the function that displays them
	mainStuff(filteredTemplates.map((template) => template.template));
};

// Attach language change function to button clicks
document.querySelectorAll(".button").forEach((button) => {
	button.addEventListener("click", (event) => {
		const iframes = document.querySelector(".screenshots");
		// Clear any existing content
		iframes.innerHTML = "";

		document.querySelector(".title__filter").innerText = event.target.innerText;
		const selectedLang = event.target.getAttribute("data-lang");
		changeLanguage(selectedLang);
	});
});

// Function to display filtered templates
const mainStuff = async (reactTemplates) => {
	// Get the container element for displaying templates
	const iframes = document.querySelector(".screenshots");
	const filter = document.querySelector(".filter");
	const loader = document.querySelector(".loader");
	filter.classList.add("inactive");
	loader.classList.remove("hidden");

	// Iterate through each template name
	for (const templ of reactTemplates) {
		// Check if the image exists
		const exists = await imageExists(`./images/${templ}.jpg`);
		if (exists) {
			// If the image exists, create HTML content and append it to the container
			iframes.insertAdjacentHTML(
				"beforeend",
				`
                <div class="screenshots-item">
                    <div class="screenshots-inner">
                        <div class="screenshots-img">
                            <a href="./images/${templ}.jpg">
                                <img src="./images/${templ}.jpg" loading="lazy" />
                            </a>
                        </div>
                    </div>
                    <div class="screenshots-title">
                        ${templ}
                    </div>
                </div>
                `
			);
		} else {
			// Log message if image doesn't exist
			console.log(`${templ} doesn't exist in folder`);
		}
	}
	return [filter.classList.remove("inactive"), loader.classList.add("hidden")];
};

// Initial call to display all templates in alphabetical order
filterAndDisplayTemplates();

const backToTopButton = document.getElementById("backToTop");

function scrollToTop() {
	window.scrollTo({
		top: 0,
		behavior: "smooth",
	});
}

backToTopButton.addEventListener("click", scrollToTop);

window.addEventListener("scroll", function () {
	if (window.pageYOffset > 700) {
		backToTopButton.classList.remove("hidden");
	} else {
		backToTopButton.classList.add("hidden");
	}
});
