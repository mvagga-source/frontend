import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom'; // Portal 사용을 위해 추가
import styles from './SidebarNotificationSetting.module.css';
import { getNotificationSettingApi, updateNotificationSettingApi } from '../../SidebarNotificationApi';

const SidebarNotificationSetting = ({ memberId, onClose }) => {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await getNotificationSettingApi(memberId);
                if (res.data.success) {
                    setSettings(res.data.data);
                }
            } catch (err) {
                console.error("설정 로드 실패", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, [memberId]);

    const handleToggle = async (key, currentValue) => {
        const newValue = currentValue === 'y' ? 'n' : 'y';
        try {
            setSettings(prev => ({ ...prev, [key]: newValue }));
            await updateNotificationSettingApi(memberId, { [key]: newValue });
        } catch (err) {
            console.error("업데이트 실패", err);
            setSettings(prev => ({ ...prev, [key]: currentValue }));
        }
    };

    if (loading) return null; // 로딩 중에는 아무것도 안 띄우거나 작은 스피너만

    // 팝업 JSX 구조
    const popupContent = (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.popupContainer} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h3>알림 설정</h3>
                    <button className={styles.closeX} onClick={onClose}>✕</button>
                </div>

                <div className={styles.scrollBody}>
                    <div className={styles.section}>
                        <p className={styles.sectionTitle}>커뮤니티</p>
                        <div className={styles.row}>
                            <span>댓글 및 답글 알림</span>
                            <button 
                                className={`${styles.toggle} ${settings?.allowBoardComment === 'y' ? styles.on : ''}`}
                                onClick={() => handleToggle('allowBoardComment', settings.allowBoardComment)}
                            />
                        </div>
                        <div className={styles.row}>
                            <span>게시글 추천 알림</span>
                            <button 
                                className={`${styles.toggle} ${settings?.allowBoardLike === 'y' ? styles.on : ''}`}
                                onClick={() => handleToggle('allowBoardLike', settings.allowBoardLike)}
                            />
                        </div>
                    </div>


                    <div className={styles.section}>
                        <p className={styles.sectionTitle}>굿즈샵</p>
                        {/* 추가된 거래 상태 알림 */}
                        <div className={styles.row}>
                            <span>거래 상태 알림 (결제/배송 등)</span>
                            <button 
                                className={`${styles.toggle} ${settings?.allowGoodsTrade === 'y' ? styles.on : ''}`}
                                onClick={() => handleToggle('allowGoodsTrade', settings.allowGoodsTrade)}
                            />
                        </div>
                        <div className={styles.row}>
                            <span>리뷰 및 판매자 답글</span>
                            <button 
                                className={`${styles.toggle} ${settings?.allowGoodsReview === 'y' ? styles.on : ''}`}
                                onClick={() => handleToggle('allowGoodsReview', settings.allowGoodsReview)}
                            />
                        </div>
                        <div className={styles.row}>
                            <span>리뷰에 대한 도움돼요</span>
                            <button 
                                className={`${styles.toggle} ${settings?.allowGoodsReviewLike === 'y' ? styles.on : ''}`}
                                onClick={() => handleToggle('allowGoodsReviewLike', settings.allowGoodsReviewLike)}
                            />
                        </div>
                    </div>

                    <div className={styles.section}>
                        <p className={styles.sectionTitle}>시스템</p>
                        <div className={styles.row}>
                            <span>1:1 문의 답변 (필수)</span>
                            <span className={styles.fixedOn}>ON</span>
                        </div>
                    </div>
                </div>

                <div className={styles.footer}>
                    <button className={styles.closeBtn} onClick={onClose}>닫기</button>
                </div>
            </div>
        </div>
    );

    // document.body에 직접 렌더링하여 사이드바/리스트 영향 안 받게 함
    return ReactDOM.createPortal(popupContent, document.body);
};

export default SidebarNotificationSetting;