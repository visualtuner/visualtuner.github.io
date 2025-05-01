import { createTheme } from "@mui/material/styles";

const rippleEffectSpeed = "0.2s";

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
});

theme.components = {
    MuiButtonBase: {
        styleOverrides: {
            root: {
                "& .MuiTouchRipple-root .MuiTouchRipple-ripple": {
                    animationDuration: rippleEffectSpeed,
                },
                "&:hover": {
                    // backgroundColor: "var(--variant-containedBg)",
                },
            },
            // containedPrimary: {
            //     "&:hover": {
            //         backgroundColor: theme.palette.primary.main,
            //     },
            // },
            // containedSecondary: {
            //     "&:hover": {
            //         backgroundColor: theme.palette.secondary.main,
            //     },
            // },
        },
    },
    MuiButton: {
        styleOverrides: {
            root: {
                boxShadow: "none", // ✅ 기본 그림자 제거
                "&:hover": {
                    boxShadow: "none", // ✅ hover 시 생기는 그림자도 제거
                },
                "&:active": {
                    boxShadow: "none", // ✅ active 시 생기는 그림자도 제거
                },
                "&.Mui-focusVisible": {
                    boxShadow: "none", // ✅ focus 시 생기는 그림자 제거 (keyboard focus 등)
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
