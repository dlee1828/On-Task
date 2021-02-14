import React, { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, CircularProgressLabel, Input, Text } from '@chakra-ui/react';
import * as utils from './Utils';

interface Props {
	currentTask: string;
	timeDeadline: utils.time;
	startingTime: utils.time;
	onLeaveTask(): void;
	onResetWithMoreTime(minutes: number): void;
}

let timer: NodeJS.Timeout;

function TaskOngoing(props: Props) {

	const currentTask = props.currentTask;
	const timeDeadline = props.timeDeadline;
	const startingTime = props.startingTime;

	const initialTimeLeft = utils.subtractTime(timeDeadline, startingTime);

	const [timeLeftState, setTimeLeftState] = useState(initialTimeLeft);
	const [progressPercent, setProgressPercent] = useState(0);

	let timeLeft = initialTimeLeft;

	let [timeUpBool, setTimeUpBool] = useState(false);

	function updateTimeLeft() {
		if (timeUpBool) return;

		timeLeft = utils.getTimeLeftUntil(timeDeadline);

		if (timeLeft.hours == 0 && timeLeft.minutes == 0) handleTimeUp();

		setTimeLeftState(timeLeft);
		setProgressPercent(utils.getProgressPercent(startingTime, timeDeadline))
	}

	function handleTimeUp() {
		clearInterval(timer);
		setTimeUpBool(true);
	}

	clearInterval(timer);
	timer = setInterval(updateTimeLeft, 1000);

	let [showingMoreTimeMenu, setShowingMoreTimeMenu] = useState(false);
	let [moreTimeField, setMoreTimeField] = useState("");

	function handleTaskComplete() {
		props.onLeaveTask();
	}

	function handleMoreTime() {
		setShowingMoreTimeMenu(true);
	}

	function handleCancelTask() {
		props.onLeaveTask();
	}

	function resetWithMoreTime() {
		let n = parseInt(moreTimeField);
		if (n == NaN) {
			alert("try again");
			return;
		}
		setTimeUpBool(false);
		props.onResetWithMoreTime(n);
	}

	function timeUpButtons() {
		if (!timeUpBool) return;
		return (
			<Box d="flex" flexDir="column">
				<Button w="150px" d={!showingMoreTimeMenu ? "block" : "none"} onClick={handleTaskComplete} colorScheme="green" mb="10px">Task Complete</Button>
				<Button w="150px" d={!showingMoreTimeMenu ? "block" : "none"} onClick={handleMoreTime} colorScheme="blue" mb="10px">More Time</Button>
				<Input w="150px" d={showingMoreTimeMenu ? "block" : "none"} mb="10px" placeholder={"minutes"} onChange={(e) => setMoreTimeField(e.target.value)} value={moreTimeField}></Input>
				<Button w="150px" d={showingMoreTimeMenu ? "block" : "none"} variant="outline" colorScheme="green" mb="10px" onClick={resetWithMoreTime}>Confirm</Button>
				<Button w="150px" d={showingMoreTimeMenu ? "block" : "none"} onClick={() => setShowingMoreTimeMenu(false)} variant="outline" colorScheme="red" mb="10px">Cancel</Button>
				<Button w="150px" d={!showingMoreTimeMenu ? "blcok" : "none"} onClick={handleCancelTask} colorScheme="red">Cancel Task</Button>
			</Box>
		)
	}

	return (
		<Box px="50px" py="30px" d="flex" flexDir="column" borderRadius="30px" boxShadow="md" borderWidth="1px" alignItems="center" mt="100px">
			<Box px="20px" py="10px" mb="10px" d="flex" justifyContent="center" borderWidth="3px" borderColor="yellow.500" borderRadius="20px">
				<Text fontWeight="bold">{currentTask}</Text>
			</Box>
			<CircularProgress mb="10px" color="pink.500" trackColor="blue.500" capIsRound size={200} thickness={2} value={progressPercent}>
				<CircularProgressLabel fontSize="17px">
					<Text>{timeUpBool ? "Time Up" : utils.formatTimeLeft(timeLeftState) + " left"}</Text>
				</CircularProgressLabel>
			</CircularProgress>
			{timeUpButtons()}
		</Box>
	)
}

export default TaskOngoing;
