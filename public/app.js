window.validation = {}
async function setupCountriesList() {
    let req = await fetch("http://localhost:3000/validation/countries")
    let countries = await req.json() // array
    for (country of countries) {
        let option = document.createElement("option")
        option.text = country
        option.value = country
        document.getElementById("selected-countries-select").appendChild(option)
    }
}

async function parseForm() {
    let form = document.getElementById("multi-country-form");
    let formData = new FormData(form);
    let {street} = Object.fromEntries(formData);

    let countries = []; // Extract from list elements and remove button
    let selectedCountryList = document.getElementById("selected-countries-list");
    for (let li of selectedCountryList.children) {
        countries.push(li.innerHTML.replace("<button>-</button>", ''));
    }

    // Array to store all the promises returned by fetch requests
    let promises = countries.map(async (country) => {
        let nodes = Array
                        .from(document.querySelectorAll("select[country]"))
                        .filter((select) => select.getAttribute("country") == country)
        let [street] = Array
                        .from(document.querySelectorAll("input[type=text][part=street]"))
                        .filter((input) => input.getAttribute("country") == country)
                        .map((input) => input.value)
        let [firstName, lastName] = Array
                        .from(document.querySelectorAll("input[type=text][part=name]"))
                        .filter((input) => input.getAttribute("country") == country)
                        .map((input) => input.value)
        let entries = nodes.reduce((obj, item) => {
            return {...obj, [item.getAttribute("part")]: item.value}
        }, {})
        
        let req = await fetch("http://localhost:3000/search", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ ...entries, firstName, lastName, street, country })
        })

        return req.json() // Return the promise for each fetch request
    })

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

function removeCountry(countriesList, li, selectedCountry, option) {
    countriesList.removeChild(li)
    selectedCountry.appendChild(option)
    selectedCountry.value = ""
    console.debug("removeCountry", option.value)

    document.querySelectorAll("div[country]").forEach((div) => {
        if (div.getAttribute("country") == option.value) div.remove()
    })
}

function addCountry() {
    let selectedCountry = document.getElementById("selected-countries-select")
    let option = selectedCountry.querySelector(`#selected-countries-select option[value="${selectedCountry.value}"]`)

    let countriesList = document.getElementById("selected-countries-list")
    let li = document.createElement("li")
    li.innerText = selectedCountry.value

    let cancelBtn = document.createElement("button")
    cancelBtn.innerText = "-"
    cancelBtn.onclick = () => removeCountry(countriesList, li, selectedCountry, option)
    li.append(cancelBtn)

    countriesList.append(li)
    selectedCountry.removeChild(option)
    selectedCountry.value = ""

    setupValidation(li.innerHTML.replace("<button>-</button>", ''))
}

async function setupValidation(country) {
    console.debug("setupValidation", country)

    let req = await fetch("http://localhost:3000/address/order", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ country })
    })
    let order = await req.json() // array

    req = await fetch("http://localhost:3000/validation/country", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({country})
    })
    let data = await req.json()

    createName(country)
    createStreet(country)

    createInput(country, data, "city")
    createInput(country, data, "zip")
    if (order.includes("county")) {
        createInput(country, data, "county")
    }
    if (order.includes("prefecture")) {
        createInput(country, data, "prefecture")
    }
    if (order.includes("province")) {
        createInput(country, data, "province")
    }
    if (order.includes("state")) {
        createInput(country, data, "state")
    }
}

