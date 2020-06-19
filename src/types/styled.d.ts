import "styled-components/native"

declare module "styled-components" {
	export interface DefaultTheme {
		accentColor: string
		primaryColor: string
		secondaryColor: string
		textColorOnPrimary: string
	}
}
