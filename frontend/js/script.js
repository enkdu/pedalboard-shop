import View from './view/view.js';
import Model from './model/model.js';

let body = document.querySelector('body'),
		menu = document.querySelector('nav'),
		findInput = document.querySelector('.search input'),
		mainPage = document.querySelector('main'),
		mainWrapper = document.querySelector('.products-wrapper'),
		infiniteScroll = document.querySelector('.infinite-scroll-wrapper'),
		bodyWrapper = document.querySelector('.wrapper'),
		basketCounter = document.querySelector('.basket-counter'),
		basket = document.querySelector('.basket'),
		basketCounterNumber = document.querySelector('.basket-counter p'),
		productsWrapper = document.querySelector('.products'),
		basketWrapper = document.querySelector('.order-wrapper'),
		centerWrapper = document.querySelector('.center-wrapper'),
		orderForm = document.querySelector('.form-wrapper'),
		userName = document.querySelector('.user-name'),
		userAddress = document.querySelector('.user-address'),
		userTelephone = document.querySelector('.user-telephone'),
		mobileMenuButton = document.querySelector('.mobile-menu button'),
		mobileMenuCategories = document.querySelector('.mobile-menu-wrapper'),
		exitButton = document.querySelector('.exit'),
		orderButton = document.querySelector('.order-button');


let model = new Model();
let view = new View();

clearPage();
refreshBasketCounter();

window.addEventListener('load', route);

basketWrapper.addEventListener('click', showOrderForm);
mobileMenuButton.addEventListener('click', showMobileMenu);

productsWrapper.addEventListener('click', addToBasket);
basketWrapper.addEventListener('click', addToBasket);

findInput.addEventListener('keyup', findPedals);

basket.addEventListener('click', route);
menu.addEventListener('click', route);
infiniteScroll.addEventListener('click', scroll);

exitButton.addEventListener('click', closeForm);
orderButton.addEventListener('click', responceForm);

function route(e) {
	let target = e.target,
			link;

	if (!(target.nodeName === '#document')) {

		if (target.dataset.link) {
			link = target.dataset.link;
			mainPage.dataset.products = 0;
			clearPage();
			model.getFromServer(`/${link}`)
				.then(res => renderProducts(res, link));

		}	else if (target.dataset.scroll) {
			link = window.location.hash.substr(2);
			model.getFromServer(`/${link}`)
				.then(res => {renderProducts(res, link)});

		}	else if (target.classList.contains('basket-js')) {
			renderOrder();

		} else if (target.classList.contains('error')) {
			addMainPageStyles();
			view.createMainPage(basketWrapper);
		}

	} else {
		link = window.location.hash.substr(2);
		clearPage();

		if (link === 'basket') {
			renderOrder();

		} else if (!window.location.hash.substr(2)) {
			addMainPageStyles();
			view.createMainPage(basketWrapper);

		} else if (isRoute()) {
			model.getFromServer(`/${link}`)
			.then(res => renderProducts(res, link));
		}else{
			clearPage();
			addErrorStyles();
			view.createError(basketWrapper);
			eventLoadMainPage();
		}
	}
}

function isRoute() {
	let routes = ['overdrive', 
								'delay', 
								'modulation', 
								'compressor',
								'looper',
								'multieffect',
								'other'];
	let path = window.location.hash.substr(2);

	for (let key of routes) {
		if ( path == key) {
			return true;
		}
	}

	return false;
}

function scroll(e) {
	if (infiniteScroll.dataset.sroll !== 'end') {
		route(e);

	} else {
		window.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	}
}

function findPedals(e) {
	let target = e.target,
			value = findInput.value,
			link = window.location.hash.substr(2);

	basketWrapper.classList.add('hidden');

	if (target.tagName === 'INPUT' && e.keyCode === 13) {
		mainPage.dataset.products = '0';
		model.getFromServer(`/${link}`)
			.then(res => filterPedals(res, value));
	}
}

function filterPedals(pedals, filter) {
	let filteredPedals = [],
			link = window.location.hash.substr(2),
			productName;

		for (let pedal of pedals) {
			productName = pedal.name.toLowerCase();
	
			if (productName.indexOf(filter.toLowerCase()) + 1) {
				filteredPedals.push(pedal)
			}
		}

	clearPage();

	if(!filteredPedals.length) {
		addNotFoundPedalStyles();
		view.createNotFoundPedal(basketWrapper);
		return;
	}

	renderProducts(filteredPedals, link);
}

function addToBasket(e) {
	let target = e.target,
			number = target.dataset.number,
			link = '';

	if (window.location.hash.substr(2) == 'basket') {

		if (target.classList.contains('active')) {
			let item = JSON.parse(localStorage.getItem(number));
			link = item.type;
		}

		if (target.classList.contains('basket-plus')) {
			model.getFromServer(`/${link}`)
				.then(res => {
					model.setProductToLS(res, number);
					refreshBasketCounter();
					renderOrder();
				})
		}

		if (target.classList.contains('basket-minus')) {
			model.removeFromLS(number);
			refreshBasketCounter();
			renderOrder();
		}

		if (target.classList.contains('delete-img')) {
			localStorage.removeItem(number);
			refreshBasketCounter();
			renderOrder();
		}

		if (!getBasketItems().length) {
			addEmptyOrderStyles();
			view.createEmptyOrder(basketWrapper);
			eventLoadMainPage();
		}

	} else {
		link = window.location.hash.substr(2);
	}

	if (target.classList.contains('plus')) {
		model.getFromServer(`/${link}`)
			.then(res => {
				model.setProductToLS(res, number);
				refreshBasketCounter();
			})
	}

	if (target.classList.contains('minus')) {
		model.removeFromLS(number);
		refreshBasketCounter();
	}
}

