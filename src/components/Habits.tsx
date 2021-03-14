import React, { useEffect, useRef, useState } from 'react';
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogOverlay, Box, Button, ButtonGroup, IconButton, Input, Popover, PopoverArrow, PopoverContent, PopoverTrigger, Text, useDisclosure, useToast } from '@chakra-ui/react';
import * as utils from './Utils';
import { CloseIcon, DeleteIcon, EditIcon, RepeatClockIcon, SunIcon } from '@chakra-ui/icons';

type habitObjectType = {
	description: string,
	startTime: number, // expressed as milliseconds since 1970
}

interface Props {
}

function HabitItem(props: { habitObject: habitObjectType, deleteHabit(x: number): void, resetHabit(x: number): void, editHabit(x: number, y: string): void }) {

	const habitObject = props.habitObject;
	const description = habitObject.description;
	const startTime = habitObject.startTime;
	const days = utils.getDaysSince(startTime);

	// Habits maintained for days >= thresholds correspond to different colors
	const dayThresholds = [
		0,
		1,
		3,
		7,
		14,
		21,
		30,
	]

	// Colors corresponding to day thresholds
	const habitColors: string[] = [
		"teal.500",
		"green.500",
		"cyan.500",
		"blue.500",
		"purple.500",
		"pink.500",
		"orange.500",
	]

	// Finding color for current habit
	const [colorIndex, setColorIndex] = useState(0);

	function setCorrectHabitColor() {
		let index = 0;
		for (let i = 1; i < dayThresholds.length; i++) {
			if (days >= dayThresholds[i]) index = i;
			else break;
		}

		setColorIndex(index);
	}

	useEffect(() => {
		setCorrectHabitColor();
	}, []);

	// Habit button actions
	function editHabit(description: string) {
		props.editHabit(startTime, description);
		setEditAlertIsOpen(false);
	}

	function resetHabit() {
		props.resetHabit(startTime);
		setResetAlertIsOpen(false);
	}

	function deleteHabit() {
		props.deleteHabit(startTime);
		setDeleteAlertIsOpen(false);
	}

	function cancelResetHabit() {
		setEditAlertIsOpen(false);
		setNewHabitName(description);
	}

	// Habit button alerts
	const [resetAlertIsOpen, setResetAlertIsOpen] = useState(false);
	const [deleteAlertIsOpen, setDeleteAlertIsOpen] = useState(false);
	const [editAlertIsOpen, setEditAlertIsOpen] = useState(false);
	const cancelRef = useRef();
	const [newHabitName, setNewHabitName] = useState(description);

	return (
		<Box d="flex" alignItems="center" bgColor={habitColors[colorIndex]} borderBottomWidth="1px" h="60px" w="100%">
			<Box pl="30px" overflow="hidden" w="350px" h="100%" d="flex" alignItems="center" borderRightWidth="1px">
				<Text whiteSpace="nowrap">{description}</Text>
			</Box>
			<Box w="80px" h="100%" d="flex" alignItems="center" justifyContent="center" borderRightWidth="1px">
				<Text>{days.toString() + " days"}</Text>
			</Box>
			<Box d="flex" justifyContent="center" w="175px">
				<ButtonGroup isAttached>
					<IconButton aria-label="icon" onClick={() => setEditAlertIsOpen(true)} icon={<EditIcon></EditIcon>}></IconButton>
					<IconButton aria-label="icon" onClick={() => setResetAlertIsOpen(true)} icon={<RepeatClockIcon></RepeatClockIcon>}></IconButton>
					<IconButton aria-label="icon" onClick={() => setDeleteAlertIsOpen(true)} icon={<DeleteIcon></DeleteIcon>}></IconButton>
				</ButtonGroup>
			</Box>

			{/* Alert for reset habit: */}

			<AlertDialog isOpen={resetAlertIsOpen} leastDestructiveRef={cancelRef as any} onClose={() => setResetAlertIsOpen(false)}>
				<AlertDialogOverlay>
					<AlertDialogContent w="300px">
						<AlertDialogBody p="30px" d="flex" flexDir="column" alignItems="center" >
							Reset habit streak to 0 days?
							<Box mt="20px" w="100%" d="flex" justifyContent="center">
								<Button ref={cancelRef as any} onClick={() => setResetAlertIsOpen(false)} mx="15px">Cancel</Button>
								<Button onClick={resetHabit} mx="15px" colorScheme="red">Reset</Button>
							</Box>
						</AlertDialogBody>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>

			{/* Alert for delete habit: */}

			<AlertDialog isOpen={deleteAlertIsOpen} leastDestructiveRef={cancelRef as any} onClose={() => setDeleteAlertIsOpen(false)}>
				<AlertDialogOverlay>
					<AlertDialogContent w="300px">
						<AlertDialogBody p="30px" d="flex" flexDir="column" alignItems="center" >
							Delete this habit?
							<Box mt="20px" w="100%" d="flex" justifyContent="center">
								<Button ref={cancelRef as any} onClick={() => setDeleteAlertIsOpen(false)} mx="15px">Cancel</Button>
								<Button onClick={deleteHabit} mx="15px" colorScheme="red">Delete</Button>
							</Box>
						</AlertDialogBody>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>

			{/* Alert for edit habit */}

			<AlertDialog isOpen={editAlertIsOpen} leastDestructiveRef={cancelRef as any} onClose={() => setEditAlertIsOpen(false)}>
				<AlertDialogOverlay>
					<AlertDialogContent w="300px">
						<AlertDialogBody p="30px" d="flex" flexDir="column" alignItems="center" >
							<Text>
								Rename habit:
							</Text>
							<Input value={newHabitName} onChange={(e) => setNewHabitName(e.target.value)} mt="15px"></Input>
							<Box mt="15px">
								<Button ref={cancelRef as any} onClick={cancelResetHabit} mx="15px">Cancel</Button>
								<Button colorScheme="purple" onClick={() => editHabit(newHabitName)}>Confirm</Button>
							</Box>
						</AlertDialogBody>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</Box >
	)
}

