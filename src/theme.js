import { createTheme } from "@mui/material/styles";

const rippleEffectSpeed = "0.3s";
const reppleEffectEasing = "cubic-bezier(0, 0.75, 0.5, 1)";

const baseTheme = createTheme({
	palette: {
		mode: "light",
		primary: {
			light: "#757ce8",
			main: "#3f50b5",
			dark: "#002884",
			contrastText: "#fff",
		},
		secondary: {
			light: "#ff7961",
			main: "#f44336",
			dark: "#ba000d",
			contrastText: "#000",
		},
		error: { main: "#f44336" },
		warning: { main: "#ffa726" },
		info: { main: "#29b6f6" },
		success: { main: "#66bb6a" },
		background: {
			default: "#f5f5f5",
			paper: "#ffffff",
		},
		text: {
			primary: "#333333",
			secondary: "#666666",
		},
	},
	typography: {
		fontFamily:
			'"Pretendard", "Noto Sans KR", "Roboto", "Arial", sans-serif',
		fontSize: 14,
	},
	breakpoints: {
		values: {
			xs: 0,
			sm: 768,
			md: 1280,
			lg: 1600,
			xl: 1920,
		},
	},
});

const theme = createTheme(baseTheme, {
	components: {
		MuiButtonBase: {
			styleOverrides: {
				root: {
					// transition: `transform 0.1s ease !important`,
					"&:active": {
						// transition: `transform 0.1s ease`,
						// transform: "translateZ(0) scale(0.95)",
					},
					"& .MuiTouchRipple-root": {
						opacity: 0.8,
					},
					"& .MuiTouchRipple-root .MuiTouchRipple-ripple": {
						animationDuration: rippleEffectSpeed,
						animationTimingFunction: reppleEffectEasing,
					},
				},
			},
		},
		MuiButton: {
			styleOverrides: {
				root: {
					boxShadow: "none",
					"&:hover": { boxShadow: "none" },
					"&:active": { boxShadow: "none" },
					"&.Mui-focusVisible": { boxShadow: "none" },
                    "&.MuiButton--circle": {
						borderRadius: "200px",
					},
				},
				containedPrimary: ({ theme }) => ({
					[theme.breakpoints.down("md")]: {
						"&:hover": {
							backgroundColor: theme.palette.primary.main,
						},
					},
				}),
				containedSecondary: ({ theme }) => ({
					[theme.breakpoints.down("md")]: {
						"&:hover": {
							backgroundColor: theme.palette.secondary.main,
						},
					},
				}),
				text: ({ theme }) => ({
					[theme.breakpoints.down("md")]: {
						"&:hover": {
							backgroundColor: "transparent",
						},
					},
				}),
				outlined: ({ theme }) => ({
					[theme.breakpoints.down("md")]: {
						"&:hover": {
							backgroundColor: "transparent",
						},
					},
				}),
				sizeSmall: {
					height: "32px",
					minHeight: "32px",
					padding: "0 12px",
					fontSize: "12px",
					borderRadius: "8px",
				},
				sizeMedium: {
					height: "44px",
					minHeight: "44px",
					padding: "0 16px",
					fontSize: "14px",
					borderRadius: "12px",
				},
				sizeLarge: {
					height: "56px",
					minHeight: "56px",
					padding: "0 20px",
					fontSize: "16px",
					borderRadius: "16px",
				},
			},
		},
		MuiIconButton: {
			styleOverrides: {
				root: ({ theme }) => ({
					[theme.breakpoints.down("md")]: {
						"&:hover": {
							backgroundColor: "transparent",
						},
					},
				}),
				sizeSmall: {
					fontSize: "20px",
					width: "32px",
					height: "32px",
				},
				sizeMedium: {
					fontSize: "24px",
					width: "44px",
					height: "44px",
				},
				sizeLarge: {
					fontSize: "28px",
					width: "56px",
					height: "56px",
				},
			},
		},
		MuiSvgIcon: {
			styleOverrides: {
				fontSizeSmall: {
					fontSize: "20px",
				},
				fontSizeMedium: {
					fontSize: "24px",
				},
				fontSizeLarge: {
					fontSize: "28px",
				},
			},
		},
		MuiCheckbox: {
			styleOverrides: {
				root: {
					"& .MuiTouchRipple-root .MuiTouchRipple-ripple": {
						animationDuration: rippleEffectSpeed,
						animationTimingFunction: reppleEffectEasing,
					},
				},
			},
		},
		MuiRadio: {
			styleOverrides: {
				root: {
					"& .MuiTouchRipple-root .MuiTouchRipple-ripple": {
						animationDuration: rippleEffectSpeed,
						animationTimingFunction: reppleEffectEasing,
					},
				},
			},
		},
		MuiSwitch: {
			styleOverrides: {
				root: {
					"& .MuiTouchRipple-root .MuiTouchRipple-ripple": {
						animationDuration: rippleEffectSpeed,
						animationTimingFunction: reppleEffectEasing,
					},
				},
			},
		},
	},
});

export default theme;
