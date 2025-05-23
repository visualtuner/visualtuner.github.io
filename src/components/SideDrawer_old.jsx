import { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import useDrawerNavigation from "../hooks/useDrawerNavigation";
import useDrawerHistory from "../hooks/useDrawerHistory";
// import { useDrawer } from "../contexts/DrawerContext"; // openDrawer는 여기서 필요 없으므로 제거

export default function SideDrawer({ isOpen, onClose }) {
    const swiperRef = useRef(null);
    const backdropRef = useRef(null);
    const [opacity, setOpacity] = useState(isOpen ? 1 : 0);
    const { navigateWithClose } = useDrawerNavigation();
    // const { openDrawer, closeDrawer } = useDrawer(); // closeDrawer는 여기서 직접 사용하지 않으므로 제거

    // useDrawerHistory 훅이 내부적으로 closeDrawer를 사용합니다.
    const { requestCloseDrawer } = useDrawerHistory("mainSideDrawer", isOpen, onClose);

    // Swiper 슬라이드 이동
    useEffect(() => {
        const swiper = swiperRef.current;
        if (!swiper) return;
        swiper.slideTo(isOpen ? 0 : 1, 300);
    }, [isOpen]);

    // opacity 상태 동기화
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
                requestCloseDrawer(); // requestCloseDrawer를 통해 드로어 닫기 및 히스토리 처리
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
                            // swiper.on("transitionEnd")에서 requestCloseDrawer를 호출하므로 여기서 직접 호출은 필요 없습니다.
                            // 즉시 닫아야 한다면 requestCloseDrawer(); 를 추가할 수 있습니다.
                        }}
                    />
                </SwiperSlide>
            </Swiper>
        </div>
    );
}