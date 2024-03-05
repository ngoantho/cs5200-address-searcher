document.getElementById('loadAddresses').addEventListener('click', loadAddresses);

function loadAddresses() {
    fetch('http://localhost:3000/addresses')
        .then(response => response.json())
        .then(data => {
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
        })
        .catch(error => console.error('Error:', error));
}
