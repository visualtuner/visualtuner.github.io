import React, { useEffect, useRef, useCallback } from 'react';
import useOverlayHistory from '../hooks/useOverlayHistory';

// MyModalComponent 컴포넌트: React 오버레이 시스템에 통합됩니다.
// - isOpen: OverlayContainer에서 전달받는 prop. false이면 닫힘 애니메이션 시작.
// - onClose: 닫힘 애니메이션 완료 시 OverlayContext의 removeOverlay를 호출할 콜백.
// - id, overlayType: 오버레이의 고유 ID와 타입.
// - ...restProps: OverlayContext에서 이 컴포넌트에 전달될 추가적인 props.
export default function MyModalComponent({ isOpen, onClose, id, overlayType, ...restProps }) {
    const modalRef = useRef(null); // 모달 콘텐츠 요소 ref
    // useOverlayHistory 훅을 사용하여 브라우저 히스토리와 연동합니다.
    // 현재 컴포넌트(MyModalComponent)와 전달받은 props를 함께 넘겨줍니다.
    const { requestCloseOverlay } = useOverlayHistory(overlayType, id, isOpen, onClose, MyModalComponent, restProps);

    // isVisible 상태: 모달이 DOM에 실제로 렌더링될지 여부를 제어합니다.
    // isAnimatingOut 상태: 닫힘 애니메이션 중인지를 나타냅니다.
    const [isVisible, setIsVisible] = React.useState(false); // 초기에는 숨김 (애니메이션 준비)
    const [isAnimatingOut, setIsAnimatingOut] = React.useState(false); // 닫힘 애니메이션 중인지 여부

    // 모달의 열림/닫힘 애니메이션을 제어하는 useEffect
    useEffect(() => {
        if (isOpen) { // 열림 요청 (OverlayContainer에서 isOpen이 true로 전달될 때)
            setIsVisible(true); // 모달을 보이도록 설정 (렌더링 시작)
            setIsAnimatingOut(false); // 닫힘 애니메이션 상태 해제
            document.body.style.overflow = 'hidden'; // 모달 열릴 때 스크롤 방지
            if (modalRef.current) {
                modalRef.current.focus(); // 모달이 열리면 포커스 이동 (접근성)
            }
        } else { // 닫힘 요청 (OverlayContainer에서 isOpen이 false로 전달될 때)
            setIsAnimatingOut(true); // 닫힘 애니메이션 시작
            document.body.style.overflow = ''; // 스크롤 다시 허용

            // 닫힘 애니메이션이 완료될 시간을 기다린 후 `onClose` (removeOverlay)를 호출합니다.
            // 이 `setTimeout` 시간은 CSS 애니메이션 지속 시간(`0.3s`)과 일치해야 합니다.
            const timer = setTimeout(() => {
                onClose(); // OverlayContext의 `removeOverlay` 호출 (컴포넌트 실제 언마운트)
                setIsVisible(false); // 완전히 숨김 (DOM에서 제거될 준비)
            }, 300); // CSS 애니메이션 지속 시간과 일치

            return () => clearTimeout(timer); // 컴포넌트 언마운트 또는 `isOpen` 변경 시 `setTimeout` 클린업
        }
        // 이 훅이 클린업될 때 (컴포넌트 언마운트 시) 스크롤 방지를 해제합니다.
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]); // `isOpen` prop과 `onClose` 콜백이 변경될 때마다 실행

    // 배경 클릭 시 모달 닫기 핸들러
    const handleBackdropClick = useCallback(() => {
        requestCloseOverlay(); // `useOverlayHistory` 훅의 `requestCloseOverlay`를 호출하여 닫힘 애니메이션을 시작합니다.
    }, [requestCloseOverlay]);

    // 모달이 완전히 숨겨져야 할 때 (즉, 닫힘 애니메이션이 끝났을 때) `null`을 반환하여 DOM에서 제거합니다.
    // `isAnimatingOut` 중에는 렌더링을 유지하여 애니메이션을 보여줍니다.
    if (!isVisible && !isAnimatingOut) return null;

    return (
        <div
            className={`modal-backdrop ${isAnimatingOut ? 'fade-out' : 'fade-in'}`} // 배경 페이드 인/아웃 클래스
            onClick={handleBackdropClick} // 배경 클릭 시 닫기
            style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, // 전체 화면 커버
                backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 배경
                display: 'flex', justifyContent: 'center', alignItems: 'center', // 중앙 정렬
                zIndex: 1000, // 높은 z-index로 최상단에 위치
                opacity: isAnimatingOut ? 0 : 1, // `isAnimatingOut`에 따라 opacity 제어
                transition: 'opacity 0.3s ease-out' // opacity에 대한 CSS 트랜지션
            }}
        >
            <div
                className={`modal-content ${isAnimatingOut ? 'slide-out' : 'slide-in'}`} // 콘텐츠 슬라이드 인/아웃 클래스
                ref={modalRef} // 콘텐츠 요소 ref
                role="dialog" // 접근성 역할
                aria-modal="true" // 접근성 속성
                tabIndex="-1" // 키보드 접근성
                onClick={e => e.stopPropagation()} // 모달 내부 클릭이 배경 클릭으로 전파되는 것을 방지
                style={{
                    backgroundColor: 'white', padding: '20px', borderRadius: '8px',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', minWidth: '300px', textAlign: 'center',
                    transition: 'transform 0.3s ease-out', // transform에 대한 CSS 트랜지션
                    transform: isAnimatingOut ? 'translateY(20px)' : 'translateY(0)' // `isAnimatingOut`에 따라 transform 제어
                }}
            >
                <h2>로그인 모달</h2>
                <p>여기에 로그인 폼이나 다른 콘텐츠가 들어갑니다.</p>
                <p>전달받은 prop: {restProps.initialData}</p>
                <button onClick={requestCloseOverlay}>닫기</button>
            </div>
        </div>
    );
}