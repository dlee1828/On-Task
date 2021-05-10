import React from 'react';
import { Box, Button, IconButton, List, ListItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, UnorderedList, useDisclosure } from '@chakra-ui/react';
import { pages, pageColors, pageType } from './pages';
import { InfoIcon } from '@chakra-ui/icons';

interface Props {
	onSetPage(page: pageType): void;
}

function Home(props: Props) {

	// Modal dialog
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<Box w="100vw" d="flex" flexDir="column" alignItems="center" mt="75px">
			{
				pages.map((item, index) => {
					return (
						<Button mb="20px" w="100px" d={item == "home" ? "none" : "block"} onClick={() => props.onSetPage(item)} colorScheme={pageColors[index]} key={index}>{item}</Button>
					)
				})
			}
			<IconButton aria-label="info" onClick={() => onOpen()} icon={<InfoIcon></InfoIcon>}></IconButton>
			<Modal isOpen={isOpen} size="lg" onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Shortcuts</ModalHeader>
					<ModalCloseButton />
					<ModalBody >
						You can navigate to different pages using the prefix key "\" followed by:
						<UnorderedList ml="30px">
							<ListItem>"w" for work</ListItem>
							<ListItem>"c" for checklist</ListItem>
							<ListItem>"h" for habits</ListItem>
							<ListItem>"t" for tallies</ListItem>
							<ListItem>"n" for notes</ListItem>
						</UnorderedList>
					</ModalBody>

					<ModalFooter>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	)
}

export default Home;
