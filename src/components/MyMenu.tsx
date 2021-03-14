import React, { useEffect, useRef } from 'react';
import { Box, Button, Collapse, IconButton, useDisclosure } from '@chakra-ui/react';
import { CloseIcon, HamburgerIcon, SmallCloseIcon } from '@chakra-ui/icons';
import userEvent from '@testing-library/user-event';
import { pages, pageType, pageColors } from './pages';

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

	function displayCorrectIcon() {
		if (isOpen) {
			return <SmallCloseIcon></SmallCloseIcon>
		}
		else return <HamburgerIcon></HamburgerIcon>
	}

	function handleButtonClick(page: pageType) {
		props.onSetPage(page);
		if (isOpen) {
			onToggle();
		}
	}

	return (
		<Box w="170px" mt="30px" h="auto">
			<IconButton ref={iconNodeRef} ml="30px" onClick={onToggle} aria-label="Menu" icon={displayCorrectIcon()}></IconButton>
			<Collapse in={isOpen} animateOpacity>
				<Box ref={buttonNodeRef} d="flex" flexDir="column" px="30px" pb="25px" w="100%">
					{
						pages.map((item, index) => {
							return (
								<Button colorScheme={pageColors[index]} on mt="15px" w="100px" onClick={() => handleButtonClick(item)} key={index}>{item}</Button>
							)
						})
					}
				</Box>
			</Collapse>
		</Box>
	)
}

export default MyMenu;
