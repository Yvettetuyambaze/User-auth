import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { GoogleLogin } from 'react-google-login';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import styles from "./styles.module.css";

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:8080/api/auth";
      const { data: res } = await axios.post(url, data);
      localStorage.setItem("token", res.data);
      window.location = "/";
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setError(error.response.data.message);
      }
    }
  };

  const handleGoogleSuccess = async (response) => {
    try {
      const tokenId = response.tokenId;
      const res = await axios.post('http://localhost:8080/api/auth/google', {
        token: tokenId,
      });
      localStorage.setItem('token', res.data.data);
      window.location = '/';
    } catch (error) {
      console.log(error);
      setError('Failed to authenticate with Google');
    }
  };

  const handleGoogleFailure = (error) => {
    console.log(error);
    setError('Failed to authenticate with Google');
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  return (
    <div className={styles.login_container}>
      <div className={styles.login_form_container}>
        <div className={styles.left}>
          <h2>Login with Google</h2>
          <GoogleLogin
            clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
            buttonText="Log in with Google"
            onSuccess={handleGoogleSuccess}
            onFailure={handleGoogleFailure}
            cookiePolicy={'single_host_origin'}
            className={styles.google_btn}
          />
          <span>OR</span>
          <form className={styles.form_container} onSubmit={handleSubmit}>
            <h2>Login to Your Account</h2>
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={data.email}
              required
              className={styles.input}
            />
            <div className={styles.password_input}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                onChange={handleChange}
                value={data.password}
                required
                className={styles.input}
              />
              <button
                type="button"
                className={styles.password_toggle}
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {error && <div className={styles.error_msg}>{error}</div>}
            <button type="submit" className={styles.green_btn}>
              Sign In
            </button>
          </form>
        </div>
        <div className={styles.right}>
          <h1>New Here?</h1>
          <Link to="/signup">
            <button type="button" className={styles.white_btn}>
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;