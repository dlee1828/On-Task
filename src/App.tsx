import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { Box, useColorMode } from '@chakra-ui/react';
import CurrentTask from './components/CurrentTask';

function App() {


	const { colorMode, toggleColorMode } = useColorMode();

	useEffect(() => {
		if (colorMode == "light") toggleColorMode();
	}, [])

	return (
		<Box d="flex" flexDir="column" alignItems="center">
			<CurrentTask></CurrentTask>
		</Box>
	);
}

export default App;
