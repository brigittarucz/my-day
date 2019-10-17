/* Set theme */

let root = document.documentElement;
let select = document.querySelector('select');

findIndex();

select.addEventListener('click', findIndex);

function findIndex() {
	let e = select[select.selectedIndex].value;
	root.dataset.theme = e;
}

/* WD Date Function */

window.addEventListener('DOMContentLoaded', initialize);

function initialize() {
	setDateFunction();
	fetchData();
}

// I need this arr as a global variable
let weekdaysArray = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ];

function setDateFunction() {
	let dateNow = new Date();
	let setWeekday = document.querySelector('.set-weekday');
	let setLongMonth = document.querySelector('.set-long-month');
	let setLongDay = document.querySelector('.set-long-day');
	let setLongYear = document.querySelector('.set-long-year');
	let setTime = document.querySelector('.set-current-time');
	let setWeekdayHidden = document.querySelector('.set-weekday-hidden');

	// Set weekdays by getting vals from 0-6 through getDay() method
	let currentWeekday = weekdaysArray[dateNow.getDay()];
	setWeekday.textContent = currentWeekday;
	setWeekdayHidden.textContent = currentWeekday;

	// Set months by getting vals from 0-11 through getMonth() method
	let monthsArray = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];
	let currentMonth = monthsArray[dateNow.getMonth()];
	setLongMonth.textContent = currentMonth;

	// Decide based on the num value of current day the day suffix
	let currentDay = dateNow.getDate();
	if (currentDay == 1) {
		setLongDay.textContent = currentDay + 'st';
	} else if (currentDay == 2) {
		setLongDay.textContent = currentDay + 'nd';
	} else if (currentDay > 2) {
		setLongDay.textContent = currentDay + 'th';
	}

	// Get long format year
	let currentYear = dateNow.getFullYear();
	setLongYear.textContent = currentYear;

	let currentHour = dateNow.getHours();

	// Set AM initially to true and verify if its PM or AM
	let AM = true;
	if (currentHour == 0) {
		currentHour = 12;
	}
	if (currentHour >= 12) {
		AM = false;
	}

	// Get minutes and format them
	let currentMinutes = dateNow.getMinutes();
	if (currentMinutes < 10) {
		currentMinutes = '0' + currentMinutes;
	}
	// Concatenate by veryfing the firstly set boolean val of AM
	if (AM == true) {
		setTime.textContent = currentHour + '.' + currentMinutes + ' AM';
	} else {
		setTime.textContent = currentHour + '.' + currentMinutes + ' PM';
	}
}

// Call the function each half minute in order to update

setInterval(setDateFunction, 30000);

// WD Fetch Information

let baseLink = 'tasks.json';

function fetchData() {
	fetch(baseLink).then((e) => e.json()).then((data) => showData(data));
}

// I declare it here so i can have it globally and manipulate it as I want in order to DRY

let fluidWeekday;
let dateNow = new Date();
let weekdayNum = dateNow.getDay();

function showData(data) {
	fluidWeekday = document.querySelector('.set-weekday-hidden').textContent;

	// We loop through the data and we put in our table row just current weekday's data
	for (let i = 0; i < data.length; i++) {
		if (data[i].day == fluidWeekday) {
			const parent = document.querySelector('.tbody-parent-container');
			const clone = document.querySelector('.tr-child').content.cloneNode(true);

			clone.querySelector('.set-tr-time').textContent = data[i].time;
			clone.querySelector('.set-tr-descrip').textContent = data[i].description;
			clone.querySelector('.set-tr-delete').addEventListener('click', deleteRow);
			parent.appendChild(clone);
		}
	}
}

// Move day functionality

document.querySelector('.move-previous').addEventListener('click', moveYesterday);

function moveYesterday() {
	fluidWeekday = weekdaysArray[weekdayNum - 1];
	if (weekdayNum > 0) {
		weekdayNum -= 1;
	} else {
		weekdayNum = 6;
	}
	document.querySelector('.set-weekday-hidden').textContent = fluidWeekday;
	document.querySelector('.container-controls h2').textContent = fluidWeekday;
	document.querySelectorAll('.tbody-parent-container tr').forEach((el) => el.remove());
	fetchData();
}

