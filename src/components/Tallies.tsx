import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { Box, Heading, Text } from "@chakra-ui/layout";
import { propNames } from "@chakra-ui/styled-system";
import { useEffect, useState } from "react";

type Tally = {
	title: string,
	count: number,
	color: string,
	timestamp: number,
}

type Tallies = Tally[];

type TallyContainerProps = {
	tally: Tally,
	isRemovingTally: boolean,
	onRemoveTally(timestamp: number): void,
	onAddOne(timestamp: number): void,
}

function TallyContainer(props: TallyContainerProps) {
	// Number display
	// +1 button
	// settings button
	// * Edit name
	// * Subtract 1 
	// * Delete

	const tally = props.tally;

	return (
		<Box width="325px" p="25px" mb="50px" borderRadius="50px" borderWidth="2px" borderStyle="dashed" d="flex" flexFlow="column nowrap" alignItems="center">
			<Text color={tally.color + ".200"} mb="15px" fontSize="2xl"> {tally.title}</Text>
			<Heading size="2xl" mb="20px"> {tally.count} </Heading>
			{
				props.isRemovingTally ? (
					<Button onClick={() => props.onRemoveTally(tally.timestamp)} colorScheme="gray">Remove</Button>
				) : (
					<Button onClick={() => props.onAddOne(tally.timestamp)} colorScheme={tally.color}>+1</Button>
				)
			}
		</Box >
	)
}

type AddTalliesAreaProps = {
	onAddTally(title: string): void,
	onRemovingTally(x: boolean): void,
	isRemovingTally: boolean,
}

function AddTalliesArea(props: AddTalliesAreaProps) {

	const [isAddingTally, setIsAddingTally] = useState(false);
	const [tallyTitle, setTallyTitle] = useState("");

	function handleKeyPress(key: KeyboardEvent) {
		if (isAddingTally) return;
		if (key.key == "n") {
			setIsAddingTally(true);
			key.preventDefault();
		}
	}

	useEffect(() => {
		document.addEventListener('keypress', handleKeyPress);
		return () => {
			document.removeEventListener('keypress', handleKeyPress);
		}
	}, [isAddingTally])

	function handleKeyDown(e: any) {
		if (e.key == "Enter") {
			handleAddTally(tallyTitle);
			handleCancelAddTally();
		}
		else if (e.key == "Escape") {
			handleCancelAddTally();
		}
	}

	function handleAddTally(title: string) {
		props.onAddTally(title);
		setIsAddingTally(false);
	}

	function handleCancelAddTally() {
		setIsAddingTally(false);
		setTallyTitle("");
	}

	function handleRemoveTally() {
		props.onRemovingTally(true);
	}

	function handleCancelRemoveTally() {
		props.onRemovingTally(false);
	}

	return (
		<Box d="flex" flexDir="column" alignItems="center">
			{
				isAddingTally ? (
					<Box d="flex" flexDir="column" alignItems="center">
						<Input onKeyDown={handleKeyDown} autoFocus value={tallyTitle} onChange={(e) => setTallyTitle(e.target.value)} mb="15px" placeholder={"Good Days"}></Input>
						<Button onClick={() => handleAddTally(tallyTitle)} variant="outline" colorScheme="green" mb="15px">Add</Button>
						<Button variant="outline" colorScheme="red" onClick={() => handleCancelAddTally()}>Cancel</Button>
					</Box>
				) : (
					props.isRemovingTally ? (
						<Button variant="outline" colorScheme="red" onClick={handleCancelRemoveTally}>Cancel</Button>
					) : (
						<Box d="flex" flexDir="column" alignItems="center">
							<Button mb="20px" colorScheme="purple" onClick={() => setIsAddingTally(true)}>Add Tally</Button>
							<Button onClick={handleRemoveTally}>Remove Tally</Button>
						</Box >
					)
				)
			}
		</Box >
	)
}

function Tallies() {

	// Local storage for tallies
	// On mount: Load value for local storage for "tallies"
	// If null, set to []
	// Otherwise, set state value for tallies to loaded value

	const colors = [
		"orange",
		"cyan",
		"red",
		"green",
		"yellow",
		"blue",
		"purple",
		"teal",
		"pink",
	]

	function getTalliesFromLocalStorage(): Tallies {
		let result = localStorage.getItem("tallies");
		// Might be null
		if (!result) {
			localStorage.setItem("tallies", JSON.stringify([]));
			return [];
		}
		return JSON.parse(result);
	}

	const [tallies, setTallies] = useState(getTalliesFromLocalStorage() as Tallies);

	// Use effect for local storage updates
	useEffect(() => {
		localStorage.setItem("tallies", JSON.stringify(tallies));
	}, [tallies])

	function getNextColor() {
		if (tallies.length == 0) return colors[0];
		let lastColor = tallies[tallies.length - 1].color;
		let indexOfLastColor = colors.findIndex((color) => color == lastColor);
		let nextIndex = (indexOfLastColor + 1) % colors.length;
		return colors[nextIndex];
	}

	function getCopyOfTallies(): Tallies {
		return JSON.parse(JSON.stringify(tallies));
	}

	function onAddTally(title: string) {
		let copy = getCopyOfTallies();
		let newTally: Tally = {
			title: title,
			color: getNextColor(),
			count: 0,
			timestamp: Date.now(),
		}
		copy.push(newTally);
		setTallies(copy);
		console.log(copy);
	}

	const [isRemovingTally, setIsRemovingTally] = useState(false);

	function onRemovingTally(x: boolean) {
		setIsRemovingTally(x);
	}

	function getIndexFromTimestamp(timestamp: number) {
		for (let i = 0; i < tallies.length; i++) {
			if (tallies[i].timestamp == timestamp) {
				return i;
			}
		}
		return -1;
	}

	function onRemoveTally(timestamp: number) {
		let copy = getCopyOfTallies();
		let i = getIndexFromTimestamp(timestamp);
		// remove it
		copy.splice(i, 1);
		setTallies(copy);
		setIsRemovingTally(false);
	}

	function onAddOne(timestamp: number) {
		let copy = getCopyOfTallies();
		let i = getIndexFromTimestamp(timestamp);
		copy[i].count += 1;
		setTallies(copy);
	}

	return (
		<Box mt={tallies.length == 0 ? "80px" : "50px"} mb="50px" width="700px" d="flex" flexFlow="column nowrap" alignItems="center">
			<Box width="100%" d="flex" flexFlow="row wrap" justifyContent="space-between">
				{
					tallies.map((item) => {
						return (
							<TallyContainer onAddOne={timestamp => { onAddOne(timestamp) }} onRemoveTally={timestamp => { onRemoveTally(timestamp) }} isRemovingTally={isRemovingTally} tally={item} key={item.timestamp}></TallyContainer>
						)
					})
				}
			</Box>
			<AddTalliesArea isRemovingTally={isRemovingTally} onRemovingTally={x => { onRemovingTally(x) }} onAddTally={title => onAddTally(title)}></AddTalliesArea>
		</Box>
	)
}

export default Tallies;

