import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Box, Text, useColorMode } from '@chakra-ui/react';
import WorkSession from './components/WorkSession';
import MyMenu from './components/MyMenu';
import { pageType } from './components/pages';
import Habits from './components/Habits';
import Home from './components/Home';
import Notes from './components/Notes';
import Checklist from './components/Checklist';

function App() {

	const { colorMode, toggleColorMode } = useColorMode();
	const [page, setPage] = useState(null as pageType);

	useEffect(() => {
		if (colorMode == "light") toggleColorMode();
		// navigate to page stored in localstorage
		let item = localStorage.getItem("page");
		if (item == null) {
			console.log("got here");
			setPage("home");
			return;
		};
		setPage(item as pageType);
	}, [])

	useEffect(() => {
		if (page == null) return;
		document.title = page.charAt(0).toUpperCase() + page.slice(1, page.length);
		localStorage.setItem("page", page);
	}, [page])

	// Time display

	const [timeString, setTimeString] = useState(getCurrentTimeString());
	let timer: NodeJS.Timeout;
	useEffect(() => {
		timer = setInterval(() => setTimeString(getCurrentTimeString()), 10000);
		return () => {
			clearTimeout(timer);
		}
	}, [])

	function getCurrentTimeString(): string {
		let date = new Date();
		let hours = date.getHours();
		let minutes = date.getMinutes();
		let ampm = "AM";
		if (hours > 12) {
			hours -= 12;
			ampm = "PM";
		}
		let hoursString = hours.toString();
		let minutesString = minutes.toString();
		if (minutesString.length < 2) minutesString = "0" + minutesString;
		return hoursString + ":" + minutesString + " " + ampm;
	}


	function TimeDisplay() {
		return (
			<Box mt="30px" w="170px" d="flex" flexDir="row" pr="30px" justifyContent="flex-end">
				<Box d="flex" justifyContent="center" w="100px" h="50px" borderWidth="2px" borderRadius="10px" alignItems="center">
					<Text textAlign="center">{timeString}</Text>
				</Box>
			</Box>
		)
	}

	// Keybinds

	let prevKey = "";
	let pageDict: { w: pageType, c: pageType, h: pageType, n: pageType } = {
		w: "work",
		c: "checklist",
		h: "habits",
		n: "notes",
	}

	function handleKeyPress(key: KeyboardEvent) {
		// backslash + letter will navigate to that page
		let curr = key.key;

		if (prevKey == "\\") {
			if (pageDict.hasOwnProperty(curr)) {
				setPage(pageDict[curr as "w" | "c" | "h" | "n"]);
			}
		}

		prevKey = curr;

	}

	useEffect(() => {
		document.addEventListener("keypress", handleKeyPress);
		return () => document.removeEventListener("keypress", handleKeyPress);

	}, [])

	// Page display

	function displayCorrectPage() {
		switch (page) {
			case "work":
				return <WorkSession></WorkSession>
			case "habits":
				return <Habits></Habits>
			case "checklist":
				return <Checklist></Checklist>
			case "notes":
				return <Notes></Notes>
			case "home":
				return <Home onSetPage={setPage}></Home>
			default:
				return <div>Oops</div>
		}
	}

	return (
		<Box d="flex" flexDir="row" justifyContent="space-between">
			{
				page != "home" ? <MyMenu onSetPage={setPage}></MyMenu> : null
			}
			{
				displayCorrectPage()
			}
			{
				page != "home" ? <TimeDisplay></TimeDisplay> : null
			}
		</Box>
	);
}

export default App;
