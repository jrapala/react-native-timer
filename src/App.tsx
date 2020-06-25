import React, { useEffect, useState } from "react"
import {
	Alert,
	Dimensions,
	SafeAreaView,
	StatusBar,
	Text,
	TouchableOpacity,
} from "react-native"
import styled, { ThemeProvider } from "styled-components/native"

import { iOSDarkTheme } from "./styles"
import Picker from "./components/Picker"
import { convertToSeconds, getRemaining } from "./utils/timerHelpers"
import useInterval from "./hooks/useInterval"
import normalize from "./utils/normalize"

interface TimerButtonProps {
	isRunning: boolean
}

const { width } = Dimensions.get("window")

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
				<TimerButton isRunning={isRunning} onPress={toggleTimer}>
					<TimerButtonText isRunning={isRunning}>
						{isRunning ? "Stop" : "Start"}
					</TimerButtonText>
				</TimerButton>
				{showTimer && (
					<ResetButton onPress={resetTimer}>
						<ResetButtonText>Reset</ResetButtonText>
					</ResetButton>
				)}
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

const TimerButton = styled(TouchableOpacity)<TimerButtonProps>`
	align-items: center;
	border-color: ${(props): string =>
		props.isRunning ? props.theme.accentColor : props.theme.secondaryColor};
	border-radius: ${`${width / 2}px`};
	border-width: 10px;
	height: ${`${width / 2}px`};
	justify-content: center;
	width: 50%;
`

const TimerButtonText = styled(Text)<TimerButtonProps>`
	color: ${(props): string =>
		props.isRunning ? props.theme.accentColor : props.theme.secondaryColor};
	font-size: ${normalize(38) + "px"};
`

const TimerText = styled(Text)`
	color: white;
	font-size: ${normalize(75) + "px"};
	margin-bottom: 10%;
`

const ResetButton = styled(TouchableOpacity)`
	align-items: center;
	justify-content: center;
	margin-top: 10%;
`

const ResetButtonText = styled(Text)`
	color: ${(props): string => props.theme.dimTextColorOnPrimary};
	font-size: ${normalize(22) + "px"};
`

export default App
