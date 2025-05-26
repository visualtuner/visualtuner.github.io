import { useRef, useState, useEffect, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react"; // Swiper 컴포넌트와 SwiperSlide 컴포넌트 임포트
import "swiper/css"; // Swiper 기본 CSS 임포트
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import useOverlayNavigation from "../hooks/useOverlayNavigation"; // 오버레이 닫기 후 라우팅 훅
import useOverlayHistory from "../hooks/useOverlayHistory"; // 브라우저 히스토리 연동 훅

// SideDrawer 컴포넌트: React 오버레이 시스템에 통합됩니다.
// - isOpen: OverlayContainer에서 전달받는 prop. false이면 닫힘 애니메이션 시작.
// - onClose: 닫힘 애니메이션 완료 시 OverlayContext의 removeOverlay를 호출할 콜백.
// - id, overlayType: 오버레이의 고유 ID와 타입 (히스토리 관리 및 컨텍스트에서 사용).
// - ...restProps: OverlayContext에서 이 컴포넌트에 전달될 추가적인 props.
export default function SideDrawer({ isOpen, onClose, id, overlayType, someCustomProp, ...restProps }) {
    const swiperRef = useRef(null); // Swiper 인스턴스를 참조하기 위한 ref
    const backdropRef = useRef(null); // 드로어 뒷배경 요소를 참조하기 위한 ref

    // opacity 상태: 드로어 뒷배경의 투명도를 제어하여 페이드 인/아웃 효과를 줍니다.
    // 초기에는 닫힌 상태이므로 0으로 설정합니다.
    const [opacity, setOpacity] = useState(0);

    const { navigateWithClose } = useOverlayNavigation(); // 메뉴 클릭 시 오버레이 닫고 라우팅하는 훅
    // useOverlayHistory 훅을 사용하여 브라우저 히스토리와 연동합니다.
    // 현재 컴포넌트(SideDrawer)와 전달받은 props를 함께 넘겨줍니다.
    const { requestCloseOverlay } = useOverlayHistory(overlayType, id, isOpen, onClose, SideDrawer, { someCustomProp, ...restProps });

    // 열림 애니메이션: 컴포넌트가 마운트될 때 (즉, 오버레이가 열릴 때) 실행됩니다.
    useEffect(() => {
        const swiper = swiperRef.current;
        if (!swiper) return;

        // Swiper가 완전히 초기화되고 렌더링된 후 슬라이드 애니메이션을 시작하기 위해
        // 약간의 딜레이(setTimeout)를 줍니다.
        const timeoutId = setTimeout(() => {
            swiper.slideTo(0, 300); // 드로어를 열린 상태(첫 번째 슬라이드, 인덱스 0)로 300ms 동안 애니메이션
            setOpacity(1); // 백드롭을 완전히 보이도록 설정
        }, 50); // 50ms 딜레이

        return () => clearTimeout(timeoutId); // 컴포넌트 언마운트 시 setTimeout 클린업
    }, []); // 의존성 배열이 비어 있으므로, 컴포넌트 마운트 시 한 번만 실행됩니다.

    // 닫힘 애니메이션: `isOpen` prop이 `false`로 변할 때 (즉, OverlayContext에서 `isClosing`이 `true`가 될 때) 실행됩니다.
    useEffect(() => {
        const swiper = swiperRef.current;
        if (!swiper) return;

        if (!isOpen) { // `isOpen`이 `false`이면 닫힘 요청이 들어온 것입니다.
            swiper.slideTo(1, 300); // 드로어를 닫힌 상태(두 번째 슬라이드, 인덱스 1)로 300ms 동안 애니메이션
            setOpacity(0); // 백드롭을 투명하게 만듭니다.
        }
    }, [isOpen]); // `isOpen` prop의 변화를 감지하여 실행됩니다.

    // Swiper 설정 및 이벤트 핸들러
    const handleSwiperSetup = useCallback((swiper) => {
        swiperRef.current = swiper; // Swiper 인스턴스를 ref에 저장
        // `progress` 이벤트: Swiper 슬라이드 진행도에 따라 뒷배경 투명도를 조절합니다.
        swiper.on("progress", () => {
            const prog = swiper.progress; // 0 (열림) ~ 1 (닫힘)
            setOpacity(1 - Math.max(0, Math.min(1, prog))); // 진행도에 따라 투명도 반전
        });
        // `touchStart`, `touchEnd` 이벤트: 스와이프 중일 때 뒷배경에 "dragging" 클래스를 추가/제거합니다.
        swiper.on("touchStart", () => backdropRef.current?.classList.add("dragging"));
        swiper.on("touchEnd", () => backdropRef.current?.classList.remove("dragging"));
        // `transitionEnd` 이벤트: 슬라이드 애니메이션이 완전히 끝났을 때 발생합니다.
        swiper.on("transitionEnd", () => {
            backdropRef.current?.classList.remove("dragging");
            if (swiper.activeIndex === 1) { // 스와이퍼가 완전히 닫힌 상태(인덱스 1)로 이동했다면
                onClose(); // OverlayContext의 `removeOverlay` 함수를 호출하여 컴포넌트를 DOM에서 제거합니다.
            }
        });
    }, []); // 의존성 배열이 비어 있으므로, 컴포넌트 마운트 시 한 번만 생성됩니다.

    // "드로어 닫기" 버튼 클릭 핸들러
    const handleCloseButtonClick = useCallback(() => {
        requestCloseOverlay(); // `useOverlayHistory` 훅의 `requestCloseOverlay`를 호출하여 닫힘 애니메이션을 시작합니다.
    }, [requestCloseOverlay]);

    return (
        <div
            className="side-drawer-wrapper"
            style={{
                // isOpen이 true일 때만 포인터 이벤트(클릭, 스와이프 등)를 허용합니다.
                // 닫힘 애니메이션 중에는 `none`으로 설정하여 오버레이 뒤의 요소 클릭 방지.
                pointerEvents: isOpen ? "auto" : "none",
            }}
        >
            <Swiper
                initialSlide={1} // !!! 중요: Swiper는 마운트될 때 "닫힌" 상태(인덱스 1)로 시작합니다.
                                // 이후 useEffect에서 `slideTo(0)`을 호출하여 열림 애니메이션을 보여줍니다.
                slidesPerView="auto" // 슬라이드의 너비를 콘텐츠에 맞게 자동 조정
                threshold={0} // 스와이프 임계값 (0으로 설정하여 미세한 움직임에도 반응)
                resistanceRatio={0} // 저항 비율 (스와이프 끝에서 저항 없앰)
                allowTouchMove // 터치 스와이프 허용
                touchStartPreventDefault={false} // 터치 시작 시 기본 이벤트 방지 안 함
                grabCursor // 마우스 커서를 grab 모드로 변경
                onSwiper={handleSwiperSetup} // Swiper 인스턴스가 초기화될 때 호출될 콜백
                className="side-drawer-swiper" // CSS 스타일링을 위한 클래스 이름
            >
                {/* 첫 번째 슬라이드: 실제 드로어 패널 내용 */}
                <SwiperSlide className="drawer-panel">
                    <Stack spacing={2} sx={{ px: 2, py: 3 }}>
                        {/* `MapsWithClose`를 사용하여 오버레이를 닫고 페이지 이동 */}
                        <Button color="primary" onClick={() => navigateWithClose('/')}>Home</Button>
                        <Button color="primary" onClick={() => navigateWithClose('/Components')}>Components</Button>
                        <Button color="primary" onClick={() => navigateWithClose('/Components/Buttons')}>Buttons</Button>
                        <Button color="secondary" onClick={handleCloseButtonClick}>드로어 닫기</Button>
                    </Stack>
                </SwiperSlide>

                {/* 두 번째 슬라이드: 드로어 뒷배경 (더미 슬라이드) */}
                <SwiperSlide className="drawer-backdrop-slide">
                    <div
                        className="drawer-dummy"
                        ref={backdropRef} // 뒷배경 요소 ref
                        style={{ opacity }} // 뒷배경 투명도 (Swiper progress에 따라 동적 변경)
                        onClick={() => {
                            requestCloseOverlay(); // 뒷배경 클릭 시 닫기 요청
                        }}
                    />
                </SwiperSlide>
            </Swiper>
        </div>
    );
}