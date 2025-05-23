import { useRef, useState, useEffect, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import useDrawerNavigation from "../hooks/useDrawerNavigation"; // Keep this for navigation actions
import useDrawerHistory from "../hooks/useDrawerHistory"; // New hook for history management
import { useDrawer } from "../contexts/DrawerContext"; // To get open/close functions

export default function SideDrawer({ isOpen, onClose }) {
    const swiperRef = useRef(null);
    const backdropRef = useRef(null);
    const [opacity, setOpacity] = useState(isOpen ? 1 : 0);
    const { navigateWithClose } = useDrawerNavigation();
    const { openDrawer, closeDrawer } = useDrawer(); // Get the global drawer control

    // Use the new history hook
    const { requestCloseDrawer } = useDrawerHistory("mainSideDrawer", isOpen, onClose);

    // Handle closing the drawer, now uses requestCloseDrawer
    const handleCloseDrawer = useCallback(() => {
        requestCloseDrawer();
    }, [requestCloseDrawer]);

    // Swiper slide movement
    useEffect(() => {
        const swiper = swiperRef.current;
        if (!swiper) return;
        isOpen ? swiper.slideTo(0) : swiper.slideTo(1);
    }, [isOpen]);

    // When the drawer opens, tell the global context
    useEffect(() => {
        if (isOpen) {
            openDrawer("mainSideDrawer"); // Register this drawer as open
        } else {
            // No need to call closeDrawer here, useDrawerHistory will handle it via popstate if applicable
            // Or use handleCloseDrawer if it's a direct close action
        }
    }, [isOpen, openDrawer]);


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
            if (swiper.activeIndex === 1) handleCloseDrawer(); // Use handleCloseDrawer
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
                            handleCloseDrawer(); // Use handleCloseDrawer
                        }}
                    />
                </SwiperSlide>
            </Swiper>
        </div>
    );
}