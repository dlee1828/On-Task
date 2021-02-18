export interface time {
	hours: number;
	minutes: number;
	seconds: number;
}

export const timeZero = { hours: 0, minutes: 0, seconds: 0 };

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

function correctTimeAbsolute(t: time) {
	while (t.seconds < 0) {
		t.seconds += 60;
		t.minutes -= 1;
	}

	while (t.minutes < 0) {
		t.minutes += 60;
		t.hours -= 1;
	}

	while (t.hours < 0) {
		t.hours += 24;
	}

	while (t.seconds > 60) {
		t.seconds -= 60;
		t.minutes += 1;
	}

	while (t.minutes > 60) {
		t.hours += 1;
		t.minutes -= 60;
	}

	return t;
}

export function correctTime(t: time) {

	t = correctTimeAbsolute(t);

	while (t.hours >= 24) {
		t.hours -= 24;
	}

	return t;
}

export function addTimesAbsolute(a: time, b: time): time {
	let newTime = {
		hours: a.hours + b.hours,
		minutes: a.minutes + b.minutes,
		seconds: a.seconds + b.seconds,
	}

	newTime = correctTimeAbsolute(newTime)

	return newTime;
}

export function addTimes(a: time, b: time): time {

	let newTime = {
		hours: a.hours + b.hours,
		minutes: a.minutes + b.minutes,
		seconds: a.seconds + b.seconds,
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
		seconds: a.seconds - b.seconds,
	}

	newTime = correctTime(newTime);

	return newTime;
}

export function getTimeLeftUntil(timeDeadline: time): time {

	let currentTime = getCurrentTime();

	return subtractTime(timeDeadline, currentTime);
}

// Returns seconds from a to b, or 0 if a is after b
function secondsBetween(a: time, b: time) {
	let ans = 3600 * (b.hours - a.hours) + 60 * (b.minutes - a.minutes) + b.seconds - a.seconds;
	return Math.max(0, ans);
}

export function getProgressPercent(startingTime: time, timeDeadline: time): number {


	let totalSeconds = secondsBetween(startingTime, timeDeadline);
	let elapsedSeconds = secondsBetween(startingTime, getCurrentTime());

	let percent = Math.floor(100 * elapsedSeconds / totalSeconds);
	return Math.min(100, percent);
}

export function totalMinutes(t: time): number {
	return t.hours * 60 + t.minutes;
}

export function formatTimeLeft(timeLeft: time): string {

	let hourString = "";
	let minuteString = "";
	let secondString = "";

	if (timeLeft.hours != 0) {
		hourString = timeLeft.hours.toString() + " hr ";
	}

	if (timeLeft.minutes != 0) {
		minuteString = timeLeft.minutes.toString() + " min ";
	}

	secondString = timeLeft.seconds.toString() + " sec";

	return hourString + minuteString + secondString;
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
		seconds: 0,
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

export function minTime(a: time, b: time) {
	if (a.hours < b.hours) {
		return a;
	}
	if (a.hours > b.hours) {
		return b;
	}
	if (a.minutes < b.minutes) {
		return a;
	}
	if (a.minutes > b.minutes) {
		return b;
	}
	if (a.seconds < b.seconds) {
		return a;
	}
	if (a.seconds > b.seconds) {
		return b;
	}
	return a;
}