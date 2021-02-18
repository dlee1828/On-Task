import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Box, Button, useColorMode } from '@chakra-ui/react';
import CurrentTask from './components/CurrentTask';
import InfoContainer from './components/InfoContainer';

function App() {

	const { colorMode, toggleColorMode } = useColorMode();
	const [inWorkSession, setInWorkSession] = useState(localStorage.getItem("inWorkSession") == "true" ? true : false);

	useEffect(() => {
		if (colorMode == "light") toggleColorMode();
	}, [])

	// Start work session 
	function startWorkSession() {
		localStorage.setItem("inWorkSession", "true");
		setInWorkSession(true);
	}

	function endWorkSession() {
		setInWorkSession(false);
		localStorage.clear();
	}

	// Displays either button to start work session or current work session 
	function displayCorrectComponent() {
		if (inWorkSession) {
			return (
				<CurrentTask endWorkSession={endWorkSession}></CurrentTask>
			)
		}
		else {
			return (
				<Button onClick={startWorkSession} colorScheme="green" mt="100px">
					Start Work Session
				</Button>
			)
		}
	}

	return (
		<Box d="flex" flexDir="column" alignItems="center">
			{
				displayCorrectComponent()
			}
		</Box>
	);
}

export default App;
