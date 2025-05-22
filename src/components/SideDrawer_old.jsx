import { useRef, useState, useEffect, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import useDrawerNavigation from "../hooks/useDrawerNavigation";

export default function SideDrawer({ isOpen, onClose }) {
	const swiperRef = useRef(null);
	const backdropRef = useRef(null);
	const [opacity, setOpacity] = useState(isOpen ? 1 : 0);
	const { navigateWithClose } = useDrawerNavigation();

	const handleCloseDrawer = useCallback(() => {
		if (window.history.state?.drawer === true) {
			window.history.back();
			return;
		}
		onClose?.();
	}, [onClose]);

	// Swiper 슬라이드 이동
	useEffect(() => {
		const swiper = swiperRef.current;
		if (!swiper) return;
		isOpen ? swiper.slideTo(0) : swiper.slideTo(1);
	}, [isOpen]);

	// 드로어 열릴 때 pushState
	useEffect(() => {
        if (isOpen) {
            if (window.history.state?.drawer !== true) {
                window.history.pushState({ drawer: true }, "");
            }
        } else {
            if (window.history.state?.drawer === true) {
                window.history.back();
            }
        }
    }, [isOpen]);

	// 뒤로가기 → 드로어 닫기
	useEffect(() => {
        const handlePop = () => {
            const isDrawerOpen = isOpen;
            const state = window.history.state;

            if (isDrawerOpen && state?.drawer === undefined) {
                // drawer가 열려 있었고, 이전 상태에는 drawer가 없음 → 닫기
                handleCloseDrawer();
            }
        };

        window.addEventListener("popstate", handlePop);
        return () => window.removeEventListener("popstate", handlePop);
    }, [isOpen, handleCloseDrawer]);

	const handleSwiperSetup = (swiper) => {
		swiperRef.current = swiper;
		swiper.on("progress", () => {
			const prog = swiper.progress;
			setOpacity(1 - Math.max(0, Math.min(1, prog)));
		});
		swiper.on("touchStart", () => backdropRef.current?.classList.add("dragging"));
		swiper.on("touchEnd", () => backdropRef.current?.classList.remove("dragging"));
		swiper.on("transitionEnd", () => {
			backdropRef.current?.classList.remove("dragging");
			if (swiper.activeIndex === 1) handleCloseDrawer();
		});
	};

	return (
		<div className="side-drawer-wrapper" style={{ pointerEvents: isOpen ? "auto" : "none" }}>
			<Swiper
				initialSlide={isOpen ? 0 : 1}
				slidesPerView="auto"
				threshold={0}
                resistanceRatio={0}
				allowTouchMove
				touchStartPreventDefault={false}
				grabCursor
				onSwiper={handleSwiperSetup}
				className="side-drawer-swiper"
			>
				<SwiperSlide className="drawer-panel">
					<Stack spacing={2} sx={{ px: 2, py: 3 }}>
						<Button color="primary" onClick={() => navigateWithClose('/')}>Home</Button>
						<Button color="primary" onClick={() => navigateWithClose('/Components')}>Components</Button>
						<Button color="primary" onClick={() => navigateWithClose('/Components/Buttons')}>Buttons</Button>
					</Stack>
				</SwiperSlide>

				<SwiperSlide className="drawer-backdrop-slide">
					<div
						className="drawer-dummy"
						ref={backdropRef}
						style={{ opacity }}
						onClick={() => {
							swiperRef.current?.slideTo(1);
							handleCloseDrawer();
						}}
					/>
				</SwiperSlide>
			</Swiper>
		</div>
	);
}