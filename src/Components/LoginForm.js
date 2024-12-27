import React, { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "../useAuth";

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false); 
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log('ログイン情報：', {email, password});
      setIsLoading(true);
      setError(null);

      const controller = new AbortController();
      const signal = controller.signal;

      try {
        const response = await login({ email, password }, signal);
        const { token, redirectUrl, message } = response;
        console.log("login(data.token, data.user): ", response);

        if (message != null) {
          setError(message);
          return;
        }
        if (!token) {
          setError("トークンまたはリダイレクトURLが不正です");
          console.log('tokenエラー');
          return;
        }

        console.log('sessionStorage:before');
        sessionStorage.setItem('user', JSON.stringify(response));
        console.log('sessionStorage:after');
        const destination = location.state?.form?.pathname || redirectUrl;
        navigate(destination, { replace: true });
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Fetch aborted');
        } else {
          console.error(error);
          setError(error);
        }
      } finally {
        setIsLoading(false);
        controller.abort();
      }
    };
    return (
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">メールアドレス:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">パスワード:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">ログイン</button>
      </form>  );
  }
  
  export default LoginForm;
  