function handleChange(part, value, country) {
    if (part == "state") {
        if (document.getElementById(`${country}_county`)) {
            document.getElementById(`${country}_county`).querySelectorAll("option[state]").forEach((option) => {
                if (option.getAttribute("state") == value) option.hidden = false
                else option.hidden = true
            })
        }
        // list cities at state level
        document.getElementById(`${country}_city`).querySelectorAll("option[state]").forEach((option) => {
            if (option.getAttribute("state") == value) option.hidden = false
            else option.hidden = true
        })
        window.state = value
    } else if (part == "county") {
        document.getElementById(`${country}_city`)
        .querySelectorAll(`option[county][state]`).forEach((option) => {
            if (option.getAttribute("state") == window.state && option.getAttribute("county") == value) option.hidden = false
            else option.hidden = true
        })
        window.county = value
    } else if (part == "prefecture") {
        document.getElementById(`${country}_city`)
            .querySelectorAll("option[prefecture]").forEach((option) => {
                if (option.getAttribute("prefecture") == value) option.hidden = false
                else option.hidden = true
            })
        window.prefecture = value
    } else if (part == "province") {
        document.getElementById(`${country}_city`)
            .querySelectorAll("option[province]").forEach((option) => {
                if (option.getAttribute("province") == value) option.hidden = false
                else option.hidden = true
            })
        window.province = value
    } else if (part == "city") {
        document.getElementById(`${country}_zip`)
            .querySelectorAll("option[city]").forEach((option) => {
                if (option.getAttribute("city") == value) option.hidden = false
                else option.hidden = true
            })
        window.city = value
    }
    // document.getElementById(`${country}_zip`)
    // .querySelectorAll("option[value]").forEach((option) => {
    //     if ((option.getAttribute("county") == window.county && 
    //         option.getAttribute("state") == window.state) || 
    //         option.getAttribute("prefecture") == window.prefecture || 
    //         option.getAttribute("province") == window.province ||
    //         option.getAttribute("elevate_city") == "true") option.hidden = false
    //     else option.hidden = true
    // })
}

function createStreet(country) {
    let div = document.createElement("div")
    div.setAttribute("country", country)

    let label = document.createElement("label")
    label.textContent = country
    div.appendChild(label)

    let input = document.createElement("input")
    input.type = "text"
    input.setAttribute("part", "street")
    input.setAttribute("country", country)
    div.appendChild(input)

    document.getElementById("fieldset_street", div).appendChild(div)
}

function createName(country) {
    let div = document.createElement("div")
    div.setAttribute("country", country)

    let label = document.createElement("label")
    label.textContent = country
    div.appendChild(label)

    let firstName = document.createElement("input")
    firstName.type = "text"
    firstName.placeholder = "First Name"
    firstName.setAttribute("part", "name")
    firstName.setAttribute("country", country)
    div.appendChild(firstName)

    let lastName = document.createElement("input")
    lastName.type = "text"
    lastName.placeholder = "Last Name"
    lastName.setAttribute("part", "name")
    lastName.setAttribute("country", country)
    div.appendChild(lastName)

    document.getElementById("fieldset_name", div).appendChild(div)
}

function createInput(country, data, part) {
    let div = document.createElement("div")
    div.setAttribute("country", country)

    let label = document.createElement("label")
    label.textContent = country
    div.appendChild(label)

    let select = document.createElement("select")
    select.id = `${country}_${part}`
    select.setAttribute("country", country)
    select.setAttribute("part", part)
    select.onchange = (e) => handleChange(part, e.target.value, country)

    let count = {}
    for (props of data) {
        if (props[part] != undefined) {
            // skip if already added
            if (count[props[part]] != undefined) continue

            let option = document.createElement("option")
            option.value = props[part]
            option.text = props[part]
            if (part == "city") {
                option.setAttribute("county", props["county"])
                option.setAttribute("prefecture", props["prefecture"])
                option.setAttribute("province", props["province"])
                option.setAttribute("state", props["state"])

                if (props.elevate_city) option.hidden = false
                else option.hidden = true
            } else if (part == "county") {
                option.setAttribute("state", props["state"])
                option.hidden = true
            } else if (part == "zip") {
                option.setAttribute("city", props["city"])
                option.hidden = true
            }
            select.appendChild(option)

            // prevent duplicates
            count[props[part]] = true
        }
    }

    let defaultOption = document.createElement("option")
    defaultOption.value = ""
    defaultOption.selected = true
    defaultOption.hidden = false
    select.appendChild(defaultOption)

    div.appendChild(select)
    document.getElementById(`fieldset_${part}`).appendChild(div)
}

document.querySelectorAll(".country-form").forEach((countryForm) => {
    countryForm.addEventListener("submit", (e) => e.preventDefault())
})

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
            const {_id, firstName, lastName, street, city, county, prefecture, province, state, zip} = data[i];
            const div = document.createElement('div');
            div.textContent = `ID: ${_id}, Name: ${firstName} ${lastName}, Address: ${street}, ${city}, ${county??""} ${prefecture??""} ${province??""} ${state??""} ${zip}`;
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

