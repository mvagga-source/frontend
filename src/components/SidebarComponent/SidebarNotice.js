import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./SidebarNotice.module.css";
import { getMainListApi } from "./SidebarNoticeApi";
import NoticePopup from "./popup/NoticePopup"; // 자동 팝업
import dayjs from "dayjs";

const SidebarNotice = ({ onClose }) => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 클릭한 공지의 인덱스를 저장 (null이면 팝업 안 열림)
  const [activeIdx, setActiveIdx] = useState(null);

  const list = async () => {
    setLoading(true);
    getMainListApi().then((res) => {
      const data = res.data.list || res.data.data?.list;
      if (data) setNotices(data);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { list(); }, []);

  // 클릭 시 해당 요소의 index를 저장
  const handleNoticeClick = (e, index) => {
    e.preventDefault();
    setActiveIdx(index);
  };

  return (
    <>
      {/* activeIdx가 null이면 자동팝업 모드, 숫자면 해당 슬라이드 시작 모드 */}
      {/* <NoticePopup 
        startIndex={activeIdx} 
        onClose={() => setActiveIdx(null)} 
      /> */}

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <p className={styles.sectionTitle}>공지사항</p>
          <Link to="/Notice" className={styles.moreBtn} onClick={onClose}>MORE +</Link>
        </div>

        {loading ? (
          <div className={styles.loading}>Loading...</div>
        ) : (
          <ul className={styles.noticeList}>
            {notices.map((n, index) => (
              <li key={n.nno} className={styles.noticeItem}>
                <a href="#" className={styles.noticeLink} onClick={(e) => handleNoticeClick(e, index)}>
                  <span className={styles.noticeText}>{n.ntitle}</span>
                  <span className={styles.noticeDate}>{dayjs(n.crdt).format("YYYY-MM-DD")}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default SidebarNotice;