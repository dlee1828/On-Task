import React, { useEffect, useRef } from 'react';
import { Box, Button, Collapse, IconButton, useDisclosure } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { pageType } from '../myTypes';
import userEvent from '@testing-library/user-event';

interface Props {
	onSetPage(page: pageType): void;
}

function MyMenu(props: Props) {
	// Menu control
	const { isOpen, onToggle } = useDisclosure()
	// Ref for menu
	const buttonNodeRef = useRef(null);
	const iconNodeRef = useRef(null);

	// Closing menu when user clicks outside menu 
	function handleClick(e: any) {
		if (buttonNodeRef.current != null && !(buttonNodeRef.current as any).contains(e.target) && !(iconNodeRef.current as any).contains(e.target)) {
			// Click was outside menu button
			if (isOpen) onToggle();
		}
	}

	useEffect(() => {
		if (isOpen) {
			document.addEventListener('mousedown', handleClick);
		}
		else {
			document.removeEventListener('mousedown', handleClick);
		}

		return () => {
			document.removeEventListener('mousedown', handleClick);
		}
	}, [isOpen])

	// Page names
	const pages: pageType[] = [
		"work",
		"goals",
		"habits",
	]

	return (
		<Box w="150px" mt="25px" h="auto">
			<IconButton ref={iconNodeRef} ml="25px" onClick={onToggle} aria-label="Menu" icon={<HamburgerIcon></HamburgerIcon>}></IconButton>
			<Collapse in={isOpen} animateOpacity>
				<Box ref={buttonNodeRef} d="flex" flexDir="column" px="25px" pb="25px" w="100%">
					{
						pages.map((item, index) => {
							return (
								<Button colorScheme="orange" on mt="15px" w="100px" onClick={() => props.onSetPage(item)} key={index}>{item}</Button>
							)
						})
					}
				</Box>
			</Collapse>
		</Box>
	)
}

export default MyMenu;
