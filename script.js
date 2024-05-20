document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById("searchInput");
    const countryCards = document.getElementById("countryCards");
    const loader = document.getElementById("loader");
    const content = document.getElementById("content");
    const themeStylesheet = document.getElementById("themeStylesheet");
    const toggleThemeButton = document.getElementById("toggleThemeButton");

    let allCountries = []; // Variable para almacenar todos los países

    // Mostrar loader
    loader.style.display = "block";
    content.style.display = "none";

    // Hacer una solicitud GET a la API
    fetch("https://restcountries.com/v3.1/all")
        .then(response => {
            if (!response.ok) {
                throw new Error("No se pudo obtener la información de los países.");
            }
            return response.json();
        })
        .then(data => {
            allCountries = data; // Almacenar todos los países en la variable

            // Mezclar aleatoriamente los países
            shuffleArray(allCountries);

            // Mostrar todos los países al cargar la página
            displayCountries(allCountries);

            // Ocultar loader y mostrar contenido
            loader.style.display = "none";
            content.style.display = "block";

            // Filtrar países al escribir en la barra de búsqueda
            searchInput.addEventListener("input", function() {
                const searchTerm = searchInput.value.toLowerCase();
                const filteredCountries = allCountries.filter(country =>
                    country.name.common.toLowerCase().includes(searchTerm)
                );
                displayCountries(filteredCountries);
            });
        })
        .catch(error => {
            console.error("Error cargando datos:", error);
            displayErrorMessage("Error cargando datos. Por favor, intenta nuevamente más tarde.");
        });

    // Función para mostrar tarjetas de países
    function displayCountries(countries) {
        countryCards.innerHTML = ""; // Limpiar contenido previo
        countries.forEach(country => {
            try {
                const card = document.createElement("div");
                card.classList.add("card");
                card.innerHTML = `
                    <h2><i class="fas fa-flag"></i> ${country.name.common}</h2>
                    <img src="${country.flags.png}" alt="${country.flags.alt}">
                    <div class="country-info">
                        <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'No especificada'}</p>
                        <p><strong>Región:</strong> ${country.region}</p>
                        <p><strong>Subregión:</strong> ${country.subregion}</p>
                        <p><strong>Población:</strong> ${country.population ? country.population.toLocaleString() : 'No especificada'}</p>
                        <p><strong>Área:</strong> ${country.area ? country.area.toLocaleString() : 'No especificada'} km²</p>
                        <p><strong>Idioma(s):</strong> ${country.languages ? Object.values(country.languages).join(", ") : 'No especificado'}</p>
                        <p><strong>Moneda(s):</strong> ${country.currencies ? Object.values(country.currencies).map(currency => `${currency.name} (${currency.symbol})`).join(", ") : 'No especificada'}</p>
                        <p><strong>Países limítrofes:</strong> ${country.borders ? country.borders.join(", ") : 'Ninguno'}</p>
                        <p><strong>Continente(s):</strong> ${country.continents ? country.continents.join(", ") : 'Ninguno'}</p>
                    </div>
                `;
                countryCards.appendChild(card);
            } catch (error) {
                console.error(`Error al mostrar información del país "${country.name.common}":`, error);
            }
        });
    }

    // Función para mezclar un array aleatoriamente (algoritmo de Fisher-Yates)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function displayErrorMessage(message) {
        const errorMessage = document.createElement("div");
        errorMessage.id = "errorMessage";
        errorMessage.textContent = message;
        document.body.insertBefore(errorMessage, document.body.firstChild);
        setTimeout(() => {
            errorMessage.remove();
        }, 5000); // Remove after 5 seconds
    }

    // Cambiar tema entre claro y oscuro
    toggleThemeButton.addEventListener("click", function() {
        const currentTheme = themeStylesheet.getAttribute("href");
        const newTheme = currentTheme === "light.css" ? "dark.css" : "light.css";
        themeStylesheet.setAttribute("href", newTheme);
    });
});