function refreshBasketCounter() {
	if (localStorage.length) {
		let items,
				counterSum = 0;

		items = parseFromLS();

		for (let key of items) {

			if ((typeof (key) === 'object') && ('counter' in key)) {
				counterSum += +key.counter;
			}
		}

		if (counterSum) {
			basketCounterNumber.innerText = counterSum;
			basketCounter.classList.remove('hidden');

		} else {
			basketCounter.classList.add('hidden');
		}

	} else {
		basketCounter.classList.add('hidden');
	}
}

function showMobileMenu() {
	mobileMenuCategories.classList.toggle('hidden');
}

function clearPage() {
	productsWrapper.dataset.products = '0';

	productsWrapper.innerHTML = '';
	infiniteScroll.innerHTML = '';
	basketWrapper.innerHTML = '';

	mainWrapper.classList.add('hidden');
	centerWrapper.classList.add('hidden');
	orderForm.classList.add('hidden');

	findInput.value = '';
}

function showOrderForm(e) {
	let target = e.target;

	if (target.classList.contains('submit-button')) {
		orderForm.classList.remove('hidden');
		bodyWrapper.classList.add('blur');
		orderForm.style.bottom = document.documentElement.Height;

		removeError(userName);
		removeError(userTelephone);
	}
}

function parseFromLS() {
	let localStorageKeys = Object.keys(localStorage),
		items = [];

	for (let key of localStorageKeys) {
		items.push(JSON.parse(localStorage.getItem(key)));
	}

	return items;
}

function getBasketItems() {
	let itemsFromBasket = [];
	let allItems = parseFromLS();

	for (let key of allItems) {
		if ((typeof (key) === 'object') && ('counter' in key)) {
			itemsFromBasket.push(key);
		}
	}

	return itemsFromBasket;
}

function closeForm() {
	orderForm.classList.add('hidden');
	bodyWrapper.classList.remove('blur');
}

function responceForm(e) {
	e.preventDefault();

	removeError(userName);
	removeError(userTelephone);

	if ((userName.value.length > 1) && isTelephone(userTelephone.value) && userAddress.value.length) {

		let user = {
			name: userName.value,
			telephone: userTelephone.value,
			address: userAddress.value,
			order: parseFromLS()
		};

		model.postOnServer(user).then(res => {
			addCompleteOrderStyles();
			view.createCompleteOrder(basketWrapper);
		});
	} else {
		if (userName.value.length <= 1) {
			addInputError(userName);
			userName.placeholder = 'Введите имя длинней';
		}

		if (!isTelephone(userTelephone.value)) {
			userTelephone.placeholder = 'Введите коректный телефон';
			addInputError(userTelephone);
		}
	}
}


function addInputError(input) {
	input.value = '';
	input.classList.add('red');
}

function removeError(input) {
	input.classList.remove('red');
	input.classList.remove('red');
}

function isTelephone(telephone) {
	return /^(\+375|80)(29|25|44|33)(\d{3})(\d{2})(\d{2})$/.test(telephone);
}

function eventLoadMainPage() {
	let mainPageButton = document.querySelector('.error-wrapper button');
	mainPageButton.addEventListener('click', route);
}

////////////

function addMainPageStyles () {
	centerWrapper.classList.remove('hidden');
	body.style.background = `#f1f1f1`;
}

function addNotFoundPedalStyles() {
	centerWrapper.classList.remove('hidden');
	basketWrapper.classList.remove('hidden');
	body.style.background = `url(../images/background/ocean.gif)`;
}

function addErrorStyles() {
	centerWrapper.classList.remove('hidden');
	body.style.background = `url(../images/background/404.gif)`;
}

function addEmptyOrderStyles() {
	body.style.background = `url(../images/background/ocean.gif)`;
}

function addProductsPageStyles() {
	mainWrapper.classList.remove('hidden');
	centerWrapper.classList.add('hidden');
	body.style.background = `#f1f1f1`;
}

function addCompleteOrderStyles() {
	orderForm.classList.add('hidden');
	bodyWrapper.classList.remove('blur');
	body.style.background = `url(../images/background/ocean.gif)`;
	
	localStorage.clear();
	refreshBasketCounter();
}

///////////

function renderProducts(products, category) {
	if(!products) {
		return;
	}

	let length = products.length,
		counter = mainPage.dataset.products;

		addProductsPageStyles();

	for (let i = 1; i <= 32; i++) {
		if (counter === length) {
			break;
		}
		
		counter++;
		view.createProduct(productsWrapper, products, category, counter);
	}

	if (counter === length && length > 32) {
		infiniteScroll.dataset.sroll = 'end';
		view.createInfiniteScroll(infiniteScroll);

	} else if (!(counter % 32)) {
		infiniteScroll.dataset.sroll = 'scroll';
		view.createEndButton(infiniteScroll);
	}

	mainPage.dataset.products = counter;
}

function renderOrder() {
	if (localStorage.length) {
		let items,
				priceCounter = 0;

		window.location.hash = '/basket';
		clearPage();
		centerWrapper.classList.remove('hidden');
		basketWrapper.classList.remove('hidden');

		view.createBasketHeader(basketWrapper);

		items = parseFromLS();

		for (let key of items) {

			if ((typeof (key) === 'object') && ('counter' in key)) {

				view.createBasketProduct(basketWrapper, key);
				priceCounter += key.price * key.counter;
			}
		}

		view.createBasketFooter(basketWrapper, priceCounter);
	}
}