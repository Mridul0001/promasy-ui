import React from 'react';
import styles from './Banner.module.scss';
import P from '../../assets/P.png';
import { Alert, ClickAwayListener, Collapse, Fade, IconButton, Popper, TextField, Tooltip } from '@mui/material';
import { Logout } from '@mui/icons-material';
import { Box } from '@mui/system';
import { LoadingButton } from '@mui/lab';
import  emailjs from 'emailjs-com';
import axios from 'axios';
import { logout } from '../helpers/Login';

const CustomPopper = ({open, displayUserPopup, sendLoginLink, anchorEl, emailSentSuccess, templateParams, setTemplateParams, loading, CURRENTUSER}) => {
  const handleEmailChange = (event) =>{
    setTemplateParams({
      to_email:event.target.value,
      message:""
    })
  }

  return (
  <ClickAwayListener onClickAway={displayUserPopup}>
    <Popper 
      open={open} 
      anchorEl={anchorEl} 
      transition 
      placement="bottom-end"> 
      {({ TransitionProps }) => (
        <Fade {...TransitionProps}>
          <Box className={styles.userAddPopup}>
            <Collapse in={emailSentSuccess}>
              <Alert>Email sent successfully</Alert>
            </Collapse>
            <form className={styles.newUserEmailLink} onSubmit={sendLoginLink}>
              <TextField disabled={loading} className={styles.sendLoginLinkField} required label="Enter user email" value={templateParams.to_email} onChange={handleEmailChange}/>
              <LoadingButton loading={loading} loadingPosition='start' className={styles.sendLoginLinkButton} type='submit' variant='contained'>Send login link</LoadingButton>
            </form>
          </Box>
        </Fade>
      )}
    </Popper>
  </ClickAwayListener>
  )
}
const Banner = () => { 
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [emailSentSuccess, setEmailSentStatus] = React.useState(false);
  const [templateParams, setTemplateParams] = React.useState({
    to_email:"",
    message:""
  });
  const CURRENTUSER = {isAdmin:localStorage.getItem("isAdmin"),user:localStorage.getItem("user"),userId:localStorage.getItem("userId")};
  const[loading, setLoading] = React.useState(false);
  const displayUserPopup = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((previousOpen) => !previousOpen);
  }

  const sendLoginLink = (event) => {
    event.preventDefault();
    setLoading(true);
    const body = {
      email:templateParams.to_email,
      adminId:CURRENTUSER.userId
    }
    const template = {...templateParams};
    const url = process.env.REACT_APP_PROMASY_API_URL;
    const SERVICE_ID = process.env.REACT_APP_SERVICE_ID;
    const TEMPLATE_ID = process.env.REACT_APP_TEMPLATE_ID;
    const USER_ID = process.env.REACT_APP_USER_ID;
    const ui_url = process.env.REACT_APP_PROMASY_UI_URL;
    axios.post(url+"v1/adduser", body).then((res)=>{
      template.message = ui_url+"/signup?referral="+CURRENTUSER.userId+"&currUser="+res.data.userId;
      emailjs.send(SERVICE_ID,TEMPLATE_ID,template,USER_ID).then((res)=>{
        setEmailSentStatus(true);
        setTemplateParams({
          to_email:"",
          message:""
        })
        setInterval(()=>{
          setEmailSentStatus(false);
        },1500);
        setLoading(false);
      },
      (error)=>{
        console.error(error.text);
      })
    },(error)=>{
      console.log(error);
      setLoading(false);
    })
  }

  const handleLogout = () => {
    logout();
  }

  return (
    <div className={styles.Banner} data-testid="Banner">
      <div className={styles.logoContainer}><img src={P} alt="promasy-logo" width="28px" height="28px" className={styles.logo}/></div>
        <nav className={styles.navbar}>
          {CURRENTUSER.isAdmin==='true'?<button className={styles.textButton} onClick={displayUserPopup}>Add User</button>:<span></span>}
          <Tooltip title="Logout">
            <IconButton aria-label="logout" size="large" onClick={handleLogout}>
              <Logout />
            </IconButton>
          </Tooltip>
        </nav>
        {
          open && <CustomPopper {...{open, displayUserPopup, sendLoginLink, anchorEl, emailSentSuccess, templateParams, setTemplateParams, loading, CURRENTUSER}} />
        }
    </div>
  );
}

Banner.propTypes = {};

Banner.defaultProps = {};

export default Banner;
