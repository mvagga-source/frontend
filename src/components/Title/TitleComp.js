import styles from './Title.module.css';
import bg from "../../assets/images/singer_bg.png";

const Title = ({ children }) => {
  return (
      <div>
        <header className={styles.mainHead} style={{
                    backgroundImage: `url(${bg})`,
                    backgroundSize: "auto 100%",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "70% 0"
                    }}>
          <div className={styles.mainTitle}>
            <h1>{children || 'Title입력'}</h1>
          </div>
        </header>
      </div>
  );
}

export default Title;
