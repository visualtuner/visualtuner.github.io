import { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import useOverlayNavigation from "../hooks/useOverlayNavigation";
import useOverlayHistory from "../hooks/useOverlayHistory";

export default function SideDrawer({ isOpen, onClose }) {
    const swiperRef = useRef(null);
    const backdropRef = useRef(null);
    const [opacity, setOpacity] = useState(isOpen ? 1 : 0);
    const { navigateWithClose } = useOverlayNavigation();

    const { requestCloseOverlay } = useOverlayHistory("drawer", "mainSideDrawer", isOpen, onClose);

    useEffect(() => {
        const swiper = swiperRef.current;
        if (!swiper) return;
        swiper.slideTo(isOpen ? 0 : 1, 300);
    }, [isOpen]);

    useEffect(() => {
        setOpacity(isOpen ? 1 : 0);
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
            if (swiper.activeIndex === 1) {
                requestCloseOverlay();
            }
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
                        }}
                    />
                </SwiperSlide>
            </Swiper>
        </div>
    );
}