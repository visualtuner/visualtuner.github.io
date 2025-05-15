import { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import useDrawerNavigation from "../hooks/useDrawerNavigation";

export default function SideDrawer({ isOpen, onClose }) {
    const swiperRef = useRef(null);
    const backdropRef = useRef(null); // 👉 dummy 슬라이드 내부 div 참조
    const [opacity, setOpacity] = useState(isOpen ? 1 : 0);
    const { navigateWithClose } = useDrawerNavigation();
    const hasPushedRef = useRef(false);

    useEffect(() => {
        const swiper = swiperRef.current;
        if (!swiper) return;

        if (isOpen) {
            swiper.slideTo(0);
        } else {
            swiper.slideTo(1);
        }
    }, [isOpen]);

    // 드로어 열릴 때 pushState (URL 변경 없음)
    useEffect(() => {
        if (isOpen && !hasPushedRef.current) {
            history.pushState({ drawer: true }, ""); // URL 변경 없이 drawer state만 추가
            hasPushedRef.current = true;
        }
    }, [isOpen]);

    // 뒤로가기(popstate) 시 드로어만 닫기
    useEffect(() => {
        const handlePop = (e) => {
            if (hasPushedRef.current) {
                hasPushedRef.current = false;
                onClose?.(); // 드로어만 닫고 라우팅은 막지 않음
            }
        };

        window.addEventListener("popstate", handlePop);
        return () => window.removeEventListener("popstate", handlePop);
    }, [onClose]);

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
        <div
            className="side-drawer-wrapper"
            style={{
                pointerEvents: isOpen ? "auto" : "none",
            }}
        >
            <Swiper
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
                        hasPushedRef.current = false;
                        onClose();
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
                            hasPushedRef.current = false;
                            onClose?.();
                        }}
                    />
                </SwiperSlide>
            </Swiper>
        </div>
	);
}
