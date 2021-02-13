import React, { useState } from 'react';
import { Box, Button, Input, Popover, PopoverArrow, PopoverContent, PopoverTrigger, Text, useColorMode } from '@chakra-ui/react';
import * as utils from "./Utils";

interface Props {

}

function SetNewTask(props: Props) {

	// State variables
	const [task, setTask] = useState("");
	const [finishAtTime, setFinishAtTime] = useState(""); // E.g. finish at 4:30
	const [finishInTime, setFinishInTime] = useState(""); // E.g. finish in 2 hours

	// Will be passed to parent
	let timeDeadline: utils.time;

	// Handling enter key
	function handleKeyDown(e: any) {
		if (e.key == "Enter") {
			confirmNewTask();
		}
	}

	// Check if entries work, also sets timeDeadline
	function validateEntries() {
		if (task == "") return false;
		let finishAtTimeString = finishAtTime.trim();
		let finishInTimeString = finishInTime.trim();
		if (finishAtTimeString != "" && finishInTimeString != "") return false;
		let isFinishIn = finishInTimeString != "";
		if (isFinishIn) {
			if (!/\d+/.test(finishInTimeString)) return false;
			timeDeadline = utils.getTimeFromNow({
				hours: 0,
				minutes: parseInt(finishInTimeString),
			})
		}
		else {
			if (!utils.checkValidTime(finishAtTimeString)) return false;
			let currentTime = utils.getCurrentTime();
			let newTime = utils.stringToTime(finishAtTimeString) as utils.time;
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
		alert(utils.timeToString(timeDeadline));
	}

	return (
		<Popover placement="right" size="" gutter={20} isOpen={popoverIsOpen} onClose={() => setPopoverIsOpen(false)}>
			<PopoverTrigger>
				<Box px="50px" py="30px" d="flex" onKeyDown={handleKeyDown} flexDir="column" borderRadius="30px" boxShadow="md" borderWidth="1px" alignItems="center" mt="100px">
					<Text mb="10px">Next Task</Text>
					<Input mb="20px" placeholder="clean my room" onChange={(e) => setTask(e.target.value)} isInvalid errorBorderColor="blue.300" focusBorderColor="lime" w="300px" value={task}></Input>
					<Box d="flex" justifyContent="space-between" alignItems="center" w="300px">
						<Text w="125px" fontSize="sm" textAlign="center">Finish in (min)</Text>
						<Text w="125px" fontSize="sm" textAlign="center">Finish at</Text>
					</Box>
					<Box mb="20px" d="flex" justifyContent="space-between" alignItems="center" w="300px">
						<Input value={finishInTime} onChange={(e) => setFinishInTime(e.target.value)} placeholder="30" w="125px"></Input>
						<Text>OR</Text>
						<Input value={finishAtTime} onChange={(e) => setFinishAtTime(e.target.value)} placeholder="7:30" w="125px"></Input>
					</Box>
					<Button onClick={confirmNewTask} variant="outline" colorScheme="orange">Confirm</Button>
				</Box >
			</PopoverTrigger>
			<PopoverContent textAlign="center" w="140px" bg="pink.500">
				<PopoverArrow bg="pink.500"></PopoverArrow>
				{popoverMessage}
			</PopoverContent>
		</Popover>

	)
}

export default SetNewTask;