function HabitsContainer(props: { habits: habitObjectType[], deleteHabit(x: number): void, resetHabit(x: number): void, editHabit(x: number, y: string): void }) {

	let sortedHabits = props.habits.slice();
	sortedHabits.sort((a, b) => (a.startTime < b.startTime ? 1 : -1));
	const [habits, setHabits] = useState(sortedHabits);

	useEffect(() => {
		let sortedHabits = props.habits.slice();
		sortedHabits.sort((a, b) => (a.startTime > b.startTime ? 1 : -1));
		setHabits(sortedHabits);
	}, [props.habits]);

	function noHabitsMessage() {
		if (habits.length == 0) {
			return (
				<Text textAlign="center" w="600px" mt="50px">
					No habits yet...
				</Text>
			)
		}
	}

	return (
		<Box h="500px" overflow="hidden" borderRadius="30px" boxShadow="md" borderWidth="1px" w="602px">
			<Box h="100%" w="650px" pr="100px" overflowY="scroll" boxSizing="content-box" d="flex" flexDir="column" borderRadius="30px">
				{
					habits.map((item) => {
						return <HabitItem deleteHabit={props.deleteHabit} editHabit={props.editHabit} resetHabit={props.resetHabit} key={item.startTime} habitObject={item}></HabitItem>
					})
				}
				{
					noHabitsMessage()
				}
			</Box>
		</Box>
	)
}

