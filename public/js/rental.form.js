const showCustomerButtom = document.querySelector('.show-customer-info');
const showCarButtom = document.querySelector('.show-car-info');
const customerContainer = document.querySelector('.customer-info-container');
const carContainer = document.querySelector('.car-info-container');
const startDateInput = document.querySelector('.start-date-input');
const endDateInput = document.querySelector('.end-date-input');
const PricePerDayInput = document.querySelector('.car-price-day');
const totalPriceInput = document.querySelector('.total-price');

function setShowInfo() {
    showCarButtom.addEventListener('click', () => {
        if (carContainer.classList.contains('is-hidden')) {
            carContainer.classList.remove('is-hidden');
        } else {
            carContainer.classList.add('is-hidden');
        }
    });

    showCustomerButtom.addEventListener('click', () => {
        if (customerContainer.classList.contains('is-hidden')) {
            customerContainer.classList.remove('is-hidden');
        } else {
            customerContainer.classList.add('is-hidden');
        }
    });
}

function setMinDate() {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!
    let yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }

    today = yyyy + '-' + mm + '-' + dd;
    startDateInput.setAttribute('min', today);
    endDateInput.setAttribute('min', today);
}

function setShowTotalPrice() {
    startDateInput.addEventListener('change', () => {
        changeMinEndDate();
        changeTotalPrice();
    });
    endDateInput.addEventListener('change', changeTotalPrice);
}

function changeMinEndDate() {
    let startDate = startDateInput.value.split('-');
    let dd = Number(startDate[2]);
    let mm = Number(startDate[1]);
    let yyyy = startDate[0];
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }

    startDate = yyyy + '-' + mm + '-' + dd;
    endDateInput.setAttribute('min', startDate);
}

function changeTotalPrice() {
    let start = moment(startDateInput.value);
    let end = moment(endDateInput.value);
    let daysRented = end.diff(start, 'days');
    const pricePerDay = PricePerDayInput.value;
    let totalPrice = daysRented * pricePerDay;
    totalPriceInput.value = totalPrice;
}

setShowInfo();
setMinDate();
setShowTotalPrice();
