import styles from "./Input.module.css";

export const SaveInput = ({ className, ...props }) => {
  return (
    <input
      type="text"
      className={`${styles.neonInput} ${className || ""}`}
      {...props}
    />
  );
};

export const SearchInput = ({ className, ...props }) => {
  return (
    <SaveInput {...props} placeholder="검색어를 입력하세요."/>
  );
};

// 통합 검색바 (돋보기 포함)
export const SearchBar = ({ children, className, onSearch, ...props }) => {
  return (
    <div className={`${styles.searchBarContainer} ${className || ""}`}>
      {children}
      <div className={styles.inputWrapper}>
        <div className={styles.searchIcon}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00f3ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        <input type="text" className={styles.barInput} {...props} />
      </div>
    </div>
  );
};

// Input.js 에 추가
export const NumberInput = ({ className, ...props }) => {
  return (
    <input
      type="number"
      // 한글/영문 입력 시 즉시 숫자가 아닌 문자를 제거하여 잔상을 방지
      // 나중에 -값 등으로 변경하고 싶은경우 NumberInput에 다시 onInput등록
      // 불러오는데서 이벤트만 없애고 싶으면 onInput=undefined 넘겨서 적용(props로 마지막에 받아서 마지막값이 적용)
      onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, "")}
      className={`${styles.neonInput} ${styles.numberInput} ${className || ""}`}
      {...props}
    />
  );
};