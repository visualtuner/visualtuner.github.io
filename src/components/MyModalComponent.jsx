import React, { useEffect, useRef, useCallback } from 'react';
import { useOverlay } from '../contexts/OverlayContext';
import useOverlayHistory from '../hooks/useOverlayHistory';

export default function MyModalComponent({ isOpen, onClose }) {
    const modalRef = useRef(null);
    const { requestCloseOverlay } = useOverlayHistory("modal", "myLoginModal", isOpen, onClose);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            if (modalRef.current) {
                modalRef.current.focus();
            }
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const handleBackdropClick = useCallback(() => {
        requestCloseOverlay();
    }, [requestCloseOverlay]);

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick} style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div
                className="modal-content"
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                tabIndex="-1"
                onClick={e => e.stopPropagation()}
                style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                    minWidth: '300px',
                    textAlign: 'center'
                }}
            >
                <h2>로그인 모달</h2>
                <p>여기에 로그인 폼이나 다른 콘텐츠가 들어갑니다.</p>
                <button onClick={requestCloseOverlay}>닫기</button>
            </div>
        </div>
    );
}