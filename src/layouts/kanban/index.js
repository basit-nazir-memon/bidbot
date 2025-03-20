import { useState, useEffect, useCallback } from "react"
import PropTypes from 'prop-types'
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import TaskCard from "./task-card"
import AddTaskDialog from "./add-task-dialog"
import { useDrop } from "react-dnd"

// MUI imports
import { Box, Typography, Paper, FormControl, InputLabel, Select, MenuItem, Card, Grid, Snackbar, Alert, CircularProgress } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DashboardLayout from "examples/LayoutContainers/DashboardLayout"
import DashboardNavbar from "examples/Navbars/DashboardNavbar"
import SoftBox from "components/SoftBox"
import SoftTypography from "components/SoftTypography"
import SoftButton from "components/SoftButton"
import { envConfig } from "env"
import axios from "axios"

// Column component with PropTypes
const ColumnComponent = ({ column, onMoveTask, onDeleteTask, columns, moveTask }) => {
    const [{ isOver }, drop] = useDrop({
        accept: "TASK",
        drop: (item) => {
            if (item.columnId !== column.id) {
                moveTask(item.id, item.columnId, column.id)
                return { moved: true }
            }
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    })

    // Get column color based on ID
    const getColumnColor = (columnId) => {
        const colors = {
            planning: "#e6f4ff", // Ultra light blue
            requirements: "#f8f0ff", // Ultra light purple
            design: "#fbe9ec", // Ultra light pink
            development: "#fff7e1", // Ultra light amber
            testing: "#e5f9e5", // Ultra light green
            deployment: "#e0f7ff", // Ultra light cyan
            completed: "#e1f5e1", // Ultra light teal
        };
        return colors[columnId] || "#f7f7f7"; // Default very light gray
    };


    return (
        <Paper
            ref={drop}
            elevation={3}
            sx={{
                width: 280,
                minHeight: 500,
                p: 2,
                backgroundColor: isOver ? 'rgba(0, 0, 0, 0.04)' : `${getColumnColor(column.id)}`,
                border: isOver ? '2px dashed #1976d2' : 'none',
            }}
        >
            <Typography variant="h6" sx={{ mb: 2 }}>
                {column.title}
            </Typography>
            <Box sx={{ minHeight: 450 }}>
                {column.tasks.map((task) => (
                    <Box key={task.id} sx={{ mb: 2 }}>
                        <TaskCard
                            task={task}
                            onMoveTask={onMoveTask}
                            onDeleteTask={onDeleteTask}
                            columns={columns}
                        />
                    </Box>
                ))}
            </Box>
        </Paper>
    )
}

ColumnComponent.propTypes = {
    column: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        tasks: PropTypes.array.isRequired
    }).isRequired,
    onMoveTask: PropTypes.func.isRequired,
    onDeleteTask: PropTypes.func.isRequired,
    columns: PropTypes.array.isRequired,
    moveTask: PropTypes.func.isRequired
}

