import { Box } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import SetNewTask from './SetNewTask';
import TaskOngoing from './TaskOngoing';
import * as utils from "./Utils";

interface Props {
	endWorkSession(): void;
}

type localStorageName = "currentMode" | "currentTask" | "taskStartingTime" | "timeDeadline"

function CurrentTask(props: Props) {

	// Storing task variables in localStorage
	function updateLocalStorage() {
		localStorage.setItem("currentMode", currentMode);
		localStorage.setItem("currentTask", currentTask);
		localStorage.setItem("taskStartingTime", JSON.stringify(taskStartingTime));
		localStorage.setItem("timeDeadline", JSON.stringify(timeDeadline));
	}

	// Gets task variables from local storage
	function getLocalStorageOrDefault(name: localStorageName) {
		let candidate = localStorage.getItem(name);
		if (candidate == null) {
			switch (name) {
				case "currentMode": return "newTask";
				case "currentTask": return "";
				case "taskStartingTime": return utils.timeZero;
				case "timeDeadline": return utils.timeZero;
			}
		}
		else {
			switch (name) {
				case "currentMode": return candidate;
				case "currentTask": return candidate;
				case "taskStartingTime": return JSON.parse(candidate);
				case "timeDeadline": return JSON.parse(candidate);
			}
		}
	}

	// State variables
	const [currentMode, setCurrentMode] = useState(getLocalStorageOrDefault("currentMode"));
	// Task name, starting time, deadline
	const [currentTask, setCurrentTask] = useState(getLocalStorageOrDefault("currentTask"));
	const [taskStartingTime, setTaskStartingTime] = useState(getLocalStorageOrDefault("taskStartingTime"));
	const [timeDeadline, setTimeDeadline] = useState(getLocalStorageOrDefault("timeDeadline"));

	// Update local storage on every component update
	useEffect(() => {
		document.title = "Work";
		updateLocalStorage();
	})

	// Called when new task is confirmed from SetNewTask component
	function setNewTask(task: string, timeDeadline: utils.time, startingTime: utils.time) {
		// Set state variables + new mode
		setCurrentTask(task);
		setTimeDeadline(timeDeadline);
		setTaskStartingTime(startingTime);
		setCurrentMode("taskOngoing");
	}

	// Storing completion of task in local storage
	function addNewCompletedTask() {
		// completedTasks is a list of completed task objects
		let item = localStorage.getItem("completedTasks")
		let completedTasks = JSON.parse(item == null ? "[]" : item);
		let endingTime = utils.minTime(utils.getCurrentTime(), timeDeadline);
		let duration = utils.subtractTime(endingTime, taskStartingTime)
		completedTasks.push(
			{
				taskName: currentTask,
				startingTime: taskStartingTime,
				endingTime: endingTime,
				duration: duration,
			}
		)
		localStorage.setItem("completedTasks", JSON.stringify(completedTasks));
	}

	// Called when task has ended, handles local storage of completed tasks
	function taskEnded(completed: boolean): void {

		if (completed) {
			addNewCompletedTask();
		}

		setCurrentTask("");
		setCurrentMode("newTask");
		setTaskStartingTime(utils.timeZero);
		setTimeDeadline(utils.timeZero);
	}

	// Called when user requests more time for current task
	function resetWithMoreTime(newStartingTime: utils.time, newTimeDeadline: utils.time): void {
		addNewCompletedTask();
		setTaskStartingTime(newStartingTime);
		setTimeDeadline(newTimeDeadline);
	}


	function componentSwitch() {
		switch (currentMode) {
			case "newTask":
				return (
					<SetNewTask endWorkSession={props.endWorkSession} onNewTask={setNewTask}></SetNewTask>
				)
			case "taskOngoing":
				return (
					<TaskOngoing onResetWithMoreTime={resetWithMoreTime} startingTime={taskStartingTime} onLeaveTask={taskEnded} currentTask={currentTask} timeDeadline={timeDeadline}></TaskOngoing>
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
