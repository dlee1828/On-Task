import React, { useEffect, useRef, useState } from 'react';
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogOverlay, Box, Button, ButtonGroup, Checkbox, Icon, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure, useTabList } from '@chakra-ui/react';
import { isNextDay } from './Utils';
import { DeleteIcon, EditIcon, InfoIcon } from '@chakra-ui/icons';
import { AiFillPushpin } from 'react-icons/ai';
import './Checklist.css';

interface Props {

}

type Item = {
	description: string,
	timestamp: number,
	isDone: boolean,
	isPinned: boolean,
	lastDone: number,
}

const colors = [
	"red",
	"blue",
	"yellow",
	"orange",
	"teal",
	"pink",
	"purple",
	"green",
	"cyan",
]

function randomColor(): string {
	const len = colors.length;
	let i = Math.floor(Math.random() * len);
	return colors[i];
}

function ListItem(props: { item: Item, onDeleteItem(timestamp: number): void, onEditItem(timestamp: number, newItem: Item): void }) {

	// Necessary information: Description, timestamp, and whether is pinned
	const [item, setItem] = useState(props.item);

	const [doneColor, setDoneBorderColor] = useState("auto");
	useEffect(() => {
		setDoneBorderColor(randomColor() + ".300");
	}, [])

	// Function for copying item
	function itemCopy() {
		return JSON.parse(JSON.stringify(item)) as Item;
	}

	// Useeffect to send new item to parent every time item changes
	useEffect(() => {
		props.onEditItem(item.timestamp, item);
	}, [item])

	// Edit habit:
	const [editAlertIsOpen, setEditAlertIsOpen] = useState(false);
	const cancelRef = useRef();
	const [newItemName, setNewItemName] = useState(item.description);

	function cancelEditItemDescription() {
		setEditAlertIsOpen(false);
		setNewItemName(item.description);
	}

	function changeItemDescription(newDescription: string) {
		// Change item description 
		let copy = itemCopy();
		copy.description = newDescription;
		setItem(copy);
		setEditAlertIsOpen(false);
	}

	function setIsDone(isDone: boolean) {
		let copy = itemCopy();
		copy.isDone = isDone;
		copy.lastDone = Date.now();
		setItem(copy);
	}

	function setIsPinned(isPinned: boolean) {
		let copy = itemCopy();
		copy.isPinned = isPinned;
		setItem(copy);
	}

	return (
		<Box h="60px" w="100%" d="flex" mb="30px" flexFlow="row nowrap">
			<Box className="itemBox" onClick={() => setIsDone(!item.isDone)} borderWidth="2px" borderRadius="25px" borderColor={item.isDone ? doneColor : "auto"} w="450px" h="100%" d="flex" flexDir="column" justifyContent="center" borderRightWidth="2px">
				<Text mx="15px" fontSize="xl" noOfLines={1}>{item.description}</Text>
			</Box>
			<Box w="100px" d="flex" justifyContent="center" alignItems="center">
				<Checkbox colorScheme={doneColor.slice(0, doneColor.length - 4)} isChecked={item.isDone} onChange={() => setIsDone(!item.isDone)} size="lg"></Checkbox>
			</Box>
			<Box d="flex" justifyContent="space-around" alignItems="center" w="100px" h="100%">
				<ButtonGroup isAttached>
					<IconButton variant="ghost" aria-label="pin" colorScheme={item.isPinned ? "green" : "gray"} onClick={() => setIsPinned(!item.isPinned)} icon={<Icon as={AiFillPushpin}></Icon>}></IconButton>
					<IconButton variant="ghost" aria-label="edit" onClick={() => setEditAlertIsOpen(true)} icon={<EditIcon></EditIcon>}></IconButton>
					<IconButton variant="ghost" aria-label="delete" onClick={() => props.onDeleteItem(item.timestamp)} icon={<DeleteIcon></DeleteIcon>}></IconButton>
				</ButtonGroup>
			</Box>

			<AlertDialog isOpen={editAlertIsOpen} leastDestructiveRef={cancelRef as any} onClose={() => setEditAlertIsOpen(false)}>
				<AlertDialogOverlay>
					<AlertDialogContent w="300px">
						<AlertDialogBody p="30px" d="flex" flexDir="column" alignItems="center" >
							<Text>
								Change description:
							</Text>
							<Input value={newItemName} onChange={(e) => setNewItemName(e.target.value)} mt="15px"></Input>
							<Box mt="15px">
								<Button ref={cancelRef as any} onClick={cancelEditItemDescription} mx="15px">Cancel</Button>
								<Button colorScheme="purple" onClick={() => changeItemDescription(newItemName)}>Confirm</Button>
							</Box>
						</AlertDialogBody>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>
		</Box >

	)
}