export default function Kanban() {
    const [columns, setColumns] = useState([
        { id: "planning", title: "Planning", tasks: [] },
        { id: "requirements", title: "Requirements", tasks: [] },
        { id: "design", title: "Design", tasks: [] },
        { id: "development", title: "Development", tasks: [] },
        { id: "testing", title: "Testing", tasks: [] },
        { id: "deployment", title: "Deployment", tasks: [] },
        { id: "completed", title: "Completed", tasks: [] },
    ])

    const [jobs, setJobs] = useState([])
    const [members, setMembers] = useState([])

    // const [currentJob, setCurrentJob] = useState(jobs[0]?.id || "")

    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [errorMsg, setError] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    /// Load tasks from backend on component mount
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const token = localStorage.getItem("auth-token");
                const response = await axios.get(`${envConfig.backend}/tasks`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log(response.data);
                setJobs(response.data.ongoingJobs);
                setMembers(response.data.teamMembers)
                setColumns(prevColumns =>
                    prevColumns.map(column => {
                        // Update tasks for the respective column
                        return {
                            ...column,
                            tasks: response.data.tasks[column.id] || [] // Assign tasks to the column based on its id
                        };
                    })
                );
                setLoading(false)
            } catch (error) {
                console.error("Failed to fetch tasks", error);
                setError("An error occurred while fetching tasks.");
                setLoading(false)
            }
        };

        fetchTasks();
    }, []);

    // Save tasks to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem("kanbanTasks", JSON.stringify(columns))
    }, [columns])

    const handleAddTask = (task) => {
        const updatedColumns = columns.map((column) => {
            if (column.id === task.columnId) {
                return {
                    ...column,
                    tasks: [...column.tasks, task],
                }
            }
            return column
        })

        setColumns(updatedColumns)
        setIsAddTaskOpen(false)
    }

    const handleMoveTask = async (taskId, sourceColumnId, targetColumnId) => {
        const updatedColumns = [...columns]

        // Find source and target columns
        const sourceColumnIndex = updatedColumns.findIndex((col) => col.id === sourceColumnId)
        const targetColumnIndex = updatedColumns.findIndex((col) => col.id === targetColumnId)

        if (sourceColumnIndex === -1 || targetColumnIndex === -1) return

        // Find the task in the source column
        const taskIndex = updatedColumns[sourceColumnIndex].tasks.findIndex((task) => task.id === taskId)
        if (taskIndex === -1) return

        // Remove task from source column
        const [task] = updatedColumns[sourceColumnIndex].tasks.splice(taskIndex, 1)

        const prevColId = task.columnId;

        try {
            // If request is successful, update the task in the target column
            updatedColumns[targetColumnIndex].tasks.push({
                ...task,
                columnId: targetColumnId,
            });

            // Update the columns state
            setColumns(updatedColumns);

            // Send the request to the backend to update the task's columnId
            const response = await axios.put(`${envConfig.backend}/tasks/${taskId}/status`, {
                status: targetColumnId, // Assuming the status is directly tied to the columnId
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('auth-token')}`,
                }
            });



        } catch (error) {

            let errorMessage = 'An error occurred while creating the task.';  // Default error message
            if (error.response) {
                errorMessage = error.response.data.message || errorMessage;  // Use message from backend, if available
            }

            setSnackbarMessage(errorMessage);

            // If request is successful, update the task in the target column
            updatedColumns[targetColumnIndex].tasks.push({
                ...task,
                columnId: prevColId,
            });

            // Update the columns state
            setColumns(updatedColumns);

            console.error('Error moving task:', error.response?.data?.message || error.message);
        }
    }

    const handleDeleteTask = async (taskId, columnId) => {
        try {
            const token = localStorage.getItem("auth-token");
            const response = await axios.delete(`${envConfig.backend}/tasks/${taskId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Remove the task from the UI
            const updatedColumns = columns.map((column) => {
                if (column.id === columnId) {
                    return {
                        ...column,
                        tasks: column.tasks.filter((task) => task.id !== taskId),
                    };
                }
                return column;
            });

            setColumns(updatedColumns);

            // Show success message
            setSnackbarMessage(response.data.message); // Assuming backend sends a success message
            setError(false);
            setOpenSnackbar(true);
        } catch (error) {
            console.error('Error deleting task:', error);

            // Show error message
            setSnackbarMessage(error.response?.data?.message || 'Failed to delete task');
            setError(true);
            setOpenSnackbar(true);
        }
    };

    const moveTask = useCallback(
        (taskId, sourceColumnId, targetColumnId) => {
            handleMoveTask(taskId, sourceColumnId, targetColumnId)
        },
        [columns],
    )


    return (
        <DashboardLayout>
            <DashboardNavbar />
            <SoftBox py={3}>
                <SoftBox mb={3}>
                    <Card
                        sx={{
                            backdropFilter: `saturate(200%) blur(30px)`,
                            backgroundColor: ({ functions: { rgba }, palette: { white } }) => rgba(white.main, 0.8),
                            boxShadow: ({ boxShadows: { navbarBoxShadow } }) => navbarBoxShadow,
                            position: "relative",
                            mb: 2,
                            py: 2,
                            px: 2,
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                    Kanban Board
                                </Typography>
                            </Box>
                            <SoftButton
                                variant="contained"
                                color="dark"
                                startIcon={<AddIcon />}
                                onClick={() => setIsAddTaskOpen(true)}
                                disabled={loading}
                            >
                                Add New Task
                            </SoftButton>
                        </Box>
                    </Card>

                    {loading ? (
                        <SoftBox display="flex" justifyContent="center" alignItems="center" height="300px">
                            <CircularProgress color="info" />
                        </SoftBox>
                    )
                        :
                        (
                            <Card sx={{ p: 2 }}>

                                <DndProvider backend={HTML5Backend}>

                                    <Box sx={{ overflowX: 'auto', pb: 2 }}>
                                        <Box sx={{ display: 'flex', gap: 3, p: 1, minWidth: 'max-content' }} >
                                            {columns.map((column) => (
                                                <ColumnComponent
                                                    key={column.id}
                                                    column={column}
                                                    onMoveTask={handleMoveTask}
                                                    onDeleteTask={handleDeleteTask}
                                                    columns={columns}
                                                    moveTask={moveTask}
                                                />
                                            ))}
                                        </Box>
                                    </Box>

                                    <AddTaskDialog
                                        isOpen={isAddTaskOpen}
                                        onClose={() => setIsAddTaskOpen(false)}
                                        onAddTask={handleAddTask}
                                        columns={columns || []}
                                        jobs={jobs || []}
                                        members={members || []}
                                    />
                                </DndProvider>

                            </Card>
                        )}
                </SoftBox>
            </SoftBox>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}  // Duration for auto-hide
                onClose={() => setOpenSnackbar(false)}
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity={errorMsg ? "error" : "success"}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </DashboardLayout>
    )
}
