import React from "react";
import styles from "./Idea.module.css";

function Idea() {
    const dummyIdeas = [
        { id: 1, title: "굿즈 예약 기능 추가 요청", author: "user123", time: "10분 전" },
        { id: 2, title: "팬 커뮤니티 이벤트 제안", author: "fanlove", time: "25분 전" },
        { id: 3, title: "앱 다크모드 개선 아이디어", author: "devking", time: "1시간 전" },
        { id: 4, title: "앱 다크모드 개선 아이디어", author: "devking", time: "1시간 전" },
        { id: 5, title: "앱 다크모드 개선 아이디어", author: "devking", time: "1시간 전" },
        { id: 6, title: "앱 다크모드 개선 아이디어", author: "devking", time: "1시간 전" },
        { id: 7, title: "앱 다크모드 개선 아이디어", author: "devking", time: "1시간 전" },
        { id: 8, title: "앱 다크모드 개선 아이디어", author: "devking", time: "1시간 전" },
        { id: 9, title: "앱 다크모드 개선 아이디어", author: "devking", time: "1시간 전" },
        { id: 10, title: "앱 다크모드 개선 아이디어", author: "devking", time: "1시간 전" },
    ];

    return (
        <div className={styles.ideaContainer}>
            {/* 좌측 리스트 */}
            <div className={styles.ideaList}>
                <div className={styles.listHeader}>
                    <h2>아이디어 제안</h2>
                    <span>총 {dummyIdeas.length}건</span>
                </div>

                <ul>
                    {dummyIdeas.map((idea) => (
                        <li key={idea.id} className={styles.ideaItem}>
                            <div className={styles.ideaTitle}>{idea.title}</div>
                            <div className={styles.ideaMeta}>
                                <span>{idea.author}</span>
                                <span>{idea.time}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* 우측 가이드 */}
            <div className={styles.ideaGuide}>
                <h3>아이디어 작성 가이드</h3>
                <p>
                    구체적인 내용과 기대 효과를 함께 작성해 주세요.  
                    다른 사용자들이 이해하기 쉽도록 작성하면 반영될 확률이 높아집니다.
                </p>

                <div className={styles.guideBox}>
                    <div>✔ 기능 설명을 명확하게</div>
                    <div>✔ 필요한 이유 작성</div>
                    <div>✔ 기대 효과 포함</div>
                </div>

                <button className={styles.writeButton}>
                    제안하기
                </button>
            </div>
        </div>
    );
}

export default Idea;