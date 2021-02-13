import { extendTheme } from "@chakra-ui/react"

const config = {
	initialColorMode: "dark",
	useSystemColorMode: false,
} as any;

const theme = extendTheme({ config })

export default theme