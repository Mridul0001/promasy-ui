import React from 'react';
import styles from './Project.module.scss';
import { Button, CircularProgress, Fade, FormControl, IconButton, ListItem, ListItemText, MenuItem, Popper, Select, TextField, Tooltip } from '@mui/material';
import { Add, Close, Create, Delete, Edit, Save } from '@mui/icons-material';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box } from '@mui/system';
import { FixedSizeList } from 'react-window';
import CURRENTUSER from '../../global/GlobalVars';

const RenderRow = (props) => {
  const { index,  style, data } = props;
  const [isEditing, setEditing] = React.useState(false);
  const [assignedUser, setNewAssigned] = React.useState(data.tasks[index].assignedTo);
  const [currStatus, setNewStatus] = React.useState(data.tasks[index].status);

  const editTask = () => {
    setEditing(!isEditing);
  }

  const changeTeamMember = (event) => {
    data.changeTaskUpdateStatus();
    setNewAssigned(event.target.value);
    data.tasks[index].assignedTo=event.target.value;
  }

  const changeStatus = (event) => {
    data.changeTaskUpdateStatus();
    setNewStatus(event.target.value);
    data.tasks[index].status=event.target.value;
  }
  const editable = (CURRENTUSER.isAdmin || CURRENTUSER.user===data.tasks[index].assignedTo) 
  return (
    <div>
      <ListItem
        className={styles.taskListItem}
        style={style} 
        key={index} 
        component="div" 
        disablePadding 
        secondaryAction={
          isEditing?<div>
          <IconButton edge="start" aria-label="save">
            <Save />
          </IconButton>
          <IconButton edge="end" aria-label="close" onClick={editTask}>
            <Close />
          </IconButton>
        </div>:<div>
          <IconButton disabled={!editable} edge="start" aria-label="edit" onClick={editTask}>
            <Edit />
          </IconButton>
          <IconButton disabled={!editable} edge="end" aria-label="delete">
            <Delete />
          </IconButton>
        </div>
        }>
        {
          !isEditing?<ListItemText className={styles.taskTitle} primary={data.tasks[index].taskTitle}></ListItemText>:<TextField variant="standard" className={styles.taskTitle} value={data.tasks[index].taskTitle}></TextField>
        }
        <Select disabled={!editable} className={styles.assignedTo} variant="standard" onChange={changeTeamMember} value={assignedUser}>
          {
            data.members.map((member)=>{
              return (<MenuItem value={member}>{member}</MenuItem>)
            })
          }
        </Select>
        <Select disabled={!editable} className={styles.status} variant="standard" label="Status" onChange={changeStatus} value={currStatus}>
          {
            data.statuses.map((status)=>{
              return (<MenuItem value={status}>{status}</MenuItem>)
            })
          }
        </Select>
      </ListItem>
    </div>
  );
}

const Project = ({isNew, handleCloseWindow, tasks, fetchingProject, members, project, statuses}) => {
  const [open, setOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [newProject, setProject] = React.useState({
    name:"",
    description:""
  })

  const [isTaskUpdated, setTaskUpdateStatus] = React.useState({value:false});
  const [originalTasks, setOriginalTasks] = React.useState([...tasks]);
  const displayTaskPopup = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((previousOpen) => !previousOpen);
  }

  const [isLoading, setLoading] = React.useState(false);

  const createNewProject = (event) => {
    setLoading(true);
    setTimeout(()=>{
      setLoading(false);
    },2000)

    event.preventDefault();
  }

  const handleNewProjectChange = (props) => (event) => {
    setProject({...newProject,[props]:event.target.value});
  }

  const cancelTaskUpdate = () => {
    setTaskUpdateStatus({value:false})
  }

  const changeTaskUpdateStatus = () => {
    setTaskUpdateStatus({value:true});
  }

  return isNew?(
    <div className={styles.addNewProject}>
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
          <div className={styles.projectDisplayHeader}>
            <div className={styles.projectTitle}><h2>{project.title}</h2></div>
            <div className={styles.addTaskButton}><Button startIcon={<Add/>} variant="outlined" color="secondary" onClick={displayTaskPopup}>Add task</Button></div>
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
          <div className={styles.taskList}>
            <FixedSizeList itemCount={tasks.length} height={350} itemSize={46} overscanCount={5} itemData={{tasks:tasks, originalTasks:originalTasks, members:members, statuses:statuses, changeTaskUpdateStatus:changeTaskUpdateStatus}}>
              {RenderRow}
            </FixedSizeList>
            {
              isTaskUpdated.value?<div className={styles.taskListBottomBar}>
              <LoadingButton loadingPosition="start" className={styles.taskUpdateButton} loading={isLoading} startIcon={<Save/>} variant="outlined" color="secondary">Save</LoadingButton>
              <Button startIcon={<Close/>} variant="outlined" onClick={cancelTaskUpdate}>Cancel</Button>
            </div>:""
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
