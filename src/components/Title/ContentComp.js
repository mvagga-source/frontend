import Title from "./TitleComp";
import styles from './Title.module.css';

// Content.js
export default function Content({TitleName, children}) {
  return (
    <div className={styles.mainContainer}> {/* 여기에 styles.mainContainer를 빼서 제목만 배경을 가지게 합니다. */}
      <Title>{TitleName}</Title> 
      {children}
    </div>
  );
}