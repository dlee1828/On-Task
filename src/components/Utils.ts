export interface time {
	hours: number;
	minutes: number;
	seconds?: number;
}

export function getCurrentTime(): time {
	let d = new Date();
	let hours = d.getHours();
	let minutes = d.getMinutes();
	let seconds = d.getSeconds();
	return {
		hours: hours,
		minutes: minutes,
		seconds: seconds,
	}
}

export function correctTime(t: time) {

	while (t.minutes < 0) {
		t.minutes += 60;
		t.hours -= 1;
	}

	while (t.hours < 0) {
		t.hours += 24;
	}

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

export function subtractTime(a: time, b: time): time {

	let newTime = {
		hours: a.hours - b.hours,
		minutes: a.minutes - b.minutes,
	}

	newTime = correctTime(newTime);

	return newTime;
}

export function getTimeLeftUntil(timeDeadline: time): time {

	let currentTime = getCurrentTime();

	return subtractTime(timeDeadline, currentTime);

}

function secondsBetween(a: time, b: time) {
	return 3600 * (b.hours - a.hours) + 60 * (b.minutes - a.minutes) + b.seconds! - a.seconds!;
}

export function getProgressPercent(startingTime: time, timeDeadline: time): number {
	timeDeadline.seconds = 0;
	let totalSeconds = secondsBetween(startingTime, timeDeadline);
	let d = new Date();
	let currentSeconds = secondsBetween(startingTime, getCurrentTime());
	let percent = Math.floor(100 * currentSeconds / totalSeconds);
	if (percent > 100) percent = 100;
	return percent;
}

export function totalMinutes(t: time): number {
	return t.hours * 60 + t.minutes;
}

export function formatTimeLeft(timeLeft: time): string {

	let hourString = "";

	if (timeLeft.hours != 0) {
		hourString = timeLeft.hours.toString() + " hr ";
	}

	return hourString + timeLeft.minutes.toString() + " min";
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
	let hours = t.hours;
	if (t.hours >= 12) {
		ampm = "pm";
		if (t.hours > 12) hours -= 12;
	}
	return hours.toString() + ":" + doubleDigits(t.minutes.toString()) + " " + ampm;
}