// src/components/SideDrawer.jsx (이전 내용에서 'transitionEnd' 부분만 수정)

import { useRef, useState, useEffect, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import useOverlayNavigation from "@/hooks/useOverlayNavigation";
import useOverlayHistory from "@/hooks/useOverlayHistory";

export default function SideDrawer({ isOpen, onClose, id, overlayType, someCustomProp, ...restProps }) {
    const swiperRef = useRef(null);
    const backdropRef = useRef(null);
    const [opacity, setOpacity] = useState(0);

    const { navigateWithClose } = useOverlayNavigation();
    const { requestCloseOverlay } = useOverlayHistory(overlayType, id, isOpen, onClose, SideDrawer, { someCustomProp, ...restProps }); // onClose는 useOverlayHistory에 전달

    useEffect(() => {
        const swiper = swiperRef.current;
        if (!swiper) return;

        const timeoutId = setTimeout(() => {
            swiper.slideTo(0, 300);
            setOpacity(1);
        }, 50);

        return () => clearTimeout(timeoutId);
    }, []);

    useEffect(() => {
        const swiper = swiperRef.current;
        if (!swiper) return;

        if (!isOpen) {
            swiper.slideTo(1, 300);
            setOpacity(0);
        }
    }, [isOpen]);

    const handleSwiperSetup = useCallback((swiper) => {
        swiperRef.current = swiper;
        swiper.on("progress", () => {
            const prog = swiper.progress;
            setOpacity(1 - Math.max(0, Math.min(1, prog)));
        });
        swiper.on("touchStart", () => backdropRef.current?.classList.add("dragging"));
        swiper.on("touchEnd", () => backdropRef.current?.classList.remove("dragging"));

        // <<<<<<<<<<<< 이 부분이 핵심 수정입니다 >>>>>>>>>>
        swiper.on("transitionEnd", () => {
            backdropRef.current?.classList.remove("dragging");
            if (swiper.activeIndex === 1) { // 스와이퍼가 완전히 닫힌 상태(인덱스 1)로 이동했다면
                // 1. 히스토리 정리를 요청 (requestCloseOverlay는 triggerGlobalClose를 호출하고 history.back()을 조건부로 호출)
                requestCloseOverlay(); 
                // 2. 오버레이 컴포넌트를 DOM에서 완전히 제거
                onClose(); // <<-- 기존의 onClose 호출 복구!
            }
        });

    }, [requestCloseOverlay, onClose]); // requestCloseOverlay와 onClose 모두 의존성 배열에 추가

    const handleCloseButtonClick = useCallback(() => {
        requestCloseOverlay();
    }, [requestCloseOverlay]);

    return (
        <div
            className="side-drawer-wrapper"
            style={{
                pointerEvents: isOpen ? "auto" : "none",
            }}
        >
            <Swiper
                initialSlide={1}
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
                        <Button color="primary" onClick={() => navigateWithClose('/Profiles', { state: { transitionClassName: 'slideup' }})}>Profiles</Button>
                        <Button color="secondary" onClick={handleCloseButtonClick}>드로어 닫기</Button>
                    </Stack>
                </SwiperSlide>

                <SwiperSlide className="drawer-backdrop-slide">
                    <div
                        className="drawer-dummy"
                        ref={backdropRef}
                        style={{ opacity }}
                        onClick={() => {
                            requestCloseOverlay();
                        }}
                    />
                </SwiperSlide>
            </Swiper>
        </div>
    );
}