import React from 'react';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import { FormHelperText, FormControl } from '@mui/material';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import P from '../../assets/P.png';
import { IconButton, InputAdornment } from '@mui/material';
import useAuth from '../helpers/Login';
import { sha512 } from 'js-sha512';
import { LoadingButton } from '@mui/lab';
import styles from './Signup.module.scss';
import { Login } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const useQueryParam = () => {
  const {search} = useLocation();
  return React.useMemo(()=> new URLSearchParams(search), [search]);
}

const Signup = () => {
  const query = useQueryParam();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState({
    hasError:false,
    errorText:""
  });
  const [values, setValues] = React.useState({
    name:"",
    password:"",
    confirmPassword:""
  });

  const [passwordVisibility, setPassVisibility] = React.useState({
    password:false,
    confirmPassword:false
  });

  const url = process.env.REACT_APP_PROMASY_API_URL;

  const setLoginParams = (data) => {
    localStorage.setItem("isAdmin",data.admin);
    localStorage.setItem("user",data.user);
    localStorage.setItem("userId",data.userId);
    localStorage.setItem("auth",true);
  }

  const handleUserSignup = (event) => {
    event.preventDefault();
    if(values.password!==values.confirmPassword){
      setError({hasError:true,errorText:"Password doesn't match"});
    }else{
      setError({hasError:false,errorText:""});
      setLoading(true);
      let adminId = query.get('referral');
      let userId = query.get('currUser');
      const encryptedPass = sha512(values.password);
      const body = {
        adminId:adminId,
        userId:userId,
        name:values.name,
        password:encryptedPass
      }
      axios.post(url+"v1/signup", body).then((res)=>{
        setLoginParams(res.data);
        setLoading(false);
        window.location = "/dashboard";
      },(error)=>{
        setLoading(false);
        setError({hasError:true,errorText:error});
      })
    }
  }

  const handleChange = (props) => (event) => {
    setError({hasError:false,errorText:""});
    setValues({...values,[props]:event.target.value});
  }

  const handleClickShowPassword = (props) => (event) =>{
    setPassVisibility({...passwordVisibility,[props]:!passwordVisibility[props]})
  }

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  }

  return (
    <div className={styles.login} data-testid="login">
        <div className={styles.logoContainer}><img src={P} alt="promasy-logo" width="64px" height="64px" className={styles.logo}/></div>
        <form onSubmit={handleUserSignup} className={styles.loginForm}>
          <FormControl
            error={error.hasError}
            variant="standard"
            className={styles.loginForm}
          >
            <TextField required className={styles.loginFields} onChange={handleChange('name')} value={values.name} fullWidth label="Name" id="login-name" />
            <TextField required className={styles.loginFields} type={passwordVisibility.password ? 'text' : 'password'} onChange={handleChange('password')} value={values.password} fullWidth label="Password" id="login-password" 
              InputProps={{endAdornment:
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword('password')}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {passwordVisibility.password ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }}
            />
            <TextField required className={styles.loginFields} type={passwordVisibility.confirmPassword ? 'text' : 'password'} onChange={handleChange('confirmPassword')} value={values.confirmPassword} fullWidth label="Confirm Password" id="login-password" 
              InputProps={{endAdornment:
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword('confirmPassword')}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {passwordVisibility.confirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }}
            />
            <FormHelperText>{error.errorText}</FormHelperText>
            <LoadingButton loading={loading} loadingPosition="start" startIcon={<Login/>} className={styles.loginFields} fullWidth variant="contained" disabled={false} type="submit">Sign UP</LoadingButton>
          </FormControl>
        </form>
        </div>
  );
}

Signup.propTypes = {};

Signup.defaultProps = {};

export default Signup;
