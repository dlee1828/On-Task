import { Box } from '@chakra-ui/react';
import React, { useState } from 'react';
import SetNewTask from './SetNewTask';
import TaskEnded from './TaskEnded';
import TaskOngoing from './TaskOngoing';
import * as utils from "./Utils";

interface Props {

}

type mode = "newTask" | "taskOngoing" | "taskEnded";

function CurrentTask(props: Props) {

	const [currentMode, setCurrentMode] = useState("newTask" as mode);
	const [taskStartingTime, setTaskStartingTime] = useState({ hours: 0, minutes: 0 });
	const [currentTask, setCurrentTask] = useState("");
	const [timeDeadline, setTimeDeadline] = useState({ hours: 0, minutes: 0 });

	function setNewTask(task: string, timeDeadline: utils.time, startingTime: utils.time) {
		setCurrentTask(task);
		setTimeDeadline(timeDeadline);
		setTaskStartingTime(startingTime);
		setCurrentMode("taskOngoing");
	}

	function taskEnded(): void {
		setCurrentTask("");
		setCurrentMode("newTask");
	}

	function resetWithMoreTime(minutes: number): void {
		setTaskStartingTime(utils.getCurrentTime());
		setTimeDeadline(utils.addTimes(taskStartingTime, { hours: 0, minutes: minutes }));
	}

	function componentSwitch() {
		switch (currentMode) {
			case "newTask":
				return (
					<SetNewTask onNewTask={setNewTask}></SetNewTask>
				)
			case "taskOngoing":
				return (
					<TaskOngoing onResetWithMoreTime={resetWithMoreTime} startingTime={taskStartingTime} onLeaveTask={taskEnded} currentTask={currentTask} timeDeadline={timeDeadline}></TaskOngoing>
				)
			case "taskEnded":
				return (
					<TaskEnded></TaskEnded>
				)
			default:
				return (
					<div>Nothing rendered</div>
				)
		}
	}

	return (
		<Box>
			{componentSwitch()}
		</Box>
	)
}

export default CurrentTask;
