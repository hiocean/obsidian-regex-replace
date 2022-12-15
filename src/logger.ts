// logThreshold: 0 ... only error messages
//               9 ... verbose output
const logThreshold = 9;
export const logger = (logString: string, logLevel = 0): void => {
	if (logLevel <= logThreshold)
		console.log('Regex Replace: ' + logString);
};
