import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './SidebarNotification.module.css';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useAuth } from "../../context/AuthContext";
import { getInitApi, getMoreApi, getReadApi, readBulkNotificationsApi, deleteNotificationApi, deleteAllNotificationsApi } from './SidebarNotificationApi';

const SidebarNotification = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    
    const clientRef = useRef(null);
    const scrollAreaRef = useRef(null);

    // 웹소켓 연결 및 실시간 수신
    useEffect(() => {
        if (!user?.id) return;

        const client = new Client({
            webSocketFactory: () => new SockJS(`${process.env.REACT_APP_SERVER_URL}/ws-stomp`),
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('STOMP Connected');
                client.subscribe(`/sub/notification/${user.id}`, (message) => {
                    const newNoti = JSON.parse(message.body);
                    
                    setNotifications(prev => {
                        // 중복 수신 방지
                        if (prev.find(n => n.notino === newNoti.notino)) return prev;
                        return [newNoti, ...prev];
                    });
                    setUnreadCount(prev => prev + 1);
                });
            },
        });

        client.activate();
        clientRef.current = client;

        return () => {
            if (clientRef.current) clientRef.current.deactivate();
        };
    }, [user?.id]);

    // 초기 데이터 로드
    const syncNotificationData = useCallback(async () => {
        if (!user?.id) return;
        try {
            const res = await getInitApi(user.id);
            if (res.data.success) {
                setNotifications(res.data.list);
                setUnreadCount(res.data.unreadCount);
                setHasMore(res.data.list.length === 10);
            }
        } catch (err) {
            console.error("초기 데이터 로드 실패", err);
        }
    }, [user]);

    useEffect(() => {
        syncNotificationData();
    }, [syncNotificationData]);

    // 알림창이 열려있는 동안 리스트에 안 읽은 알림이 생기면 즉시 읽음 처리
    useEffect(() => {
        // 1. 창이 닫혀있거나 안 읽은 알림이 없으면 중단
        if (!isOpen) return;

        const unreadIds = notifications
            .filter(n => n.isRead === 'n')
            .map(n => n.notino);

        if (unreadIds.length > 0) {
            // 서버에 읽음 요청
            readBulkNotificationsApi(unreadIds)
                .then(res => {
                    if (res.data.success) {
                        // 2. 전체를 0으로 만드는 게 아니라, 방금 읽은 개수만큼만 차감
                        setUnreadCount(prev => Math.max(0, prev - unreadIds.length));
                        
                        // 3. 상태 업데이트 (불필요한 렌더링 방지를 위해 읽은 것만 변경)
                        setNotifications(prev => 
                            prev.map(n => unreadIds.includes(n.notino) ? { ...n, isRead: 'y' } : n)
                        );
                    }
                })
                .catch(err => console.error("더보기 데이터 읽음 처리 실패", err));
        }
    }, [isOpen, notifications.length]); // notifications.length를 추가하여 데이터가 추가될 때마다 실행

    // 외부 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (isOpen && !e.target.closest(`.${styles.wrapper}`)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // 더보기 (무한 스크롤)
    const handleLoadMore = async () => {
        if (notifications.length === 0 || !user?.id || !hasMore) return;
        const lastId = notifications[notifications.length - 1].notino;
        
        try {
            const res = await getMoreApi(user.id, lastId);
            if (res.data.success) {
                const newData = res.data.data;
                if (newData.length < 10) setHasMore(false);
                
                setNotifications(prev => {
                    // 기존 데이터와 중복되는 ID 필터링
                    const existingIds = new Set(prev.map(n => n.notino));
                    const filtered = newData.filter(n => !existingIds.has(n.notino));
                    return [...prev, ...filtered];
                });
            }
        } catch (err) {
            console.error("추가 데이터 로드 실패", err);
        }
    };

    // 단건 클릭 읽음 처리 (이미 읽은 건 패스)
    const handleRead = async (notino, isRead) => {
        if (isRead === 'y') return;
        try {
            const res = await getReadApi(notino);
            if (res.data.success) {
                setNotifications(prev => 
                    prev.map(n => n.notino === notino ? { ...n, isRead: 'y' } : n)
                );
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (err) {
            console.error("읽음 처리 실패", err);
        }
    };

    // 개별 삭제
    const handleDelete = async (e, notino) => {
        e.stopPropagation(); 
        
        // 삭제할 아이템의 정보를 미리 찾아둠
        const targetNoti = notifications.find(n => n.notino === notino);
        if (!targetNoti) return;

        try {
            const res = await deleteNotificationApi(notino);
            if (res.data.success) {
                // 1. 알림 리스트에서 제거
                setNotifications(prev => prev.filter(n => n.notino !== notino));
                
                // 2. 안 읽은 알림이었다면 카운트 차감
                if (targetNoti.isRead === 'n') {
                    setUnreadCount(prev => Math.max(0, prev - 1));
                }
            }
        } catch (err) {
            console.error("삭제 실패", err);
        }
    };

    // 전체 삭제
    const handleDeleteAll = async () => {
        if (!window.confirm("모든 알림을 삭제하시겠습니까?")) return;

        try {
            const res = await deleteAllNotificationsApi(user.id);
            if (res.data.success) {
                setNotifications([]);
                setUnreadCount(0);
                setHasMore(false);
            }
        } catch (err) {
            console.error("전체 삭제 실패", err);
        }
    };

    if (!user) return null;

    return (
        <div className={styles.wrapper}>
            <button 
                className={`sb-user-btn ${styles.notiTrigger} ${isOpen ? styles.active : ''}`} 
                onClick={() => setIsOpen(!isOpen)}
            >
                🔔 알림 
                {unreadCount > 0 && <span className={styles.countBadge}>{unreadCount}</span>}
            </button>

            {isOpen && (
                <div className={styles.absolutePanel}>
                    <div className={styles.panelHeader}>
                        <span>최신 알림</span>
                        <div className={styles.headerBtns}>
                            {notifications.length > 0 && (
                                <button className={styles.deleteAllBtn} onClick={handleDeleteAll}>전체 삭제</button>
                            )}
                            <button onClick={() => setIsOpen(false)}>✕</button>
                        </div>
                    </div>
                    {notifications.length === 0 ? (
                        <div className={styles.empty}>새로운 알림이 없습니다.</div>
                    ) : (
                        <div className={styles.scrollArea} ref={scrollAreaRef}>
                            <ul className={styles.list}>
                                {notifications.map(n => (
                                    <li 
                                        key={n.notino} 
                                        className={`${styles.item} ${n.isRead === 'n' ? styles.unread : ''}`}
                                        onClick={() => handleRead(n.notino, n.isRead)}
                                    >
                                        <div className={styles.itemMain}>
                                            <p className={styles.content}>{n.nocontent}</p>
                                            <span className={styles.time}>
                                                {new Date(n.crdt).toLocaleString('ko-KR', {month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'})}
                                            </span>
                                        </div>
                                        {/* 개별 삭제 버튼 */}
                                        <button 
                                            className={styles.deleteBtn} 
                                            onClick={(e) => handleDelete(e, n.notino)}
                                        >
                                            ✕
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            {hasMore && (
                                <button className={styles.moreBtn} onClick={handleLoadMore}>
                                    이전 알림 더보기
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SidebarNotification;