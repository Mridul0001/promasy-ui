import React from 'react';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import { FormHelperText, FormControl, FormControlLabel, Switch } from '@mui/material';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import P from '../../assets/P.png';
import { IconButton, InputAdornment } from '@mui/material';
import useAuth from '../helpers/Login';
import { sha512 } from 'js-sha512';
import { LoadingButton } from '@mui/lab';
import styles from './Home.module.scss';
import { Login } from '@mui/icons-material';

const Home = () => {
  const [values, setValues] = React.useState({
    email:"",
    password:"",
    showPassword:false,
    showForgotPassword: false
  });

  const {login} = useAuth();

  const [error, setError] = React.useState({
    hasError:false,
    errorText:""
  });

  const [loading,setLoading] = React.useState(false);

  const handleChange = (props) => (event) => {
    setError({hasError:false,errorText:""});
    setValues({...values, [props]:event.target.value})
  }
  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  }

  const setLoginParams = (data) => {
    localStorage.setItem("isAdmin",data.admin);
    localStorage.setItem("user",data.user);
    localStorage.setItem("userId",data.userId);
    localStorage.setItem("auth",true);
  }
  const handleUserLogin = (event) => {
    event.preventDefault();
    setLoading(true);
    //TODO: check accuracy of password and email
    var encryptedPass = sha512(values.password);
    login(values.email,encryptedPass).then((res)=>{
      setLoginParams(res.data);
      setLoading(false);
      window.location = "/dashboard";
    },(error)=>{
      setLoading(false);
      setError({
        hasError:true,
        errorText:error.error
      })
    });
  }

  const handleForgotPassword = () => {
    setValues({
      ...values,
      email:"",
      password:"",
      showForgotPassword: !values.showForgotPassword
    })
  }

  const sendForgotPasswordEmail = () => {
    //set loading
  }

  return values.showForgotPassword?(
    <div className={styles.login} data-testid="login">
      <div className={styles.logoContainer}><img src={P} alt="promasy-logo" width="64px" height="64px" className={styles.logo}/></div>
      <TextField className={styles.loginFields} onChange={handleChange('email')} value={values.email} fullWidth label="Email" id="login-email" />
      <LoadingButton loading={loading} loadingPosition="start" className={styles.loginFields} fullWidth variant="contained" disabled={false} onClick={sendForgotPasswordEmail}>Proceed</LoadingButton>
      <button className={styles.textButton} onClick={handleForgotPassword}>Click to login</button>
    </div>
  ):(
    <div className={styles.login} data-testid="login">
      <div className={styles.logoContainer}><img src={P} alt="promasy-logo" width="64px" height="64px" className={styles.logo}/></div>
      <form onSubmit={handleUserLogin} className={styles.loginForm}>
        <FormControl
          error={error.hasError}
          variant="standard"
          className={styles.loginForm}
        >
          <TextField required className={styles.loginFields} onChange={handleChange('email')} value={values.email} fullWidth label="Email" id="login-email" />
          <TextField required className={styles.loginFields} type={values.showPassword ? 'text' : 'password'} onChange={handleChange('password')} value={values.password} fullWidth label="Password" id="login-password" 
            InputProps={{endAdornment:
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {values.showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }}
          />
          <FormHelperText>{error.errorText}</FormHelperText>
          <LoadingButton loading={loading} loadingPosition="start" startIcon={<Login />} className={styles.loginFields} fullWidth variant="contained" disabled={false} type="submit">Login</LoadingButton>
        </FormControl>
      </form>
      <button className={styles.textButton} onClick={handleForgotPassword}>Forgot Password?</button>
    </div>
  );
}

Home.propTypes = {};

Home.defaultProps = {};

export default Home;
