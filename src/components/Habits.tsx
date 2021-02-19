import React from 'react';
import { Box, ButtonGroup, IconButton, Text } from '@chakra-ui/react';
import * as utils from './Utils';
import { CloseIcon, DeleteIcon, EditIcon, RepeatClockIcon, SunIcon } from '@chakra-ui/icons';

type habitObjectType = {
	description: string,
	startTime: number, // expressed as milliseconds since 1970
}

interface Props {

}

function HabitItem(props: { habitObject: habitObjectType }) {

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
	let colorIndex: number = 0;
	for (let i = 1; i < dayThresholds.length; i++) {
		if (days >= dayThresholds[i]) colorIndex = i;
		else break;
	}
	const habitColor = habitColors[colorIndex];

	return (
		<Box d="flex" alignItems="center" bgColor={habitColor} borderBottomWidth="1px" h="60px" w="600px">
			<Box pl="30px" w="350px" overflow="scroll" h="100%" d="flex" alignItems="center" borderRightWidth="1px">
				<Text whiteSpace="nowrap">{description}</Text>
			</Box>
			<Box w="80px" h="100%" d="flex" alignItems="center" justifyContent="center" borderRightWidth="1px">
				<Text>{days.toString() + " days"}</Text>
			</Box>
			<Box d="flex" justifyContent="center" w="175px">
				<ButtonGroup isAttached>
					<IconButton aria-label="icon" icon={<EditIcon></EditIcon>}></IconButton>
					<IconButton aria-label="icon" icon={<RepeatClockIcon></RepeatClockIcon>}></IconButton>
					<IconButton aria-label="icon" icon={<DeleteIcon></DeleteIcon>}></IconButton>
				</ButtonGroup>
			</Box>
		</Box>
	)
}

function HabitsContainer() {

	const habitObject = {
		description: "This is a habit",
		startTime: Date.now(),
	}

	return (
		<Box h="400px" d="flex" flexDir="column" alignItems="center" borderRadius="30px" boxShadow="md" borderWidth="1px" overflow="scroll" w="602px">
			<HabitItem habitObject={habitObject}></HabitItem>
		</Box>
	)
}

function AddHabitsArea() {

}

function Habits(props: Props) {

	return (
		<Box d="flex" flexDir="column" alignItems="center" mt="50px" w={["100%", "100%", "1200px"]}>
			<HabitsContainer></HabitsContainer>
		</Box>
	)
}

export default Habits;