document.querySelector('.move-next').addEventListener('click', moveTomorrow);

function moveTomorrow() {
	fluidWeekday = weekdaysArray[weekdayNum + 1];
	if (weekdayNum < 6) {
		weekdayNum += 1;
	} else {
		weekdayNum = 0;
	}
	console.log(weekdayNum);
	document.querySelector('.set-weekday-hidden').textContent = fluidWeekday;
	document.querySelector('.container-controls h2').textContent = fluidWeekday;
	document.querySelectorAll('.tbody-parent-container tr').forEach((el) => el.remove());
	fetchData();
}

// Delete functionality

function deleteRow(clickedEl) {
	clickedEl.target.parentElement.parentElement.remove();
}

// Modal functionality

document.querySelector('#add-new').addEventListener('click', openModal);
document.querySelector('.button-cancel').addEventListener('click', closeModal);

function closeModal() {
	document.querySelector('#modal-element').style.display = 'none';
}

function openModal() {
	document.querySelector('#modal-element').style.display = 'block';
}

/* Minor Form Validation */

let modalForm = document.querySelector('form');

document.querySelector('.button-cancel').addEventListener('click', (e) => e.preventDefault());
document.querySelector('.button-insert').addEventListener('click', validateAndSubmit);

modalForm.formtime.addEventListener('keyup', checkIfEmpty);
modalForm.formdescrip.addEventListener('keyup', checkIfEmpty);

function checkIfEmpty() {
	if (event.target.value) {
		event.target.style.border = '1.5px solid green';
	} else {
		event.target.style.border = '1.5px solid var(--modal-border-top)';
	}
}

/* If both fields are true meaning they have content inside we append new table row */

function validateAndSubmit() {
	event.preventDefault();
	if (modalForm.formtime.value && modalForm.formdescrip.value) {
		// I create an object with the date I have that I can append to the table
		let data = {
			delete: ' <i class="fa fa-trash"></i> ',
			time: modalForm.formtime.value,
			description: modalForm.formdescrip.value
		};

		let rowParentParent = document.querySelector('.tbody-parent-container');
		let rowParent = document.createElement('tr');
		let rowChildTime = document.createElement('td');
		let rowChildDescr = document.createElement('td');
		let rowChildDelete = document.createElement('td');

		// I set the data to each and I append it to their parent
		rowChildTime.textContent = data.time;
		rowChildDescr.textContent = data.description;
		rowChildDelete.innerHTML = data.delete;

		rowParent.appendChild(rowChildTime);
		rowParent.appendChild(rowChildDescr);
		rowParent.appendChild(rowChildDelete);

		// Beware, delete functionality on these newly inserted items not working
		rowParentParent.appendChild(rowParent);

		// Scroll the table to see the magic :)
		closeModal();
	}
}

// Daily inspiration dose

let inspiration = [
	"You are the semicolon of someone's statements",
	'In order to understand recursion, one must first understand recursion.'
];

// as we have only two items in the array i use math.random and
// math.round methods to get a random 1 or 0 and set it on load

document.querySelector('.set-inspirational-message').textContent = inspiration[Math.round(Math.random())];

// The personalised title

document.querySelector('.set-title-input').addEventListener('keyup', updateTitle);

function updateTitle() {
	document.querySelector('.section-apps-header').textContent = event.target.value;
}

// Weather - found a cool API; basically how it works, there's my key and in the search query I introduced
// the wanted city i found in one of their json files

let weatherLink = 'http://api.openweathermap.org/data/2.5/weather?q=Copenhagen&APPID=3c43fac79a2cc3e14edecaf8911f8e2c';

function fetchWeatherData() {
	fetch(weatherLink).then((e) => e.json()).then((weather) => showWeather(weather));
}

// convert kelvin to celsius t(c) = t(k) - 273.15 and append;

function showWeather(weather) {
	let degKelvin = weather.main.temp_max;
	let degCelsius = degKelvin - 273.15;
	document.querySelector('.set-degrees').innerHTML = degCelsius + ' &#8451;';
}

fetchWeatherData();
