import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Box, useColorMode } from '@chakra-ui/react';
import WorkSession from './components/WorkSession';
import MyMenu from './components/MyMenu';
import { pageType } from './myTypes';
import Habits from './components/Habits';
import Goals from './components/Goals';

function App() {

	const { colorMode, toggleColorMode } = useColorMode();
	const [page, setPage] = useState("work" as pageType);

	useEffect(() => {
		if (colorMode == "light") toggleColorMode();
		// navigate to page stored in localstorage
		let item = localStorage.getItem("page");
		if (item == null) return;
		setCurrentPage(item as pageType);
	}, [])

	function displayCorrectPage() {
		switch (page) {
			case "work":
				return <WorkSession></WorkSession>
			case "habits":
				return <Habits></Habits>
			case "goals":
				return <Goals></Goals>
			default:
				return <div>Oops</div>
		}
	}

	function setCurrentPage(newPage: pageType) {
		setPage(newPage);
		// Save page in local storage
		localStorage.setItem("page", newPage);
	}

	return (
		<Box d="flex" flexDir="row" justifyContent="space-between">
			<MyMenu onSetPage={setCurrentPage}></MyMenu>
			{
				displayCorrectPage()
			}
			<Box w="150px"></Box>
		</Box>
	);
}

export default App;
