import { useRef, useState, useEffect } from "react";
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
	const hasPushedRef = useRef(false);


	// ✅ 드로어 닫힐 때 상태도 정리
	const handleCloseDrawer = () => {
        if (window.history.state?.drawer === true) {
            console.log("🧹 replaceState after drawer close");
            window.history.replaceState({}, "");
        }
        onClose?.();
    };

	// ✅ 드로어 열고 닫을 때 swiper 슬라이드 이동
	useEffect(() => {
		const swiper = swiperRef.current;
		if (!swiper) return;

		if (isOpen) {
			swiper.slideTo(0);
		} else {
			swiper.slideTo(1);
		}
	}, [isOpen]);

	// ✅ 뒤로가기(popstate) 시 드로어만 닫기
	useEffect(() => {
		const handlePop = () => {
			if (hasPushedRef.current) {
				console.log("⬅️ popstate → drawer close only");
				handleCloseDrawer();
			}
		};

		window.addEventListener("popstate", handlePop);
		return () => window.removeEventListener("popstate", handlePop);
	}, []);

	const handleSwiperSetup = (swiper) => {
		swiperRef.current = swiper;

		swiper.on("progress", () => {
			const prog = swiper.progress;
			const clamped = Math.max(0, Math.min(1, prog));
			setOpacity(1 - clamped);
		});

		swiper.on("touchStart", () => {
			backdropRef.current?.classList.add("dragging");
		});

		swiper.on("touchEnd", () => {
			backdropRef.current?.classList.remove("dragging");
		});

		swiper.on("transitionEnd", () => {
			backdropRef.current?.classList.remove("dragging");
		});
	};

	return (
		<div
			className="side-drawer-wrapper"
			style={{ pointerEvents: isOpen ? "auto" : "none" }}
		>
			<Swiper
				initialSlide={isOpen ? 0 : 1}
				slidesPerView="auto"
				resistanceRatio={0}
				threshold={10}
				allowTouchMove={true}
				grabCursor={true}
				touchStartPreventDefault={false}
				onSwiper={handleSwiperSetup}
				onSlideChange={(swiper) => {
					if (swiper.activeIndex === 1) {
						handleCloseDrawer();
					}
				}}
				className="side-drawer-swiper"
			>
				<SwiperSlide className="drawer-panel">
					<Stack spacing={2}>
						<Button color="primary" onClick={() => navigateWithClose('/')}>
							Home
						</Button>
						<Button color="primary" onClick={() => navigateWithClose('/Components')}>
							Components
						</Button>
						<Button color="primary" onClick={() => navigateWithClose('/Components/Buttons')}>
							Buttons
						</Button>
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
