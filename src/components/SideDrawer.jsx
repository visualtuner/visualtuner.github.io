import { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { NavLink } from "react-router-dom";

export default function SideDrawer({ isOpen, onClose }) {
    const swiperRef = useRef(null);
    const backdropRef = useRef(null); // 👉 dummy 슬라이드 내부 div 참조
    const [opacity, setOpacity] = useState(isOpen ? 1 : 0);

    useEffect(() => {
        const swiper = swiperRef.current;
        if (!swiper) return;

        if (isOpen) {
            swiper.slideTo(0);
        } else {
            swiper.slideTo(1);
        }
    }, [isOpen]);

    const handleSwiperSetup = (swiper) => {
        swiperRef.current = swiper;

        // 👉 progress에 따라 opacity 조절
        swiper.on("progress", () => {
            const prog = swiper.progress;
            const clamped = Math.max(0, Math.min(1, prog));
            setOpacity(1 - clamped);
        });

        // 👉 터치 시작 → dragging 클래스 추가
        swiper.on("touchStart", () => {
            backdropRef.current?.classList.add("dragging");
        });

        // 👉 터치 끝 or 트랜지션 끝 → dragging 클래스 제거
        swiper.on("touchEnd", () => {
            backdropRef.current?.classList.remove("dragging");
        });

        swiper.on("transitionEnd", () => {
            backdropRef.current?.classList.remove("dragging");
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
            onSwiper={handleSwiperSetup}
            onSlideChange={(swiper) => {
                if (swiper.activeIndex === 1 && onClose) {
                    onClose(); // setIsOpen(false) 실행
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

            <SwiperSlide className="drawer-backdrop-slide">
                <div
                    className="drawer-dummy"
                    ref={backdropRef}
                    style={{ opacity }}
                    onClick={() => {
                        console.log("clicked backdrop"); // ✅ 확인용
                        swiperRef.current?.slideTo(1);
                        onClose?.();
                    }}
                />
            </SwiperSlide>
		</Swiper>
	);
}
