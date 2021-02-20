import React, { useState } from 'react';
import { Box, Button } from '@chakra-ui/react';
import CurrentTask from './CurrentTask';

interface Props {

}

function WorkSession(props: Props) {
	const [inWorkSession, setInWorkSession] = useState(localStorage.getItem("inWorkSession") == "true" ? true : false);
	// Start work session 
	function startWorkSession() {
		localStorage.setItem("inWorkSession", "true");
		setInWorkSession(true);
	}

	function endWorkSession() {
		setInWorkSession(false);
		// clear local storage for:
		let itemNames = [
			"taskStartingTime",
			"completedTasks",
			"currentTask",
			"timeDeadline",
			"inWorkSession",
			"currentMode",
		]

		for (let i = 0; i < itemNames.length; i++) {
			localStorage.removeItem(itemNames[i]);
		}
	}

	// Displays either button to start work session or current work session 
	function displayWorkComponent() {
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
		<Box>
			{
				displayWorkComponent()
			}
		</Box>
	)
}

export default WorkSession;
