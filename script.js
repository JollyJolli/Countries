document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById("searchInput");
    const countryCards = document.getElementById("countryCards");
    const loader = document.getElementById("loader");
    const content = document.getElementById("content");
    const fontChangeButton = document.getElementById("fontChangeButton");

    let allCountries = []; // Variable para almacenar todos los países
    let isMonocraft = false; // Variable para controlar el estado de la fuente

    // Mostrar loader
    loader.style.display = "block";
    content.style.display = "none";

    // Hacer una solicitud GET a la API
    fetch("https://restcountries.com/v3.1/all")
        .then(response => response.json())
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
        .catch(error => console.error("Error cargando datos:", error));

    // Función para mostrar tarjetas de países
    function displayCountries(countries) {
        countryCards.innerHTML = ""; // Limpiar contenido previo
        countries.forEach(country => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
                <h2><i class="fas fa-flag"></i> ${country.name.common}</h2>
                <img src="${country.flags ? country.flags.png : '#'}" alt="${country.flags ? country.flags.alt : 'Bandera no disponible'}">
                <p><i class="fas fa-building"></i> Capital: ${country.capital ? country.capital[0] : 'No especificada'}</p>
                <p><i class="fas fa-globe-americas"></i> Región: ${country.region}</p>
                <p><i class="fas fa-subway"></i> Subregión: ${country.subregion}</p>
                <p><i class="fas fa-users"></i> Población: ${country.population ? country.population.toLocaleString() : 'No especificada'}</p>
                <p><i class="fas fa-globe"></i> Área: ${country.area ? country.area.toLocaleString() : 'No especificada'} km²</p>
                <p><i class="fas fa-language"></i> Idioma(s): ${country.languages ? Object.values(country.languages).join(", ") : 'No especificado'}</p>
                <p><i class="fas fa-coins"></i> Moneda: ${country.currencies ? Object.values(country.currencies)[0].name : 'No especificada'} (${country.currencies ? Object.values(country.currencies)[0].symbol : 'No especificado'})</p>
                <p><i class="fas fa-map-marker-alt"></i> Países limítrofes: ${country.borders ? country.borders.join(", ") : 'No especificado'}</p>
                <p><i class="fas fa-external-link-alt"></i> Enlaces útiles:</p>
                <ul>
                    <li><a href="${country.maps ? country.maps.googleMaps : '#'}" target="_blank">Google Maps</a></li>
                    <li><a href="${country.maps ? country.maps.openStreetMaps : '#'}" target="_blank">OpenStreetMap</a></li>
                </ul>
            `;
            countryCards.appendChild(card);
        });
    }

    // Función para mezclar un array aleatoriamente (algoritmo de Fisher-Yates)
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Función para cambiar la fuente
    fontChangeButton.addEventListener("click", function() {
        if (isMonocraft) {
            document.body.style.fontFamily = "Arial, sans-serif";
        } else {
            // Cambiar a la fuente Monocraft (debe estar disponible en la misma ruta que el HTML)
            const fontUrl = "./Monocraft.ttf";
            const fontFace = new FontFace("Monocraft", `url(${fontUrl})`);
            fontFace.load().then(function(loadedFont) {
                document.fonts.add(loadedFont);
                document.body.style.fontFamily = "Monocraft, sans-serif";
            }).catch(function(error) {
                console.error("Error cargando la fuente Monocraft:", error);
            });
        }
        isMonocraft = !isMonocraft;
    });
});
