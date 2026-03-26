import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom"; // Outlet 추가!
import Content from "../../components/Title/ContentComp";
import styles from "./Community.module.css";

function Community() {
    const location = useLocation();
    const navigate = useNavigate();

    // 현재 URL 경로를 확인하여 활성화 탭 결정
    const getActiveTab = () => {
        const path = location.pathname;
        if (path.includes("Board")) return "board";
        if (path.includes("Qna")) return "qna";
        if (path.includes("Idea")) return "idea";
        if (path.includes("Report")) return "report";
        return "board";
    };

    const activeTab = getActiveTab();

    return (
        <Content TitleName="Community">
            <div className={styles.communityContainer}>
                <div className={styles.tabWrapper}>
                    {/* 경로를 반드시 /Community/BoardList 처럼 풀 경로로 적어주세요 */}
                    <button 
                        className={activeTab === "board" ? styles.activeTab : ""} 
                        onClick={() => navigate("/Community/BoardList")}
                    >게시판</button>
                    <button 
                        className={activeTab === "qna" ? styles.activeTab : ""} 
                        onClick={() => navigate("/Community/QnaList")}
                    >문의</button>
                    <button 
                        className={activeTab === "idea" ? styles.activeTab : ""} 
                        onClick={() => navigate("/Community/Idea")}
                    >아이디어 제안</button>
                    <button 
                        className={activeTab === "report" ? styles.activeTab : ""} 
                        onClick={() => navigate("/Community/Report")}
                    >신고</button>
                </div>

                <div className={styles.tabContent}>
                    {/* 자식 라우트들이 이 자리에 렌더링 */}
                    <Outlet /> 
                </div>
            </div>
        </Content>
    );
}

export default Community;
