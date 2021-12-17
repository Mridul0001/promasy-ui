import React, { useEffect } from 'react';
import styles from './Project.module.scss';
import { Alert, Button, CircularProgress, Collapse, Fade, FormControl, IconButton, InputLabel, LinearProgress, ListItem, ListItemText, MenuItem, Popper, Select, TextField, Tooltip } from '@mui/material';
import { Add, Close, Create, Delete, Edit, Save } from '@mui/icons-material';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box } from '@mui/system';
import { FixedSizeList } from 'react-window';
import axios from 'axios';
import STATUSES from '../../global/GlobalVars';

const CURRENTUSER = {isAdmin:localStorage.getItem("isAdmin"),user:localStorage.getItem("user"),userId:localStorage.getItem("userId")};
const CustomPopup = ({open,anchorEl,taskSavedSuccess,addNewTask,members,statuses}) => {
  const [taskDetails, setTaskDetails] = React.useState({
    assignedUser:"",
    currStatus:"",
    title:"",
    userId:0
  });

  const handleAddTaskChange = (props) => (event) => {
    setTaskDetails({...taskDetails,[props]:event.target.value})
  }

  const handleStatusChange = (event) => {
    setTaskDetails({...taskDetails,currStatus:event.target.value});
  }

  const handleUserChange = (event) =>{
    setTaskDetails({...taskDetails,assignedUser:event.target.value.name,userId:event.target.value.userId});
  }
  return (
    <Popper open={open} anchorEl={anchorEl} transition placement="bottom-end">
      {({ TransitionProps }) => (
        <Fade {...TransitionProps}>
          <Box className={styles.addTaskPopup}>
            <Collapse in={taskSavedSuccess}>
              <Alert>Task saved successfully</Alert>
            </Collapse>
            <form className={styles.addTaskForm} onSubmit={addNewTask(taskDetails)}>
              <TextField fullWidth required className={styles.addTaskSelect} label="Task title" value={taskDetails.title} onChange={handleAddTaskChange('title')}/>
              <FormControl fullWidth className={styles.addTaskSelect}>
                <InputLabel id="select-assigned">Assigned To</InputLabel>
                <Select required labelId="select-assigned" label="Assigned to" onChange={handleUserChange} MenuProps={{ PaperProps: { sx: { maxHeight: 150 } } }}>
                  {
                    members.map((member)=>{
                      return (
                        <MenuItem value={member}>{member.name}</MenuItem>
                      )
                    })
                  }
                </Select>
              </FormControl>
              <FormControl fullWidth className={styles.addTaskSelect}>
                <InputLabel id="select-status">Status</InputLabel>
                <Select required labelId="select-status" label="Status" value={taskDetails.currStatus} onChange={handleStatusChange} MenuProps={{ PaperProps: { sx: { maxHeight: 150 } } }}>
                  {
                    statuses.map((status)=>{
                      return (<MenuItem value={status}>{status}</MenuItem>)
                    })
                  }
                </Select>
              </FormControl>
              <Button className={styles.saveTaskButton} type='submit' variant='contained'>Save</Button>
            </form>
          </Box>
        </Fade>
      )}
    </Popper>)
}
const RenderRow = (props) => {
  const { index,  style, data } = props;
  const [isEditing, setEditing] = React.useState(false);
  const [taskDetails, setTaskDetails] = React.useState({
    assignedUser:data.tasks[index].assignedUser,
    currStatus:data.tasks[index].currStatus,
    title:data.tasks[index].title,
    userId:data.tasks[index].userId
  });

  const editTask = () => {
    setTaskDetails({
      assignedUser:data.tasks[index].assignedUser,
      currStatus:data.tasks[index].currStatus,
      title:data.tasks[index].title,
      userId:data.tasks[index].userId
    });
    setEditing(!isEditing);
  }

  const handleTaskChange = (props) => (event) => {
    setTaskDetails({...taskDetails,[props]:event.target.value});
  }
  
  const handleUserChange = (event) => {
    setTaskDetails({...taskDetails,assignedUser:event.target.value.name,userId:event.target.value.userId});
  }

  const updateTask = (props,index) => (event) =>{
    event.preventDefault();
    data.editTask(props,index).then((res)=>{
      setEditing(!isEditing)
    })
  }
  const editable = (CURRENTUSER.isAdmin==='true' || CURRENTUSER.user===data.tasks[index].assignedUser) 
  return (
    <div key={index}>
      <ListItem
        className={styles.taskListItem}
        key={index}
        style={style}
        component="div" 
        disablePadding 
        secondaryAction={
          isEditing?<div>
          <IconButton type="submit" form="task-update-form" edge="start" aria-label="save">
            <Save/>
          </IconButton>
          <IconButton edge="end" aria-label="close" onClick={editTask}>
            <Close />
          </IconButton>
        </div>:<div>
          <IconButton disabled={!editable} edge="start" aria-label="edit" onClick={editTask}>
            <Edit />
          </IconButton>
          <IconButton disabled={!editable} edge="end" aria-label="delete" onClick={()=>data.deleteTask(index)}>
            <Delete />
          </IconButton>
        </div>
        }>
        {
          !isEditing?<span className={styles.listItemsContainer}>
            <span className={styles.taskTitle} >{taskDetails.title}</span>
            <span className={styles.assignedTo} >{taskDetails.assignedUser}</span>
            <span className={styles.status} >{taskDetails.currStatus}</span>
          </span>:<span className={styles.listItemsContainer}>
            <form id="task-update-form" onSubmit={updateTask(taskDetails,index)}>
              <TextField required variant="standard" className={styles.taskTitle} value={taskDetails.title} onChange={handleTaskChange('title')}></TextField>
              <Select required className={styles.assignedTo} variant="standard" label="Assigned To" onChange={handleUserChange}>
                {
                  data.members.map((member)=>{
                    return (<MenuItem value={member}>{member.name}</MenuItem>)
                  })
                }
              </Select>
              <Select required className={styles.status} variant="standard" label="Status" onChange={handleTaskChange('currStatus')} value={taskDetails.currStatus}>
                {
                  data.statuses.map((status)=>{
                    return (<MenuItem value={status}>{status}</MenuItem>)
                  })
                }
              </Select>
            </form>
          </span>
        } 
      </ListItem>
    </div>
  );
}

