import React from 'react';
import styles from './Dashboard.module.scss';
import Banner from '../Banner/Banner';
import { Button, Divider, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { Add } from '@mui/icons-material';
import CURRENTUSER from '../../global/GlobalVars';
import Project from '../Project/Project';
import { FixedSizeList } from 'react-window';

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
  const [projects, setLists] = React.useState([
    {
      title:"Project Title 1",
      projectId: 1
    },
    {
      title:"Project Title 2",
      projectId: 2
    },
    {
      title:"Project Title 3",
      projectId: 3
    },
    {
      title:"Project Title 4",
      projectId: 4
    }
  ]);

  const tasks = [
    {
      taskId:1,
      taskTitle:"Task 1",
      assignedTo: "Mridul",
      status: "In Progress"
    },
    {
      taskId:2,
      taskTitle:"Task 2",
      assignedTo: "Sahil",
      status: "In Progress"
    },
    {
      taskId:3,
      taskTitle:"Task 3",
      assignedTo: "Mridul",
      status: "In Progress"
    },
    {
      taskId:4,
      taskTitle:"Task 4",
      assignedTo: "Shray",
      status: "In Progress"
    }
  ]

  const members = ["Mridul","Sahil","Shray"];

  const statuses = ["Defined","In Progress","Completed"];

  const [selectedProject, setProject] = React.useState(projects[0]);

  const [newProjectWindow, setProjectWindow] = React.useState(false);

  const [fetchingProject, setProjectLoading] = React.useState(false);

  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const showProjectDesc = (i) => {
    setProjectLoading(true);
    setTimeout(()=>{
      setSelectedIndex(i);
      setProjectWindow(false);
      setProject(projects[i]);
      setProjectLoading(false);
    },3000)
  }

  const switchProjectWindow = () => {
    setProjectWindow(!newProjectWindow);
  }

  return  (
    <div>
      <Banner />
      <div className={styles.Dashboard}>
        <div className={styles.projects}>
          {CURRENTUSER.isAdmin?<Button disabled={newProjectWindow} className={styles.newProject} startIcon={<Add/>} variant="contained" onClick={switchProjectWindow}>New Project</Button>:""}
          <FixedSizeList itemCount={projects.length} height={400} itemSize={46} overscanCount={5} itemData={{projects:projects,onClick:showProjectDesc,selected:selectedIndex}}>
            {renderRow}
          </FixedSizeList>
        </div>
        <div className={styles.projectDesc}>
            <Project isNew={newProjectWindow} fetchingProject={fetchingProject} handleCloseWindow={switchProjectWindow} tasks={tasks} members={members} statuses={statuses} project={selectedProject}></Project>
        </div>
      </div>
    </div>
  );
}

Dashboard.propTypes = {};

Dashboard.defaultProps = {};

export default Dashboard;
