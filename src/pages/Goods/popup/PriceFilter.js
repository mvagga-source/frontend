import React, { useState, useRef, useEffect } from "react";
import styles from "./PriceFilter.module.css";
import { NumberInput } from "../../../components/input/Input";
import { SaveBtn } from "../../../components/button/Button";

function PriceFilter({ minPrice, setMinPrice, maxPrice, setMaxPrice }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // 필터 활성화 여부 (아이콘 색상 제어용)
  const isApplied = minPrice !== "" || maxPrice !== "";

  useEffect(() => {
    const handleClickOutside = (e) => {
      // ref 내부 클릭이 아닐 때만 닫기
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleApply = (e) => {
    e.stopPropagation(); // 이벤트 전파 방지
    setOpen(false);
  };

  const handleReset = (e) => {
    e.stopPropagation();
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <div className={styles.priceFilterWrapper} ref={ref}>
      <button
        type="button"
        className={`${styles.priceFilterIconBtn} ${open ? styles.activeFilter : ""} ${isApplied ? styles.hasValue : ""}`}
        onClick={() => setOpen(!open)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill={isApplied ? "#3182f6" : "#8b95a1"} // 활성화 시 파란색, 비활성 시 회색
          viewBox="0 0 16 16"
        >
          <path d="M6 10.5v4l4-2v-2.5H6zm-5-7v1h16V3H1zm2 4v1h12V7H3z" />
        </svg>
      </button>

      {open && (
        <div className={styles.priceFilterPopup}>
          <span className={styles.popupTitle}>가격대 설정</span>
          <div className={styles.priceInputs}>
            <NumberInput
              placeholder="최소 가격"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <span className={styles.tilde}>~</span>
            <NumberInput
              placeholder="최대 가격"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
          
          {/* 💡 버튼들을 감싸는 컨테이너 추가 */}
          <div className={styles.popupActionButtons}>
            <button className={styles.applyBtn} onClick={handleApply}>적용</button>
            <button className={styles.resetBtn} onClick={handleReset}>초기화</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PriceFilter;