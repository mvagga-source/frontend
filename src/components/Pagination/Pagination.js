import React from 'react';
import styles from './Pagination.module.css';

// 서버에서 넘어오는 startPage, endPage를 추가로 받으면 더 좋습니다.
export const Pagination = ({ currentPage, totalPages, startPage = 1, endPage, onPageChange }) => {
    // 만약 startPage와 endPage가 props로 오지 않는다면 직접 계산 (10개 단위)
    const sPage = startPage;
    const ePage = endPage || totalPages;

    // 표시할 페이지 번호 배열 생성 (startPage ~ endPage)
    const pageNumbers = [];
    for (let i = sPage; i <= ePage; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className={styles.paginationWrapper}>
            
            {/* [<<] 처음 페이지 */}
            <button 
                className={`${styles.pageButton} ${styles.moveButton}`} 
                onClick={() => onPageChange(1)} 
                disabled={currentPage === 1}
            >
                &lt;&lt;
            </button>

            {/* [<] 이전 */}
            <button 
                className={styles.pageButton} 
                onClick={() => onPageChange(currentPage - 1)} 
                disabled={currentPage === 1}
            >
                &lt;
            </button>
            
            {/* 페이지 번호 리스트 */}
            {pageNumbers.map((num) => (
                <button 
                    key={num} 
                    className={`${styles.pageButton} ${currentPage === num ? styles.active : ''}`} 
                    onClick={() => onPageChange(num)}
                >
                    {num}
                </button>
            ))}

            {/* [>] 다음 */}
            <button 
                className={styles.pageButton} 
                onClick={() => onPageChange(currentPage + 1)} 
                disabled={currentPage === totalPages}
            >
                &gt;
            </button>

            {/* [>>] 마지막 페이지 */}
            <button 
                className={`${styles.pageButton} ${styles.moveButton}`} 
                onClick={() => onPageChange(totalPages)} 
                disabled={currentPage === totalPages}
            >
                &gt;&gt;
            </button>

        </div>
    );
};

export default Pagination;