function List(props: { items: Item[], onDeleteItem(timestamp: number): void, onEditItem(timestamp: number, newItem: Item): void }) {
	return (
		<Box d="flex" w="650px" flexFlow="column nowrap" alignItems="center">
			{
				props.items.map((item, index) => {
					return (
						<ListItem onDeleteItem={props.onDeleteItem} onEditItem={props.onEditItem} item={item} key={item.timestamp}></ListItem>
					)
				})
			}
		</Box>
	)
}

function AddItemArea(props: { onAddItem(description: string): void }) {

	const [addingItem, setAddingItem] = useState(false);
	const [textInput, setTextInput] = useState("");

	function handleKeyDown(e: any) {
		if (e.key == "Enter") {
			handleAddItem();
		}
	}

	function handleAddItemClicked() {
		setAddingItem(true);
	}

	useEffect(() => {
		if (addingItem) {
			document.getElementById("itemInput")!.focus();
		}
	}, [addingItem])

	function handleCancelInput() {
		setTextInput("");
		setAddingItem(false);
	}

	function handleAddItem(): void {
		props.onAddItem(textInput);
		handleCancelInput();
	}

	function displayComponents() {
		if (addingItem) {
			return (
				<Box d="flex" flexDir="column" alignItems="center">
					<Input onKeyDown={handleKeyDown} id="itemInput" placeholder="Finish physics homework" w="300px" type="text" value={textInput} onChange={(e) => setTextInput(e.target.value)}></Input>
					<Box mt="16px" d="flex" justifyContent="center">
						<Button mr="8px" onClick={() => handleAddItem()} variant="outline" colorScheme="green">Confirm</Button>
						<Button ml="8px" onClick={handleCancelInput} variant="outline" colorScheme="red">Cancel</Button>
					</Box>
				</Box>
			)
		}
		else {
			return <Button variant="outline" onClick={handleAddItemClicked} colorScheme="pink">Add Item</Button>
		}
	}

	return (
		<Box mt="20px" d="flex" flexDir="column" alignItems="center">
			{
				displayComponents()
			}
		</Box>
	)
}


function Checklist(props: Props) {

	// checklistItems is stored in localstorage

	const [checklistItems, setChecklistItems] = useState(localStorage.getItem("checklistItems") == null ? [] : JSON.parse(localStorage.getItem("checklistItems")!) as Item[]);

	// Store in localstorage whenever checklistItems changes
	useEffect(() => {
		localStorage.setItem("checklistItems", JSON.stringify(checklistItems));
	}, [checklistItems])

	// On mount, delete or reset necessary items
	// For every item 1+ days old, 
	// Delete if is not pinned
	// Reset if is pinned
	useEffect(() => {
		let temp = checklistItems.slice();
		let curr;
		let newList = [];
		for (let i = 0; i < temp.length; i++) {
			curr = temp[i];
			if (curr.isDone && isNextDay(curr.lastDone)) {
				if (curr.isPinned) {
					curr.isDone = false;
				}
				else {
					// Don't add to newList
					continue;
				}
			}
			newList.push(curr);
		}
		setChecklistItems(newList);
	}, [])



	// Item editing functions

	function getItemIndex(timestamp: number) {
		for (let i = 0; i < checklistItems.length; i++) {
			if (checklistItems[i].timestamp == timestamp) return i;
		}
		return -1;
	}

	function addItem(description: string) {
		let newItem: Item = {
			description: description,
			isDone: false,
			timestamp: Date.now(),
			isPinned: false,
			lastDone: -1,
		}
		let temp = checklistItems.slice();
		temp.push(newItem);
		setChecklistItems(temp);
	}

	function deleteItem(timestamp: number) {
		let ind = getItemIndex(timestamp);
		let temp = checklistItems.slice();
		temp.splice(ind, 1);
		setChecklistItems(temp);
	}

	function editItem(timestamp: number, newItem: Item) {
		let ind = getItemIndex(timestamp);
		let temp = checklistItems.slice();
		temp[ind] = newItem;
		setChecklistItems(temp);
	}

	// Modal dialog
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<Box mt="50px" d="flex" flexFlow="column nowrap" alignItems="center">
			<List items={checklistItems} onEditItem={editItem} onDeleteItem={deleteItem}></List>
			<AddItemArea onAddItem={(description) => addItem(description)}></AddItemArea>
			<IconButton onClick={() => onOpen()} mt="15px" variant="ghost" aria-label="info" icon={<InfoIcon></InfoIcon>}></IconButton>
			<Modal isOpen={isOpen} size="lg" onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Checklist</ModalHeader>
					<ModalCloseButton />
					<ModalBody >
						Items will remain on the checklist until they are marked done.
						<br></br>
						<br></br>
						Once marked done, unpinned items will disappear the next day.
						<br></br>
						<br></br>
						Pinned items won't disappear but will be reset to unchecked.

					</ModalBody>

					<ModalFooter>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	)
}

export default Checklist;
