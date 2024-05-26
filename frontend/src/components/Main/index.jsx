import styles from "./styles.module.css";

const Main = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <div className={styles.main_container}>
      <header className={styles.header}>
        <h1 className={styles.logo}>Logo</h1>
        <nav className={styles.navbar}>
          <ul className={styles.nav_links}>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
          <button className={styles.white_btn} onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </header>

      <main className={styles.content}>
        <h2>Welcome to the Main Page</h2>
        <p>This is the content of the main page.</p>
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2023 Your Company. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Main;