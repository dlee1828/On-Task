import React, { RefObject, useEffect, useRef, useState } from 'react';
import { AlertDialog, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, CircularProgress, CircularProgressLabel, IconButton, Input, Text } from '@chakra-ui/react';
import * as utils from './Utils';
import { CloseIcon, SettingsIcon } from '@chakra-ui/icons';

interface Props {
	currentTask: string;
	timeDeadline: utils.time;
	startingTime: utils.time;
	onLeaveTask(): void;
	onResetWithMoreTime(newStartingTime: utils.time, newTimeDeadline: utils.time): void;
}

// Timer for updating state
let timer: NodeJS.Timeout;

function TaskOngoing(props: Props) {

	// Locally storing params from props
	let currentTask = props.currentTask;
	let timeDeadline = props.timeDeadline;
	let startingTime = props.startingTime;

	// Initial amount of time left
	const initialTimeLeft = utils.subtractTime(timeDeadline, startingTime);

	// State variable for current amount of time left
	const [timeLeftState, setTimeLeftState] = useState(initialTimeLeft);
	// State variable for progress percent
	const [progressPercent, setProgressPercent] = useState(0);

	// Current time left
	let timeLeft = initialTimeLeft;

	// Whether time has run out
	let [timeUpBool, setTimeUpBool] = useState(false);

	// Time left as a string
	function timeLeftString() {
		return timeUpBool ? "Time Up" : utils.formatTimeLeft(timeLeftState);
	}

	function updateTimeLeft() {
		document.title = timeLeftString();

		if (timeUpBool) return;

		// Updating timeLeft
		timeLeft = utils.getTimeLeftUntil(timeDeadline);

		// Time is out if timeLeft = 0
		if ((timeLeft.hours >= 20) || (timeLeft.hours == 0 && timeLeft.minutes == 0 && timeLeft.seconds == 0)) handleTimeUp();

		setTimeLeftState(timeLeft);
		setProgressPercent(utils.getProgressPercent(startingTime, timeDeadline))
	}

	// Clear timer, set timeUpBool to true
	function handleTimeUp() {
		clearInterval(timer);
		setTimeUpBool(true);
	}

	// Updates time left every second 
	clearInterval(timer);
	timer = setInterval(updateTimeLeft, 1000);

	// State variables for time up menus & fields
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

	// User requests more time for current task
	function resetWithMoreTime() {
		let n = parseInt(moreTimeField);
		if (n == NaN) {
			alert("try again");
			return;
		}

		// Send computed update values to parent
		startingTime = utils.getCurrentTime();
		timeDeadline = utils.addTimes(startingTime, { hours: 0, minutes: n, seconds: 0 });

		props.onResetWithMoreTime(startingTime, timeDeadline);
		setTimeUpBool(false);
		setShowingMoreTimeMenu(false);
		updateTimeLeft();
	}

	function handleKeyDown(e: any) {
		if (e.key == "Enter") {
			resetWithMoreTime();
		}
	}

	function timeUpButtons() {
		if (!timeUpBool) return;
		return (
			<Box d="flex" flexDir="column">
				<Button w="150px" d={!showingMoreTimeMenu ? "block" : "none"} onClick={handleTaskComplete} colorScheme="green" mb="10px">Task Complete</Button>
				<Button w="150px" d={!showingMoreTimeMenu ? "block" : "none"} onClick={handleMoreTime} colorScheme="blue" mb="10px">More Time</Button>
				<Input w="150px" d={showingMoreTimeMenu ? "block" : "none"} mb="10px" placeholder={"# minutes"} onChange={(e) => setMoreTimeField(e.target.value)} onKeyDown={handleKeyDown} value={moreTimeField}></Input>
				<Button w="150px" d={showingMoreTimeMenu ? "block" : "none"} variant="outline" colorScheme="green" mb="10px" onClick={resetWithMoreTime}>Confirm</Button>
				<Button w="150px" d={showingMoreTimeMenu ? "block" : "none"} onClick={() => setShowingMoreTimeMenu(false)} variant="outline" colorScheme="red" mb="10px">Cancel</Button>
				<Button w="150px" d={!showingMoreTimeMenu ? "blcok" : "none"} onClick={handleCancelTask} colorScheme="red">Cancel Task</Button>
			</Box>
		)
	}

	// Alert Dialog 
	const [alertIsOpen, setAlertIsOpen] = React.useState(false)
	const closeAlert = () => setAlertIsOpen(false);
	const cancelRef = useRef();

	return (
		<Box px="50px" py="30px" d="flex" flexDir="column" borderRadius="30px" boxShadow="md" borderWidth="1px" alignItems="center" mt="100px">
			<Box px="20px" py="10px" mb="10px" d="flex" flexDir="column" alignItems="center" borderWidth="3px" borderColor="yellow.500" borderRadius="20px">
				<Text fontSize="lg" fontWeight="bold">{currentTask}</Text>
				<Text>{"by " + utils.timeToString(timeDeadline)}</Text>
			</Box>
			<CircularProgress mb="10px" color="pink.500" trackColor="blue.500" capIsRound size={200} thickness={2} value={progressPercent}>
				<CircularProgressLabel fontSize="17px">
					<Text>{timeLeftString()}</Text>
				</CircularProgressLabel>
			</CircularProgress>
			{
				timeUpBool ? null : (
					<IconButton aria-label="options" onClick={() => setAlertIsOpen(true)} icon={<SettingsIcon />}></IconButton>
				)
			}
			{timeUpButtons()}

			<AlertDialog isOpen={alertIsOpen} leastDestructiveRef={cancelRef as any} onClose={closeAlert}>
				<AlertDialogOverlay>
					<AlertDialogContent p="15px" w="auto" h="auto" mt="200px">
						<AlertDialogBody d="flex" flexDir="column" justifyContent="center" alignItems="center">
							<Button w="150px" variant="outline" onClick={props.onLeaveTask} colorScheme="green" mb="10px" ref={cancelRef as any}>
								Task Completed
              				</Button>
							<Button w="150px" variant="outline" onClick={props.onLeaveTask} colorScheme="red">
								Cancel Task
              				</Button>
						</AlertDialogBody>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>

		</Box>
	)
}

export default TaskOngoing;
