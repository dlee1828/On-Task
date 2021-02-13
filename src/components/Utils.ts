export interface time {
	hours: number;
	minutes: number;
}

export function getCurrentTime(): time {
	let d = new Date();
	let hours = d.getHours();
	let minutes = d.getMinutes();
	return {
		hours: hours,
		minutes: minutes,
	}
}

export function correctTime(t: time) {
	while (t.minutes > 60) {
		t.hours += 1;
		t.minutes -= 60;
	}

	while (t.hours >= 24) {
		t.hours -= 24;
	}

	return t;
}

export function addTimes(a: time, b: time): time {
	let newTime = {
		hours: a.hours + b.hours,
		minutes: a.minutes + b.minutes,
	}

	newTime = correctTime(newTime)

	return newTime;
}

export function getTimeFromNow(delay: time): time {
	let currentTime = getCurrentTime();
	return addTimes(currentTime, delay);
}

export function checkValidTime(str: string): boolean {
	const timeRegex = /\b\d+:\d+\b/;
	return timeRegex.test(str);
}

export function stringToTime(str: string): boolean | time {
	if (!checkValidTime) return false;

	// Get hours
	const hoursRegex = /\b\d+:/;
	const hours = parseInt(str.match(hoursRegex)![0]);
	// Get minutes
	const minutesRegex = /:\d+\b/;
	let minutesMatch = str.match(minutesRegex)![0];
	minutesMatch = minutesMatch.slice(1, minutesMatch.length);
	const minutes = parseInt(minutesMatch);

	return {
		hours: hours,
		minutes: minutes,
	}
}

function doubleDigits(num: string) {
	if (num.length == 1) {
		num = "0" + num;
	}
	return num;
}

export function timeToString(t: time) {
	let ampm = "am";
	if (t.hours >= 12) {
		ampm = "pm";
		if (t.hours > 12) t.hours -= 12;
	}
	return t.hours.toString() + ":" + doubleDigits(t.minutes.toString()) + " " + ampm;
}