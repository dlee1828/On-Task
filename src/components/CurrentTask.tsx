import { Box } from '@chakra-ui/react';
import React, { useState } from 'react';
import SetNewTask from './SetNewTask';
import * as utils from "./Utils";

interface Props {

}

function CurrentTask(props: Props) {

	const [currentTask, setCurrentTask] = useState("");
	const [timeDeadline, setTimeDeadline] = useState(null);

	return (
		<Box>
			<SetNewTask></SetNewTask>
		</Box>
	)
}

export default CurrentTask;
