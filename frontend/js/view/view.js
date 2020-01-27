export default class View {

	createMainPage(htmlContainer) {
		htmlContainer.innerHTML = `
		<div class="main-page">
			<div>
				<h2>Добро пожаловать в магазин педалей</h2>
			</div>
		</div>
		`;
	}

	createNotFoundPedal(htmlContainer) {
		htmlContainer.innerHTML = `
		<div class="thanks-page-wrapper"> 
			<div class="thanks-page-h">
				<h2>такой педали нет...</h2>
			</div>
			<div class="thanks-page-p">
				<p>Попробуйте поискать еще раз</p>
			</div>
		</div>
		`;
	}
	
	createError(htmlContainer) {
		htmlContainer.innerHTML = `
		<div class="error-wrapper">
			<h2>Кажестя что-то пошло не так...</h2>
			<div class="error-p">
					<p>Страница, которую вы запрашивали, не существует.</p>
					<p>Возможно она была удалена, перемещена или был введен неподходящий адрес...</p>
			</div>
		
			<button class="error">Перейти на главную</button> 
		</div> 
		`;

		window.location.hash = '/';
	}

	createEmptyOrder(htmlContainer) {
		htmlContainer.innerHTML = `
		<div class="error-wrapper">
			<div class="error-h">
				<h2>Ваша корзина пуста</h2>
			</div>
			<div class="error-p">
				<p>Хотите поменять свой выбор?</p>
				<p></p>
			</div>
		
			<button class="error">Перейти на главную</button> 
		</div>
		`;
	
		window.location.hash = '/';
	}

	createCompleteOrder(htmlContainer) {
		htmlContainer.innerHTML = `
		<div class="thanks-page-wrapper"> 
			<div class="thanks-page-h">
				<h2>Спасибо за заказ!</h2>
			</div>
			<div class="thanks-page-p">
				<p>Ваш заказ успешно оформлен. Мы свяжемся с вами в ближайшее время.</p>
			</div>
			<div class="thanks-page-tel">
				<p>Телефон для связи: 8(800)555-35-35</p> 
			</div>
		</div>
		`;
	}

	createInfiniteScroll(htmlContainer) {
		htmlContainer.innerHTML = '<button class="infinite-scroll infinite-scroll-end" data-scroll="scroll">Наверх</button>';
	}

	createEndButton(htmlContainer) {
		htmlContainer.innerHTML = '<button class="infinite-scroll" data-scroll="scroll">Далее</button>';
	}

	createBasketHeader(htmlContainer) {
		htmlContainer.innerHTML = ` 
			<div class="order-p">
				<p>Ваш заказ:</p>
			</div>
		`;
	}
	
	createBasketFooter(htmlContainer, priceCounter) {
		htmlContainer.innerHTML += `
		<div class="submit-order">
		<span class="total-lable">Вы заплатите:</span>
		<span class="total">$${+priceCounter.toFixed(2)}</span>
		<button type="submit" class="submit-button">Подтвердить заказ</button>
	</div>
	`;
	}

	createProduct(htmlContainer, products, category, counter) {
		htmlContainer.innerHTML += `

		<div class="product-${counter}">
			<img src="images/data/${category}/${category}-${counter}.jpg">
			<a href="#" class="product-name">${products[counter-1].name}</a>
			<div class="bye-wrapper">
				<span class="product-price">${products[counter-1].price}$	</span>
				<div class="add-to-basket-wrapper">
				<button>
					<p class="plus" data-number="${products[counter-1].number}">+</p>
				</button>
					<img src="images/basket.png" class="add-to-basket">
				<button>
					<p class="minus" data-number="${products[counter-1].number}">-</p>
				</button>	
				</div>
			</div>
		</div>
		`
	}

	createBasketProduct(htmlContainer, product) {

		htmlContainer.innerHTML += `
		<div class="order-item">
			<div class = "item-information-wrapper">
				<div class="item-information">
						<img src="images/data/${product.type}/${product.type}-${+product.number.substr(2)}.jpg" class="order-img">
					<div class="item-name">
						<span>${product.name}<span>
					</div>
				</div>
				<div class="item-spec">
					<span>
						-	Transform the tone of a guitar or keyboard into that of a convincing full body, electric organ </br>
						- 9 presets that were finely tuned to emulate some of the most popular and classic electric organ tones </br>
						- Control over percussive attack level, modulation speed, organ and dry volume </br>
						- Rugged and easy to use </br>
						- Use together with the C9 for dual keyboard possibilities! </br>
						- EHX 9.6DC-200 PSU included </br>
						- Dimensions in inches: 4.0 (w) x 4.75 (l) x 2.25 (h) </br>
						- Dimensions in mm: 102 (w) x 121 (l) x 89 (h) </br>
					<span>
				</div>
			</div>
			<div class="price-information">
				<div class="item-add-or-remove">
					<span	class="item-add-one basket-plus active" data-number="${product.number}">+</span>
					<div class="item-quantity">
						<span	class="quantity">${product.counter}</span>
					</div>
					<span	class="item-remove-one basket-minus active" data-number="${product.number}">-</span>
				</div>
				
				<div class ="item-price">
					<span>$${+(product.price * product.counter).toFixed(2)}</span>
				</div>
				
				<button class ="delete-item active">
					<img src="images/delete.png" class="delete-img active" data-number="${product.number}">
				</button>
			</div>
		</div>
	`;
	}

}