function AddHabitsArea(props: { addHabit(description: string): void }) {

	const [isAddingHabit, setIsAddingHabit] = useState(false);
	const [habitDescription, setHabitDescription] = useState("");


	function handleAddHabit() {
		setIsAddingHabit(true);
	}

	function handleCancelAddHabit() {
		setIsAddingHabit(false);
		setHabitDescription("");
	}

	const [popoverIsOpen, setPopoverIsOpen] = useState(false);
	const [popoverMessage, setPopoverMessage] = useState("");

	function errorAlert() {
		setPopoverMessage("Oops, try again");
		setPopoverIsOpen(true);
	}

	function canAddHabit(): boolean {
		if (habitDescription == "") {
			errorAlert();
			return false;
		}

		return true;
	}

	function addHabit() {
		if (canAddHabit()) {
			props.addHabit(habitDescription);
			handleCancelAddHabit();
		}
	}


	function handleKeyDown(e: any) {
		if (e.key == "Enter") {
			addHabit();
		}
	}

	function displayCorrectElement() {
		if (isAddingHabit) {
			return (
				<Box d="flex" flexDir="column" alignItems="center">
					<Box d="flex" w="300px" flexDir="column" alignItems="start">
						<Popover returnFocusOnClose={false} isOpen={popoverIsOpen} onClose={() => setPopoverIsOpen(false)} placement="right">
							<PopoverTrigger>
								<Input onKeyDown={(e) => handleKeyDown(e)} value={habitDescription} onChange={(e) => setHabitDescription(e.target.value)} placeholder="Go to bed early" w="100%" type="text"></Input>
							</PopoverTrigger>
							<PopoverContent bgColor="pink.500" ml="5px" px="10px" w="150px" textAlign="center">
								<PopoverArrow bgColor="pink.500"></PopoverArrow>
								{popoverMessage}
							</PopoverContent>
						</Popover>
					</Box>
					<Box d="flex" mt="15px">
						<Button mx="15px" variant="outline" colorScheme="green" onClick={addHabit}>Add</Button>
						<Button mx="15px" onClick={handleCancelAddHabit} w="100px" colorScheme="red" variant="outline">Cancel</Button>
					</Box>
				</Box >
			)
		}
		return (
			<Button onClick={handleAddHabit} colorScheme="blue" variant="outline">New Habit</Button>
		)
	}

	return (
		<Box w="600px" h="200px" d="flex" flexDir="column" alignItems="center" mt="30px">
			{
				displayCorrectElement()
			}
		</Box>
	)
}

function Habits(props: Props) {

	// Initializing habit state to value from local storage
	let item = localStorage.getItem("habits");
	const [habits, setHabits] = useState((item == null ? [] : JSON.parse(item)) as habitObjectType[]);

	const habitToast = useToast();

	function addHabit(description: string) {
		let newHabit: habitObjectType = {
			description: description,
			startTime: Date.now(),
		}
		// Adding habit to habits state
		let habitsTemp = habits.slice();
		habitsTemp.push(newHabit);
		setHabits(habitsTemp);
		// Toast for added habit
		habitToast({
			title: "New habit added.",
			status: "success",
			position: "top-right",
			description: "Day streak will update automatically.",
			duration: 7000,
			isClosable: true,
		})
	}

	// UseEffect to store habits in local storage
	useEffect(() => {
		localStorage.setItem("habits", JSON.stringify(habits));
	}, [habits])

	function getHabitIndex(id: number): number {
		for (let i = 0; i < habits.length; i++) {
			if (habits[i].startTime == id) {
				return i;
			}
		}

		return -1;
	}

	function deleteHabit(id: number) {
		let ind = getHabitIndex(id);
		let newHabits = habits.slice();
		newHabits.splice(ind, 1);
		setHabits(newHabits);
	}

	function resetHabit(id: number) {
		let ind = getHabitIndex(id);
		let newHabits = habits.slice();
		newHabits[ind].startTime = Date.now();
		setHabits(newHabits);
	}

	function editHabit(id: number, newName: string) {
		let ind = getHabitIndex(id);
		let newHabits = habits.slice();
		newHabits[ind].description = newName;
		setHabits(newHabits);
	}

	return (
		<Box d="flex" flexDir="column" alignItems="center" mt="50px" w={["100%", "100%", "1200px"]}>
			<HabitsContainer deleteHabit={deleteHabit} resetHabit={resetHabit} editHabit={editHabit} habits={habits}></HabitsContainer>
			<AddHabitsArea addHabit={addHabit}></AddHabitsArea>
		</Box>
	)
}

export default Habits;
