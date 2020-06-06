import "styled-components/native"

declare module "styled-components" {
	export interface DefaultTheme {
		primaryColor: string
		secondaryColor: string
		textColorOnPrimary: string
	}
}
