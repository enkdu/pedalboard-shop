export default class Model {

	async postOnServer(user) {
		let response = await fetch('/basket', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json;charset=utf-8'
			},
			body: JSON.stringify(user)
		});

		let result = await response.text();
	}


	async getFromServer(path) {
		let response = await fetch(`http://localhost:4000${path}`);
		let text = await response.json();

		window.location.hash = path;

		if(response.ok){
			return text;
		} else {
			alert('404');
		}
	}

	setProductToLS(products, number) {
		let pedal = products[number.substr(2) - 1];
		
		if (localStorage.getItem(number)) {
			pedal = JSON.parse(localStorage.getItem(number));
			pedal.counter++;
			
		} else {
			pedal.counter = 1;
		}
	
		let jsonProduct = JSON.stringify(pedal);
		localStorage.setItem(pedal.number, jsonProduct);
	}

	removeFromLS(number) {
		if (localStorage.getItem(number)) {
			let pedal = JSON.parse(localStorage.getItem(number));
			pedal.counter--;

			let jsonProduct = JSON.stringify(pedal);
			localStorage.setItem(pedal.number, jsonProduct);
	
			if (!pedal.counter) {
				localStorage.removeItem(number);
			}
		}
	}
}