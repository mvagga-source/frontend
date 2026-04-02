import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './SidebarNotification.module.css';
import { useAuth } from "../../context/AuthContext";
import { getInitApi, getSubscribeUrl, getMoreApi, getReadApi } from './SidebarNotificationApi';

const SidebarNotification = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    //const eventSourceRef = useRef(null);
    // 다음 데이터가 있는지 확인하는 상태
    const [hasMore, setHasMore] = useState(true);

    // 1. 초기 데이터 동기화
    const syncNotificationData = useCallback(async () => {
        if (!user?.id) return;
            getInitApi(user.id).then(res => {
                if (res.data.success) {
                    setNotifications(res.data.list);
                    setUnreadCount(res.data.unreadCount);
                    // 초기 데이터가 10개 미만이면 더 가져올 게 없다고 판단
                    if (res.data.list.length < 10) {
                        setHasMore(false);
                    } else {
                        setHasMore(true);
                    }
                }
            })
    }, [user]);

    /*const handleBulkRead = async (notinoList) => {
        try {
            const res = await getReadBulkApi(notinoList); // API 호출
            if (res.data.success) {
                // 1. 현재 리스트 상태 변경 (UI 반영)
                setNotifications(prev => 
                    prev.map(n => notinoList.includes(n.notino) ? { ...n, isRead: 'y' } : n)
                );
                // 2. 안 읽은 개수 차감 (방금 읽은 개수만큼만!)
                setUnreadCount(prev => Math.max(0, prev - prev.filter(n => notinoList.includes(n.notino)).length));
                
                // 💡 만약 서버의 정확한 숫자를 다시 가져오고 싶다면 syncNotificationData()를 호출해도 좋습니다.
            }
        } catch (err) {
            console.error("Bulk read failed", err);
        }
    };*/

    // 2. SSE 연결 설정
    /*const connectSSE = useCallback(() => {
        if (!user?.id || eventSourceRef.current) return;

        // API 파일에서 가져온 URL 사용
        const url = getSubscribeUrl(user.id);
        const es = new EventSource(url);
        eventSourceRef.current = es;

        es.addEventListener("notification", (e) => {
            console.log("Received notification:", e.data);
            const newNoti = JSON.parse(e.data);
            setNotifications(prev => {
                if (prev.some(n => n.notino === newNoti.notino)) return prev;
                return [newNoti, ...prev];
            });
            setUnreadCount(prev => prev + 1);
        });

        es.onerror = () => {
            console.log("SSE Connection closed. Retrying...");
            es.close();
            eventSourceRef.current = null;
            setTimeout(connectSSE, 5000);
        };
    }, [user]);*/

    // 3. 탭 전환 관리 (Visibility API)
    /*useEffect(() => {
        if (!user?.id) return;

        syncNotificationData();
        connectSSE();

        const handleVisibility = () => {
            if (document.visibilityState === 'visible') {
                syncNotificationData();
                connectSSE();
            } else {
                if (eventSourceRef.current) {
                    eventSourceRef.current.close();
                    eventSourceRef.current = null;
                }
            }
        };

        document.addEventListener("visibilitychange", handleVisibility);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibility);
            if (eventSourceRef.current) eventSourceRef.current.close();
        };
    }, [user, connectSSE, syncNotificationData]);*/

    useEffect(() => {
        syncNotificationData();
    }, [user, syncNotificationData]);

    // 4. 더보기 (무한 스크롤)
    const handleLoadMore = async () => {
        if (notifications.length === 0 || !user?.id || !hasMore) return;
        const lastId = notifications[notifications.length - 1].notino;
        getMoreApi(user.id, lastId).then(res => {
            if (res.data.success) {
                if (res.data.data.length < 10) {
                    setHasMore(false);
                }
                setNotifications(prev => [...prev, ...res.data.data]);
            }
        });
    };

    // 5. 읽음 처리
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
            console.error("Read update failed", err);
        }
    };

    if (!user) return null;

    return (
        <div className={styles.wrapper}>
            {/* 기존 사이드바 버튼과 동일한 느낌을 주기 위해 클래스 조합 */}
            <button 
                className={`sb-user-btn ${styles.notiTrigger} ${isOpen ? styles.active : ''}`} 
                onClick={() => setIsOpen(!isOpen)}
            >
                🔔 알림 
                {unreadCount > 0 && <span className={styles.countBadge}>{unreadCount}</span>}
            </button>

            {/* 알림 창이 뜰 때 다른 버튼을 밀어내지 않도록 absolute(또는 고정) 처리 필요 */}
            {isOpen && (
                <div className={styles.absolutePanel}>
                    <div className={styles.panelHeader}>
                        <span>최신 알림</span>
                        <button onClick={() => setIsOpen(false)}>✕</button>
                    </div>
                    {notifications.length === 0 ? (
                        <div className={styles.empty}>새로운 알림이 없습니다.</div>
                    ) : (
                        <div className={styles.scrollArea}>
                            <ul className={styles.list}>
                                {notifications.map(n => (
                                    <li 
                                        key={n.notino} 
                                        className={`${styles.item} ${n.isRead === 'n' ? styles.unread : ''}`}
                                        onClick={() => handleRead(n.notino, n.isRead)}
                                    >
                                        <p className={styles.content}>{n.nocontent}</p>
                                        <span className={styles.time}>{new Date(n.crdt).toLocaleString()}</span>
                                    </li>
                                ))}
                            </ul>
                            {/* 💡 hasMore가 true일 때만 버튼을 렌더링 */}
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