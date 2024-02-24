
document.getElementById('loadAddresses').addEventListener('click', loadAddresses);

function loadAddresses() {
    fetch('http://localhost:3000/addresses')
    .then(response => response.json())
    .then(data => {
        const addressesContainer = document.getElementById('addresses');
        addressesContainer.innerHTML = ''; // Clear previous results
        data.forEach(address => {
            const div = document.createElement('div');
            div.textContent = `ID: ${address._id}, Address: ${address.street}, ${address.city}, ${address.state} ${address.zip}`;
            addressesContainer.appendChild(div);
        });
    })
    .catch(error => console.error('Error:', error));
}
