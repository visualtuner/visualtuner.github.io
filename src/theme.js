import { createTheme } from "@mui/material/styles";

const rippleEffectSpeed = "0.3s";

const theme = createTheme({
	palette: {
		mode: "light", // 또는 'dark'
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
		error: {
			main: "#f44336",
		},
		warning: {
			main: "#ffa726",
		},
		info: {
			main: "#29b6f6",
		},
		success: {
			main: "#66bb6a",
		},
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
		fontSize: 14, // 기본 폰트 크기 (1rem = 14px)
	},
	breakpoints: {
		values: {
			xs: 0, // mobile
			sm: 768, // tablet
			md: 1280, // desktop
			lg: 1600, // large desktop
			xl: 1920,
		},
	},
});

theme.components = {
    MuiButtonBase: {
        styleOverrides: {
            root: {
                "& .MuiTouchRipple-root": {
                    opacity: 0.8,
                },
                "& .MuiTouchRipple-root .MuiTouchRipple-ripple": {
                    animationDuration: rippleEffectSpeed,
                },
            },
        },
    },
    MuiButton: {
        styleOverrides: {
            root: {
                boxShadow: "none", // 기본 그림자 제거
                "&:hover": {
                    boxShadow: "none", // hover 시 생기는 그림자도 제거
                },
                "&:active": {
                    boxShadow: "none", // active 시 생기는 그림자도 제거
                },
                "&.Mui-focusVisible": {
                    boxShadow: "none", // focus 시 생기는 그림자 제거 (keyboard focus 등)
                },
            },
            containedPrimary: {
                "&:hover": {
                    backgroundColor: theme.palette.primary.main,
                },
            },
            containedSecondary: {
                "&:hover": {
                    backgroundColor: theme.palette.secondary.main,
                },
            },
            sizeSmall: {
                height: "32px",
                minHeight: "32px",
                padding: "0 12px",
                fontSize: "12px",
            },
            sizeMedium: {
                height: "44px",
                minHeight: "44px",
                padding: "0 16px",
                fontSize: "14px",
            },
            sizeLarge: {
                height: "56px",
                minHeight: "56px",
                padding: "0 20px",
                fontSize: "16px",
            },
        },
    },
    MuiIconButton: {
        styleOverrides: {
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

    MuiCheckbox: {
        styleOverrides: {
            root: {
                "& .MuiTouchRipple-root .MuiTouchRipple-ripple": {
                    animationDuration: rippleEffectSpeed,
                },
            },
        },
    },
    MuiRadio: {
        styleOverrides: {
            root: {
                "& .MuiTouchRipple-root .MuiTouchRipple-ripple": {
                    animationDuration: rippleEffectSpeed,
                },
            },
        },
    },
    MuiSwitch: {
        styleOverrides: {
            root: {
                "& .MuiTouchRipple-root .MuiTouchRipple-ripple": {
                    animationDuration: rippleEffectSpeed,
                },
            },
        },
    },
};

export default theme;
