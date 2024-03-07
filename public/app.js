async function setupCountriesList() {
    let req = await fetch("http://localhost:3000/validation/countries")
    let [data] = await req.json()
    let { id, ...countries } = data

    for (country in countries) {
        if (country == "_id") continue

        let option = document.createElement("option")
        option.text = country
        option.value = country
        document.getElementById("selected-countries-select").appendChild(option)
    }
}

function handleModeChange(e) {
    let mode = e.value, current = null, previous = null
    const addressesContainer = document.getElementById('addresses');
    switch (mode) {
        case "multi-country": {
            current = document.getElementById("multi-country-form")
            previous = document.getElementById("single-country-form") 
            addressesContainer.innerHTML = ''; // Clear previous results
            break
        }
        case "single-country": {
            current = document.getElementById("single-country-form")
            previous = document.getElementById("multi-country-form")
            addressesContainer.innerHTML = ''
            break
        }
    }
    current.setAttribute("data-selected", true)
    previous.setAttribute("data-selected", false)
}

async function parseMultiCountryForm() {
    let form = document.getElementById("multi-country-form");
    let formData = new FormData(form);
    let entries = Object.fromEntries(formData);
    console.debug("form data", entries);

    let countries = []; // Extract from list elements and remove button
    let selectedCountryList = document.getElementById("selected-countries-list");
    for (let li of selectedCountryList.children) {
        countries.push(li.innerHTML.replace("<button>-</button>", ''));
    }

    // Array to store all the promises returned by fetch requests
    let promises = countries.map(async (country) => {
        let req = await fetch("http://localhost:3000/address", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ ...entries, country })
        });

        return req.json(); // Return the promise for each fetch request
    });

    // Wait for all promises to resolve using Promise.all
    Promise.all(promises)
        .then((dataArray) => {
            // Concatenate all data arrays into a single array
            let data = dataArray.reduce((acc, curr) => acc.concat(curr), []);
            console.log(data);
            loadAddresses(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function addCountry() {
    let selectedCountry = document.getElementById("selected-countries-select")
    if (selectedCountry.value) {
        let option = selectedCountry.querySelector(`#selected-countries-select option[value="${selectedCountry.value}"]`)

        let countriesList = document.getElementById("selected-countries-list")
        let li = document.createElement("li")
        li.innerText = selectedCountry.value

        let cancelBtn = document.createElement("button")
        cancelBtn.innerText = "-"
        cancelBtn.onclick = () => {
            countriesList.removeChild(li)
            selectedCountry.appendChild(option)
            selectedCountry.value = ""
        }
        li.append(cancelBtn)

        countriesList.append(li)
        selectedCountry.removeChild(option)
        selectedCountry.value = ""
    }
}

document.querySelectorAll(".country-form").forEach((countryForm) => {
    countryForm.addEventListener("submit", (e) => e.preventDefault())
})

/*document.getElementById("multi-country-form").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission
    console.log("Form submitted!"); // Log a message to the console when the form is submitted

    // Call parseMultiCountryForm when the form is submitted
    parseMultiCountryForm();
});
*/

function loadAddresses(data) {
    const addressesContainer = document.getElementById('addresses');
    addressesContainer.innerHTML = ''; // Clear previous results

    const pageSize = 25;
    const totalPages = Math.ceil(data.length / pageSize);

    let currentPage = 1;
    renderPage(currentPage);

    function renderPage(page) {
        addressesContainer.innerHTML = ''; // Clear previous results
        const startIndex = (page - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize, data.length);

        for (let i = startIndex; i < endIndex; i++) {
            const address = data[i];
            const div = document.createElement('div');
            div.textContent = `ID: ${address._id}, Address: ${address.street}, ${address.city}, ${address.state} ${address.zip}`;
            addressesContainer.appendChild(div);
        }

        renderPaginationControls();
    }

    function renderPaginationControls() {
        const paginationContainer = document.getElementById('pagination');
        paginationContainer.innerHTML = ''; // Clear previous pagination controls

        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.addEventListener('click', () => {
                currentPage = i;
                renderPage(currentPage);
            });
            paginationContainer.appendChild(button);
        }
    }
}

