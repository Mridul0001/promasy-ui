import React from 'react';
import styles from './Banner.module.scss';
import P from '../../assets/P.png';
import CURRENTUSER from '../../global/GlobalVars';
import { Fade, IconButton, Popper, Tooltip } from '@mui/material';
import { Logout } from '@mui/icons-material';
import { Box } from '@mui/system';
const Banner = () => { 
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const displayUserPopup = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((previousOpen) => !previousOpen);
  }
  return (
    <div className={styles.Banner} data-testid="Banner">
      <div className={styles.logoContainer}><img src={P} alt="promasy-logo" width="28px" height="28px" className={styles.logo}/></div>
      <nav className={styles.navbar}>
        {CURRENTUSER.isAdmin?<button className={styles.textButton} onClick={displayUserPopup}>Add User</button>:<span></span>}
        <Tooltip title="Logout">
          <IconButton aria-label="logout" size="large" >
            <Logout />
          </IconButton>
        </Tooltip>
      </nav>
      <Popper open={open} anchorEl={anchorEl} transition placement="bottom-end"> 
        {({ TransitionProps }) => (
          <Fade {...TransitionProps}>
            <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }}>
              The content of the Popper.
            </Box>
          </Fade>
        )}
      </Popper>
    </div>
  );
}

Banner.propTypes = {};

Banner.defaultProps = {};

export default Banner;
