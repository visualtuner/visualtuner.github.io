import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { NavLink } from "react-router-dom";

export default function SideDrawer({ isOpen, onClose }) {
    const swiperRef = useRef(null);
    const [opacity, setOpacity] = useState(isOpen ? 1 : 0);

    const handleSwiperProgress = (swiper) => {
        swiperRef.current = swiper;

        swiper.on("setTranslate", () => {
            // progress: 0 (panel 열림) → 1 (닫힘)
            const prog = swiper.progress;
            const clamped = Math.max(0, Math.min(1, prog));
            const calculatedOpacity = 1 - clamped;
            setOpacity(calculatedOpacity);
        });
    };
    
	return (
		<Swiper
			key={isOpen ? "open" : "closed"}
            initialSlide={isOpen ? 0 : 1}
            slidesPerView={"auto"}
            resistanceRatio={0}
            threshold={10}
            allowTouchMove={true}
            grabCursor={true}
            touchStartPreventDefault={false}
            onProgress={handleSwiperProgress}
            onSlideChange={(swiper) => {
                if (swiper.activeIndex === 1 && onClose) {
                    onClose(); // 드로어 닫기
                }
            }}
            className="side-drawer-swiper"
		>
			<SwiperSlide className="drawer-panel">
				<div className="menu">
					<NavLink to="/">Home</NavLink>
					<NavLink to="/Components">Components</NavLink>
					<NavLink to="/Components/Buttons">Buttons</NavLink>
				</div>
			</SwiperSlide>

			<SwiperSlide
                className="drawer-dummy"
                onClick={onClose}
                style={{ opacity }}
            />
		</Swiper>
	);
}
