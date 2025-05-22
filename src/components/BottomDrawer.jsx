import { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useDrawer } from "../contexts/DrawerContext";
import useDrawerController from "../hooks/useDrawerController";

export default function BottomDrawer() {
	const swiperRef = useRef(null);
	const backdropRef = useRef(null);
	const [opacity, setOpacity] = useState(1);

	const { drawers, setDrawerOpen } = useDrawer();
	const isOpen = drawers.bottom;

	const { handleClose } = useDrawerController({
		isOpen,
		onClose: () => setDrawerOpen("bottom", false),
		drawerKey: "bottomDrawer"
	});

	useEffect(() => {
		const swiper = swiperRef.current;
		if (!swiper) return;
		isOpen ? swiper.slideTo(0) : swiper.slideTo(1);
	}, [isOpen]);

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
			if (swiper.activeIndex === 1) handleClose();
		});
	};

	return (
		<div className="bottom-drawer-wrapper" style={{ pointerEvents: isOpen ? "auto" : "none" }}>
			<Swiper
				initialSlide={isOpen ? 0 : 1}
				direction="vertical"
				slidesPerView="auto"
				threshold={0}
				resistanceRatio={0}
				allowTouchMove
				touchStartPreventDefault={false}
				grabCursor
				onSwiper={handleSwiperSetup}
				className="bottom-drawer-swiper"
			>
				<SwiperSlide className="drawer-panel">
					<div style={{ padding: 20 }}>
						<h3>Bottom Drawer</h3>
						<p>This is a bottom drawer example using Swiper.js</p>
						<button onClick={handleClose}>Close</button>
					</div>
				</SwiperSlide>

				<SwiperSlide className="drawer-backdrop-slide">
					<div
						className="drawer-dummy"
						ref={backdropRef}
						style={{ opacity }}
						onClick={() => {
							swiperRef.current?.slideTo(1);
							handleClose();
						}}
					/>
				</SwiperSlide>
			</Swiper>
		</div>
	);
}
