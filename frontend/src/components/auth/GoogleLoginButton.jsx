// components/auth/GoogleLoginButton.jsx
const GoogleLoginButton = () => {
    const handleGoogleLogin = () => {
      window.location.href = 'http://localhost:8080/oauth2/authorization/google';
    };
  
    return (
      <button onClick={handleGoogleLogin} style={styles.button}>
        <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" style={styles.icon} />
        Continue with Google
      </button>
    );
  };
  
  const styles = {
    button: {
      backgroundColor: '#fff',
      color: '#000',
      border: '1px solid #ccc',
      borderRadius: '5px',
      padding: '10px 20px',
      cursor: 'pointer',
      fontSize: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginTop: '1rem'
    },
    icon: {
      width: '20px',
      height: '20px'
    }
  };
  
  export default GoogleLoginButton;
  