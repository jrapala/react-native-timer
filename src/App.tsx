import React, { useEffect, useState } from "react"
import { Alert, SafeAreaView, StatusBar, Text } from "react-native"
import styled, { ThemeProvider } from "styled-components/native"

import { iOSDarkTheme } from "./styles"
import Picker from "./components/Picker"
import TimerButton from "./components/TimerButton"
import ResetButton from "./components/ResetButton"
import { convertToSeconds, getRemaining } from "./utils/timerHelpers"
import useInterval from "./hooks/useInterval"
import normalize from "./utils/normalize"

interface TimerButtonProps {
	isRunning: boolean
}

const App: React.FC = () => {
	const [theme] = useState(iOSDarkTheme)
	const [isRunning, setIsRunning] = useState(false)
	const [showTimer, setShowTimer] = useState(false)
	const [remainingSeconds, setRemainingSeconds] = useState(60)
	const [selectedMinutes, setSelectedMinutes] = useState<string>("1")
	const [selectedSeconds, setSelectedSeconds] = useState<string>("0")

	const { minutes, seconds } = getRemaining(remainingSeconds)

	useInterval(
		() => {
			setRemainingSeconds(currentSeconds => currentSeconds - 1)
		},
		isRunning ? 1000 : null
	)

	useEffect(() => {
		if (remainingSeconds === 0) {
			setIsRunning(false)
			Alert.alert("Time's Up!")
		}
	}, [remainingSeconds])

	const toggleTimer = (): void => {
		if (!showTimer) {
			setShowTimer(true)
			setRemainingSeconds(
				convertToSeconds(selectedMinutes, selectedSeconds)
			)
			setIsRunning(true)
		} else if (remainingSeconds > 0) {
			setIsRunning(currentState => !currentState)
		}
	}

	const resetTimer = (): void => {
		setShowTimer(false)
		setIsRunning(false)
	}

	return (
		<ThemeProvider theme={theme}>
			<StatusBar barStyle="light-content" />
			<StyledSafeAreaView>
				{showTimer ? (
					<TimerText>{`${minutes}:${seconds}`}</TimerText>
				) : (
					<Picker
						selectedMinutes={selectedMinutes}
						selectedSeconds={selectedSeconds}
						setSelectedMinutes={setSelectedMinutes}
						setSelectedSeconds={setSelectedSeconds}
					/>
				)}
				<TimerButton isRunning={isRunning} onPress={toggleTimer} />
				{showTimer && <ResetButton onPress={resetTimer} />}
			</StyledSafeAreaView>
		</ThemeProvider>
	)
}

const StyledSafeAreaView = styled(SafeAreaView)`
	align-items: center;
	background-color: ${(props): string => props.theme.primaryColor};
	flex: 1;
	justify-content: center;
`

const TimerText = styled(Text)`
	color: white;
	font-size: ${normalize(75) + "px"};
	margin-bottom: 10%;
`
export default App
