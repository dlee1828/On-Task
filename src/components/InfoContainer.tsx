import React, { useEffect, useState } from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import * as utils from './Utils';

interface Props {

}

function InfoContainer(props: Props) {

	function getTotalWorkTime(): utils.time {
		let item = localStorage.getItem("completedTasks");
		let totalTime = utils.timeZero;

		if (item == null) return totalTime;

		let completedTasks = JSON.parse(item);
		for (let i = 0; i < completedTasks.length; i++) {
			totalTime = utils.addTimesAbsolute(totalTime, completedTasks[i].duration);
		}

		return totalTime;
	}


	return (
		<Box mt="50px" py="20px" px="30px" d="flex" flexDir="column" alignItems="center" borderWidth="2px" borderRadius="30px">
			<Text mb="10px">
				On Task For:
			</Text>
			<Text py="5px" px="10px" borderRadius="10px" color="black" bgColor="green.300">
				{utils.formatTimeLeft(getTotalWorkTime())}
			</Text>
		</Box>
	)
}

export default InfoContainer;
