import styles from './Title.module.css';

const Title = ({ children }) => {
  return (
      <div>
      <header className={styles.mainHead}>
        <div className={styles.mainTitle}>
          <h1>{children || 'Title입력'}</h1>
        </div>
      </header>
      </div>
  );
}

export default Title;
