const customerInput = document.querySelector('.customer-search');
const customerIdInput = document.querySelector('input[name="customer-id"]');
const resultsContainer = document.querySelector('.autocomplete-items');
let results = resultsContainer.querySelectorAll('.customer-item');

customerInput.addEventListener('input', (e) => {
    const word = e.target.value;
    let regex = new RegExp(`\\${word}+\\w`, 'gi');
    results.forEach((result) => {
        if (regex.test(result.innerHTML)) {
            result.className = '';
        } else {
            result.className = 'is-hidden';
        }
    });
});

(() => {
    results.forEach((result) => {
        result.className = 'is-hidden';
        result.addEventListener('click', setCustomerId);
    });
    resultsContainer.classList.remove('is-hidden');
})();

function setCustomerId(e) {
    const id = this.getAttribute('data-id');
    customerIdInput.value = id;
}
