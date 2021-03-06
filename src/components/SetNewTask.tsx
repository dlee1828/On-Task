import React, { useEffect, useRef, useState } from 'react';
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogOverlay, Box, Button, Input, keyframes, Popover, PopoverArrow, PopoverContent, PopoverTrigger, Text, useColorMode } from '@chakra-ui/react';
import * as utils from "./Utils";
import InfoContainer from './InfoContainer';

interface Props {
	onNewTask(task: string, timeDeadline: utils.time, taskStartingTime: utils.time): void;
	endWorkSession(): void;
}

function SetNewTask(props: Props) {

	// State variables
	const [task, setTask] = useState("");
	// Strings for input field
	const [finishByTime, setFinishByTime] = useState(""); // E.g. finish at 4:30
	const [finishInTime, setFinishInTime] = useState(""); // E.g. finish in 2 hours

	// Will be passed to parent
	let timeDeadline: utils.time;

	// Handling enter key
	function handleEnterKey(e: any) {
		if (e.key == "Enter") {
			confirmNewTask();
		}
	}

	// Check if entries are valid, also sets timeDeadline
	function validateEntries() {
		if (task == "") return false;

		// Trim strings 
		let finishByTimeString = finishByTime.trim();
		let finishInTimeString = finishInTime.trim();

		// Check if both are nonempty
		if (finishByTimeString != "" && finishInTimeString != "") return false;

		// Checks validity of whichever field, sets timedeadline
		let isFinishIn = finishInTimeString != "";
		if (isFinishIn) {
			if (!/\d+/.test(finishInTimeString)) return false;
			let minutes = parseInt(finishInTimeString);
			if (minutes <= 0) return false;
			timeDeadline = utils.getTimeFromNow({
				hours: 0,
				minutes: minutes,
				seconds: 0,
			})
		}
		else {
			if (!utils.checkValidTime(finishByTimeString)) return false;
			let currentTime = utils.getCurrentTime();
			let newTime = utils.stringToTime(finishByTimeString) as utils.time;
			newTime = utils.correctTime(newTime);
			if (newTime.hours < currentTime.hours) newTime.hours += 12;
			timeDeadline = newTime;
		}
		return true;
	}

	// Error popover
	const [popoverIsOpen, setPopoverIsOpen] = useState(false);
	const [popoverMessage, setPopoverMessage] = useState("");
	function errorMessage() {
		setPopoverIsOpen(true);
		setPopoverMessage("Oops, try again");
	}

	// Confirm new task
	function confirmNewTask() {
		if (!validateEntries()) {
			errorMessage();
			return false;
		}

		props.onNewTask(task, timeDeadline, utils.getCurrentTime());
	}

	// End Work Session Button
	const [dialogIsOpen, setDialogIsOpen] = useState(false);
	const cancelRef = useRef();

	return (
		<Box d="flex" flexDir="column" alignItems="center">
			<Popover placement="right" size="" gutter={20} isOpen={popoverIsOpen} onClose={() => setPopoverIsOpen(false)}>
				<PopoverTrigger>
					<Box px="50px" py="30px" d="flex" onKeyDown={handleEnterKey} flexDir="column" borderRadius="30px" boxShadow="md" borderWidth="1px" alignItems="center" mt="50px">
						<Text mb="10px">New Task</Text>
						<Input id="taskInput" mb="20px" placeholder="Clean my room" onChange={(e) => setTask(e.target.value)} isInvalid errorBorderColor="purple.500" focusBorderColor="lime" w="300px" value={task}></Input>
						<Box d="flex" mb="2px" justifyContent="space-between" alignItems="center" w="300px">
							<Text w="125px" fontSize="sm" textAlign="center">Finish in (min)</Text>
							<Text w="125px" fontSize="sm" textAlign="center">Finish by</Text>
						</Box>
						<Box mb="20px" d="flex" justifyContent="space-between" alignItems="center" w="300px">
							<Input isDisabled={finishByTime != ""} value={finishInTime} onChange={(e) => setFinishInTime(e.target.value)} placeholder="15" w="125px"></Input>
							<Text>OR</Text>
							<Input isDisabled={finishInTime != ""} value={finishByTime} onChange={(e) => setFinishByTime(e.target.value)} placeholder="7:30" w="125px"></Input>
						</Box>
						<Button onClick={confirmNewTask} variant="outline" colorScheme="orange">Confirm</Button>
					</Box >
				</PopoverTrigger>
				<PopoverContent textAlign="center" w="140px" bg="pink.500">
					<PopoverArrow bg="pink.500"></PopoverArrow>
					{popoverMessage}
				</PopoverContent>
			</Popover>
			<InfoContainer></InfoContainer>
			<Button onClick={() => setDialogIsOpen(true)} mt="50px" variant="outline" colorScheme="gray">End Work Session</Button>
			<AlertDialog isOpen={dialogIsOpen} leastDestructiveRef={cancelRef as any} onClose={() => setDialogIsOpen(false)}>
				<AlertDialogOverlay>
					<AlertDialogContent w="300px">
						<AlertDialogBody d="flex" py="20px" alignItems="center" flexDir="column">
							End current work session?
							<Box w="100%" mt="20px" d="flex" justifyContent="center">
								<Button mx="15px" ref={cancelRef as any} onClick={() => setDialogIsOpen(false)}>Cancel</Button>
								<Button mx="15px" colorScheme="red" onClick={props.endWorkSession}>Yes</Button>
							</Box>
						</AlertDialogBody>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</Box>

	)
}

export default SetNewTask;
