interface Time {
	minutes: string
	seconds: string
}

const formatNumber = (number: number): string => `0${number}`.slice(-2)

export const getRemaining = (time: number): Time => {
	const minutes = Math.floor(time / 60)
	const seconds = time - minutes * 60
	return { minutes: formatNumber(minutes), seconds: formatNumber(seconds) }
}
