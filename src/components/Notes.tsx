import React, { useEffect, useState } from 'react';
import { Box, Textarea } from '@chakra-ui/react';

interface Props {

}

function Notes(props: Props) {

	const [text, setText] = useState(localStorage.getItem("notes") == null ? "" : localStorage.getItem("notes") as string);

	useEffect(() => {
		document.getElementById("textbox")!.focus();
	}, [])

	useEffect(() => {
		localStorage.setItem("notes", text);
	}, [text])

	function handleTextEdit(e: any) {
		if (e.target.value.length <= 10000) {
			setText(e.target.value);
		}
	}

	return (
		<Box mt="100px">
			<Textarea value={text} onChange={(e) => handleTextEdit(e)} focusBorderColor="orange.300" id="textbox" w="600px" h="400px"></Textarea>
		</Box>
	)
}

export default Notes;
