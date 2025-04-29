import { createTheme } from "@mui/material/styles";

const rippleEffectTimeout = 50;
const theme = createTheme({
	palette: {
		primary: {
			main: "#1976d2", // 기본 파란색
		},
		secondary: {
			main: "#9c27b0", // 보라색
		},
	},
	typography: {
		fontFamily:
			'"Pretendard", "Noto Sans KR", "Roboto", "Arial", sans-serif',
		fontSize: 14, // 기본 폰트 크기 (1rem = 14px)
	},
	breakpoints: {
		values: {
			xs: 0,
			sm: 600,
			md: 960,
			lg: 1280,
			xl: 1920,
		},
	},
	components: {
		MuiButton: {
			defaultProps: {
				TouchRippleProps: {
					timeout: rippleEffectTimeout,
				},
			},
			styleOverrides: {
				sizeSmall: {
					height: "36px",
					minHeight: "36px",
					padding: "0 12px",
					fontSize: "13px",
				},
				sizeMedium: {
					height: "44px",
					minHeight: "44px",
					padding: "0 16px",
					fontSize: "15px",
				},
				sizeLarge: {
					height: "52px",
					minHeight: "52px",
					padding: "0 20px",
					fontSize: "17px",
				},
			},
		},
		MuiIconButton: {
            defaultProps: {
				TouchRippleProps: {
					timeout: rippleEffectTimeout,
				},
			},
			styleOverrides: {
				sizeSmall: {
					fontSize: "20px",
					width: "36px",
					height: "36px",
				},
				sizeMedium: {
					fontSize: "24px",
					width: "44px",
					height: "44px",
				},
				sizeLarge: {
					fontSize: "28px",
					width: "52px",
					height: "52px",
				},
			},
		},
		MuiSvgIcon: {
			styleOverrides: {
				fontSizeSmall: {
					fontSize: "16px",
				},
				fontSizeMedium: {
					fontSize: "24px",
				},
				fontSizeLarge: {
					fontSize: "32px",
				},
			},
		},

		MuiListItemButton: {
			defaultProps: {
				TouchRippleProps: {
					timeout: rippleEffectTimeout,
				},
			},
		},
		MuiCheckbox: {
			defaultProps: {
				TouchRippleProps: {
					timeout: rippleEffectTimeout,
				},
			},
		},
		MuiRadio: {
			defaultProps: {
				TouchRippleProps: {
					timeout: rippleEffectTimeout,
				},
			},
		},
	},
});

export default theme;
