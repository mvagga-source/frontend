import React from "react";
import styles from "./GoodsReviewSort.module.css";

/**
 * 굿즈 답글 목록 정렬
 * @param {*} param0 
 * @returns 
 */
function GoodsReviewSort({ totalCount, sortType, onSortChange }) {
  return (
    <div className={styles.listHeader}>
      <h3 className={styles.listTitle}>
        전체 리뷰 <span>({totalCount})</span>
      </h3>

      <div className={styles.sortOptions}>
        <button
          className={`${styles.sortBtn} ${sortType === "DESC" ? styles.activeSort : ""}`}
          onClick={() => onSortChange("DESC")}
        >
          최신순
        </button>
        <div className={styles.divider}></div>
        <button
          className={`${styles.sortBtn} ${sortType === "like" ? styles.activeSort : ""}`}
          onClick={() => onSortChange("like")}
        >
          도움순
        </button>
        <div className={styles.divider}></div>
        <button
          className={`${styles.sortBtn} ${sortType === "rating" ? styles.activeSort : ""}`}
          onClick={() => onSortChange("rating")}
        >
          평점순
        </button>
      </div>
    </div>
  );
}

export default GoodsReviewSort;