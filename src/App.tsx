import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Box, useColorMode } from '@chakra-ui/react';
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
				page != "home" ? <Box w="170px"></Box> : null
			}
		</Box>
	);
}

export default App;
