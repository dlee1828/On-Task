import React from 'react';
import { Box, Button } from '@chakra-ui/react';
import { pages, pageColors, pageType } from './pages';

interface Props {
	onSetPage(page: pageType): void;
}

function Home(props: Props) {

	return (
		<Box w="100vw" d="flex" flexDir="column" alignItems="center" mt="75px">
			{
				pages.map((item, index) => {
					return (
						<Button mb="20px" w="100px" d={item == "home" ? "none" : "block"} onClick={() => props.onSetPage(item)} colorScheme={pageColors[index]} key={index}>{item}</Button>
					)
				})
			}
		</Box>
	)
}

export default Home;
