import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Box } from '@chakra-ui/react';
import CurrentTask from './components/CurrentTask';

function App() {
	return (
		<Box d="flex" flexDir="column" alignItems="center">
			<CurrentTask></CurrentTask>
		</Box>
	);
}

export default App;
