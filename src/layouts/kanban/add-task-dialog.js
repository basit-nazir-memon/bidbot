import { useState } from "react"
import PropTypes from "prop-types"

// MUI imports
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Box,
  Snackbar,
  Alert,
} from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import SoftInput from "components/SoftInput"
import SoftBox from "components/SoftBox"
import SoftTypography from "components/SoftTypography"
import SoftButton from "components/SoftButton"
import { envConfig } from "env"
import axios from "axios"

export default function AddTaskDialog({ isOpen, onClose, onAddTask, columns, jobs, members }) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [columnId, setColumnId] = useState(columns[0]?.id || "")
  const [priority, setPriority] = useState("medium")
  const [date, setDate] = useState(null)
  const [assignee, setAssignee] = useState("")
  const [job, setJob] = useState({})
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [errorMsg, setError] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!title.trim()) return;
  
    const newTask = {
      title,
      description,
      status: columnId,
      priority,
      dueDate: date ? date.toISOString() : undefined,
      job,
      assignedTo: assignee,
    };
  
    try {
      // Get token from localStorage for authorization
      const token = localStorage.getItem('auth-token');
  
      // Make the POST request to the backend
      const response = await axios.post(
        `${envConfig.backend}/tasks`,
        newTask,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Show success message from the backend
      setSnackbarMessage(response.data.message); // Show message from backend
      setOpenSnackbar(true);
      setError(false);
  
      // Add the new task to the task list in your UI
      onAddTask({
        title: newTask.title,
        description: newTask.description,
        columnId: newTask.status,
        priority: newTask.priority,
        dueDate: newTask.dueDate,
        job: newTask.job,
        assignee: newTask.assignedTo,
      });
      resetForm();  // Reset the form after success
  
    } catch (error) {
      // In case of error, directly show the message from the backend
      let errorMessage = 'An error occurred while creating the task.';  // Default error message
  
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;  // Use message from backend, if available
      }

      console.log(error)
  
      // Show the error message using Snackbar
      setSnackbarMessage(errorMessage);
      setError(true);
      setOpenSnackbar(true);
    }
  };

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setColumnId(columns[0]?.id || "")
    setPriority("Medium")
    setDate(null)
    setAssignee("")
  }

  const handleClose = () => {
    onClose()
    resetForm()
  }

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Task</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, py: 1 }}>
            <SoftBox>
              <SoftBox ml={0.5}>
                <SoftTypography component="label" variant="caption" fontWeight="bold">
                  Title
                </SoftTypography>
              </SoftBox>
              <SoftInput
                name="title"
                placeholder="Enter task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                fullWidth
              />
            </SoftBox>


            <SoftBox mb={0.5}>
              <SoftBox ml={0.5}>
                <SoftTypography component="label" variant="caption" fontWeight="bold">
                  Description
                </SoftTypography>
              </SoftBox>
              <SoftInput
                name="description"
                placeholder="Enter task description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={3}
                fullWidth
                
              />
            </SoftBox>


            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                <SoftBox ml={0.5}>
                  <SoftTypography component="label" variant="caption" fontWeight="bold">
                    Status
                  </SoftTypography>
                </SoftBox>
                  <Select
                    value={columnId}
                    onChange={(e) => setColumnId(e.target.value)}
                    label="Status"
                  >
                    {columns.map((column) => (
                      <MenuItem key={column.id} value={column.id}>
                        {column.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <SoftBox ml={0.5}>
                    <SoftTypography component="label" variant="caption" fontWeight="bold">
                      Priority
                    </SoftTypography>
                  </SoftBox>
                  <Select
                    labelId="priority-label"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    label="Priority"
                  >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                < SoftBox ml={0.5}>
                    <SoftTypography component="label" variant="caption" fontWeight="bold">
                      Job
                    </SoftTypography>
                  </SoftBox>
                  <Select labelId="job-label" value={job} label="Job" onChange={(e) => setJob(e.target.value)}>
                    {jobs.map((job) => (
                      <MenuItem key={job._id} value={job._id}>
                        {job.job.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <SoftBox ml={0.5}>
                    <SoftTypography component="label" variant="caption" fontWeight="bold">
                      Assign To
                    </SoftTypography>
                  </SoftBox>
                  <Select
                    labelId="assignee-label"
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    label="Assign To"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {members.map((member) => (
                      <MenuItem key={member._id} value={member._id}>
                        {member.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <SoftBox ml={0.5} mb={-2}>
                <SoftTypography component="label" variant="caption" fontWeight="bold">
                  Due Date
                </SoftTypography>
              </SoftBox>
              <DatePicker
                value={date}
                onChange={(newDate) => setDate(newDate)}
                renderInput={(params) => <TextField {...params} />}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: "outlined",
                  },
                }}
              />
            </LocalizationProvider>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <SoftButton onClick={handleClose} color="error" variant="outlined" >
            Cancel
          </SoftButton>
          <SoftButton type="submit" variant="gradient" color="success">
            Add Task
          </SoftButton>
        </DialogActions>
      </form>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}  // Duration for auto-hide
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={errorMsg ? "error" : "success"}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

    </Dialog>
  )
}

// PropTypes validation
AddTaskDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddTask: PropTypes.func.isRequired,
  columns: PropTypes.array.isRequired,
  jobs: PropTypes.array,
  members: PropTypes.array,
}

