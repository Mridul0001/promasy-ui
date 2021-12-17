import React, { useEffect } from 'react';
import styles from './Dashboard.module.scss';
import Banner from '../Banner/Banner';
import { Button, CircularProgress, Divider, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { Add } from '@mui/icons-material';
import Project from '../Project/Project';
import { FixedSizeList } from 'react-window';
import axios from 'axios';

function renderRow(props) {
  const { index,  style, data} = props;
  return (
    <ListItem style={style} key={index} component="div" disablePadding>
      <ListItemButton selected={index===data.selected} onClick={() => data.onClick(index)}>
        <ListItemText primary={data.projects[index].title} />
      </ListItemButton>
    </ListItem>
  );
}


const Dashboard = () => {
  const [projects, setLists] = React.useState([]);
  const [projectsLoading, setProjectsLoading] = React.useState(true);
  const CURRENTUSER = {isAdmin:localStorage.getItem("isAdmin"),user:localStorage.getItem("user"),userId:localStorage.getItem("userId")};
  const [members,setMembers] = React.useState([]);
  const [selectedProject, setProject] = React.useState({});
  const [newProjectWindow, setProjectWindow] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const url = process.env.REACT_APP_PROMASY_API_URL;
  useEffect(()=>{
    axios.get(url+"v1/associatedprojects/"+CURRENTUSER.userId).then((res)=>{
      setLists([...res.data]);
      axios.get(url+"v1/getusers/"+CURRENTUSER.userId+"/"+CURRENTUSER.user).then((resInternal)=>{
        setMembers([...resInternal.data]);
      },(error)=>{
        setProjectsLoading(false);
        console.log(error);
      })
    },(error)=>{
      setProjectsLoading(false);
      console.log(error);
    })
  }, []);

  useEffect(()=>{
    setProject({...projects[0]});
  }, [projects]);

  useEffect(()=>{
    setProjectsLoading(false);
  }, [selectedProject])

  const showProjectDesc = (i) => {
    setSelectedIndex(i);
    setProjectWindow(false);
  }

  const changeProject = (i) => {
    showProjectDesc(i);
    setProject(projects[i]);
  }

  const addNewProject = (newProject) => {
    let tempProjects = [...projects];
    tempProjects.push({projectId:newProject.projectId,title:newProject.title});
    setLists([...tempProjects]);
    showProjectDesc(0);
  }

  const switchProjectWindow = () => {
    setProjectWindow(!newProjectWindow);
  }

  return  (
    <div>
      <Banner />
      {
        projectsLoading ? <div className={styles.loader}>
          <CircularProgress className={styles.progressBar} color="secondary"/>
        </div>:<div className={styles.Dashboard}>
        <div className={styles.projects}>
          {CURRENTUSER.isAdmin==='true'?<Button disabled={newProjectWindow} className={styles.newProject} startIcon={<Add/>} variant="contained" onClick={switchProjectWindow}>New Project</Button>:""}
          <FixedSizeList itemCount={projects.length} height={400} itemSize={46} overscanCount={5} itemData={{projects:projects,onClick:changeProject,selected:selectedIndex}}>
            {renderRow}
          </FixedSizeList>
        </div>
        <div className={styles.projectDesc}>
          {
            projects.length===0 && !newProjectWindow?<div className={styles.nothingText}>Nothing to show here</div>:<Project isNew={newProjectWindow} handleCloseWindow={switchProjectWindow} members={members} project={selectedProject} addNewProject={addNewProject}></Project>
          }
        </div>
      </div>
      }
    </div>
  );
}

Dashboard.propTypes = {};

Dashboard.defaultProps = {};

export default Dashboard;
