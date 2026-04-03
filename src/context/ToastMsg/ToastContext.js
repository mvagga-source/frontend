import React, { createContext, useState, useContext, useCallback } from 'react';
import styles from './Toast.module.css';
import { useAuth } from '../AuthContext';
import { postSendApi } from '../../components/SidebarComponent/SidebarNotificationApi';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const { user } = useAuth(); // 로그인 유저 정보 가져오기

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const showToast = useCallback((message, title = "알림", duration = 5000) => {
        const id = Date.now();
        
        // 날짜 포맷: 2026-04-02 12:06:00
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        const hh = String(now.getHours()).padStart(2, '0');
        const min = String(now.getMinutes()).padStart(2, '0');
        const ss = String(now.getSeconds()).padStart(2, '0');
        const dateString = `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;

        setToasts((prev) => [...prev, { id, title, message, date: dateString, duration }]);

        // 1. 서버에 알림 저장 요청 (memberId가 있을 때만 실행)
        /*if (user?.id) {
            postSendApi({
                memberId: user?.id,
                senderId: user?.id,
                nocontent: message,
                type: title,
                url: window.location.pathname // 현재 페이지 경로 저장
            });
        }*/
        setTimeout(() => {
            removeToast(id);
        }, duration);
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className={styles.toastContainer}>
                {toasts.map((toast) => (
                    <div key={toast.id} className={styles.toastItem}>
                        <div className={styles.toastHeader}>
                            <strong className={styles.title}>{toast.title}</strong>
                            <div className={styles.headerRight}>
                                <small className={styles.date}>{toast.date}</small>
                                <button className={styles.closeBtn} onClick={() => removeToast(toast.id)}>
                                    &times;
                                </button>
                            </div>
                        </div>
                        <div className={styles.toastBody}>{toast.message}</div>
                        <div 
                            className={styles.progressBar} 
                            style={{ animationDuration: `${toast.duration}ms` }} 
                        />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);