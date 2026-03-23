import React from "react";
import styles from "../../Board/boardComponent/BoardContent.module.css";

// React.memo로 bcontent의 값이 변경될 때만 리렌더링되게 함(useState렌더링 방지)
const GoodsContent = React.memo(({ content }) => {
  return (
    <div 
      className={styles.contentBox}
      dangerouslySetInnerHTML={{ __html: content }} 
    />
  );
});

export default GoodsContent;