import styles from "./LoadingScreen.module.css";

const LoadingScreen = () => {
    return (
        <>
        <div className={styles.wrapper}>
            <div className={styles.loaderContainer}>
                <div className={styles.doubleSpinner}></div>
                <div className={styles.text}>Loading...</div>
            </div>
        </div>
        </>
    );
};

export default LoadingScreen;