const Project = ({isNew, handleCloseWindow, members, project, addNewProject}) => {
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [newProject, setProject] = React.useState({
    name:"",
    description:""
  });
  const statuses = STATUSES;
  const [tasks,setTasks] = React.useState([]);
  const [noTask,setNoTask] = React.useState(false);
  const [fetchingProject, setProjectLoading] = React.useState(true);
  const [taskUpdating, setTaskUpdating] = React.useState({
    text:"",
    status:false
  })
  const url = process.env.REACT_APP_PROMASY_API_URL;
  useEffect(()=>{
    setProjectLoading(true);
    axios.get(url+"v1/tasks/"+project.projectId).then((res)=>{
      setTasks([...res.data]);    
    },(error)=>{
      setProjectLoading(false);
      console.error(error);
    });
  }, [project]);

  useEffect(()=>{
    if(tasks.length===0){
      setNoTask(true);
    }else{
      setNoTask(false);
    }
    setProjectLoading(false);
  },[tasks])

  const [projectSavedSuccess, setProjectSavedStatus] = React.useState(false);

  const [taskSavedSuccess, setTaskSavedStatus] = React.useState(false);

  const displayTaskPopup = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((previousOpen) => !previousOpen);
  }

  const deleteTask = (i) => {
    axios.delete(url+"v1/deletetask/"+tasks[i].taskId).then((res)=>{
      let temp = [...tasks];
      temp.splice(i,1);
      setTasks([...temp]);
      setTaskUpdating({text:"Task deleted successfully",status:true});
      setInterval(()=>{
        setTaskUpdating({text:"",status:false});
      },1500)
    },(error)=>{console.log(error)})
  }

  const editTask = (props, index) => {
    props.projectId=project.projectId;
    props.taskId=tasks[index].taskId;
    console.log(props);
    return axios.put(url+"v1/updatetask", props).then((res)=>{
      let temp = [...tasks];
      temp[index].taskId = res.data.taskId;
      temp[index].projectId = res.data.projectId;
      temp[index].userId = res.data.userId;
      temp[index].assignedUser = res.data.assignedUser;
      temp[index].title = res.data.title;
      temp[index].currStatus = res.data.currStatus;
      setTasks([...temp]);
    },(error)=>{console.log(error)})
  }

  const [isLoading, setLoading] = React.useState(false);

  const createNewProject = (event) => {
    event.preventDefault();
    setLoading(true);
    const body = {
      title:newProject.name,
      description:newProject.description,
      userId:CURRENTUSER.userId
    }
    axios.post(url+"v1/addproject", body).then((res)=>{
      console.log(res);
      addNewProject(res.data);
      setLoading(false);
      setProject({
        name:"",
        description:""
      });
      setProjectSavedStatus(true);
      setInterval(()=>{setProjectSavedStatus(false)},1500)
    },(error)=>{
      console.error(error);
      setLoading(false);
    });
  }

  const addNewTask = (props) => (event) => {
    event.preventDefault();
    setTaskSavedStatus(true);
    props.projectId=project.projectId;
    axios.post(url+"v1/addtask", props).then((res)=>{
      let temp = [...tasks];
      temp.push(res.data);
      setTasks([...temp]);
      setInterval(()=>{
        setTaskSavedStatus(false);
      },2000);
    })
  }

  const handleNewProjectChange = (props) => (event) => {
    setProject({...newProject,[props]:event.target.value});
  }

  return isNew?(
    <div className={styles.addNewProject}>
      <Collapse className={styles.projectSaveStatusDialog} in={projectSavedSuccess}>
        <Alert>Project added successfully</Alert>
      </Collapse>
      <Tooltip title="Close">
        <IconButton className={styles.closeButton} onClick={handleCloseWindow}>
          <Close/>
        </IconButton>
      </Tooltip>
      <form onSubmit={createNewProject} className={styles.newProjectForm}>
        <FormControl className={styles.newProjectFormInner}>
          <TextField required className={styles.newProjectFields} fullWidth label="Project Name" value={newProject.name} onChange={handleNewProjectChange("name")}></TextField>
          <TextField required className={styles.newProjectFields} fullWidth multiline minRows={7} maxRows={10} label="Project Description" value={newProject.description} onChange={handleNewProjectChange("description")}></TextField>
          <LoadingButton loadingPosition="start" loading={isLoading} className={styles.createNewProject} startIcon={<Create/>} type="submit" variant="outlined" color="secondary">Create</LoadingButton>
        </FormControl>
      </form>
    </div>
  ):
  (
    <div className={styles.displayProjects}>
      {
        fetchingProject?<div className={styles.loader}>
          <CircularProgress className={styles.progressBar} color="secondary"/>
        </div>
        :<div>
          <Collapse className={styles.projectSaveStatusDialog} in={taskUpdating.status}>
            <Alert>{taskUpdating.text}</Alert>
          </Collapse>
          <div className={styles.projectDisplayHeader}>
            <div className={styles.projectTitle}><h2>{project.title}</h2></div>
            <div className={styles.addTaskButton}><Button startIcon={<Add/>} variant="outlined" color="secondary" onClick={displayTaskPopup}>Add task</Button></div>
            {
              open && <CustomPopup {...{open,anchorEl,displayTaskPopup,taskSavedSuccess,addNewTask,members,statuses}}/>
            }
          </div>
          <div className={styles.taskList}>
            <div className={styles.tasksHeader}>
              <span className={styles.taskHeaderTitle}><strong>TASK TITLE</strong></span>
              <span className={styles.taskHeaderUser}><strong>ASSIGNED USER</strong></span>
              <span className={styles.taskHeaderStatus}><strong>STATUS</strong></span>
            </div>
            {
              noTask?<div className={styles.noTaskMessage}>No tasks to display. Please add one</div>:<FixedSizeList itemCount={tasks.length} height={350} itemSize={46} overscanCount={5} itemData={{tasks:tasks, members:members, statuses:statuses, deleteTask:deleteTask,editTask:editTask}}>
              {RenderRow}
            </FixedSizeList>
            }
          </div>
        </div>
      }
    </div>
  )
}

Project.propTypes = {};

Project.defaultProps = {};

export default Project;
