import React, { useEffect, useState } from "react"
import {
	Dimensions,
	SafeAreaView,
	StatusBar,
	Text,
	TouchableOpacity,
} from "react-native"
import styled, { ThemeProvider } from "styled-components/native"

import { iOSDarkTheme } from "./styles"
import { getRemaining } from "./utils/timerHelpers"
import useInterval from "./hooks/useInterval"

interface TimerButtonProps {
	isRunning: boolean
}

const { width } = Dimensions.get("window")

const App: React.FC = () => {
	const [theme] = useState(iOSDarkTheme)
	const [isRunning, setIsRunning] = useState(false)
	const [remainingSeconds, setRemainingSeconds] = useState(5)

	const { minutes, seconds } = getRemaining(remainingSeconds)

	useInterval(
		() => {
			setRemainingSeconds(currentSeconds => currentSeconds - 1)
		},
		isRunning ? 1000 : null
	)

	useEffect(() => {
		if (remainingSeconds === 0) {
			resetTimer()
		}
	}, [remainingSeconds])

	const toggleTimer = (): void => {
		setIsRunning(currentState => !currentState)
	}

	const resetTimer = (): void => {
		setIsRunning(false)
		setRemainingSeconds(5)
	}

	return (
		<ThemeProvider theme={theme}>
			<StatusBar barStyle="light-content" />
			<StyledSafeAreaView>
				<TimerText>{`${minutes}:${seconds}`}</TimerText>
				<TimerButton isRunning={isRunning} onPress={toggleTimer}>
					<TimerButtonText isRunning={isRunning}>
						{isRunning ? "Stop" : "Start"}
					</TimerButtonText>
				</TimerButton>
				<ResetButton onPress={resetTimer}>
					<ResetButtonText>Reset</ResetButtonText>
				</ResetButton>
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
	margin-top: 30px;
	width: 50%;
`

const TimerButtonText = styled(Text)<TimerButtonProps>`
	color: ${(props): string =>
		props.isRunning ? props.theme.accentColor : props.theme.secondaryColor};
	font-size: 45px;
`

const TimerText = styled(Text)`
	color: white;
	font-size: 90px;
`

const ResetButton = styled(TouchableOpacity)`
	align-items: center;
	justify-content: center;
	margin-top: 30px;
`

const ResetButtonText = styled(Text)`
	color: ${(props): string => props.theme.dimTextColorOnPrimary};
	font-size: 30px;
`

export default App
