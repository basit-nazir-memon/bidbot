import { useState, useRef } from "react"
import PropTypes from "prop-types"
import { useDrag } from "react-dnd"
import { format } from "date-fns"

// MUI imports
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  Chip,
  IconButton,
  Divider,
  Grid,
} from "@mui/material"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import DeleteIcon from "@mui/icons-material/Delete"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import ArrowRightIcon from "@mui/icons-material/ArrowRight"

export default function TaskCard({ task, onMoveTask, onDeleteTask, columns }) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [menuAnchorEl, setMenuAnchorEl] = useState(null)
  const ref = useRef(null)

  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { id: task.id, columnId: task.columnId },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const handleMoveToColumn = (targetColumnId) => {
    if (targetColumnId !== task.columnId) {
      onMoveTask(task.id, task.columnId, targetColumnId)
    }
    handleMenuClose()
  }

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setMenuAnchorEl(null)
  }

  // Apply the drag ref to the card element
  drag(ref)

  // Get priority color for MUI components
  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return { color: "#d32f2f", backgroundColor: "#ffcdd2" }
      case "medium":
        return { color: "#f57c00", backgroundColor: "#ffe0b2" }
      case "low":
        return { color: "#388e3c", backgroundColor: "#c8e6c9" }
      default:
        return { color: "#616161", backgroundColor: "#e0e0e0" }
    }
  }

  // Get border color based on priority
  const getPriorityBorderColor = (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "#d32f2f"
      case "medium":
        return "#f57c00"
      case "low":
        return "#388e3c"
      default:
        return "#bdbdbd"
    }
  }

  return (
    <>
      <Card
        ref={ref}
        sx={{
          cursor: "grab",
          opacity: isDragging ? 0.5 : 1,
          boxShadow: isDragging ? 4 : 1,
          transition: "all 0.2s",
          "&:hover": { boxShadow: 3 },
          borderLeft: `4px solid ${getPriorityBorderColor(task.priority)}`,
        }}
      >
        <CardContent sx={{ p: 2, pb: 0, "&:last-child": { pb: 0 } }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <Typography variant="h6" component="h6" sx={{ fontWeight: "medium", justifyContent: "center", alignItems: "center", display:"flex" }}>
              {task.title}
            </Typography>
            <IconButton size="small" onClick={handleMenuOpen}>
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              mt: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              
            }}
          >
            {task.description}
          </Typography>

          {task.assignee && (
            <Box sx={{ display: "flex", alignItems: "center", mt: 1.5, fontSize: "0.75rem" }}>
              <Box
                sx={{
                  bgcolor: "secondary.light",
                  color: "dark.main",
                  borderRadius: "50%",
                  width: 20,
                  height: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 0.5,
                  fontSize: "0.7rem",
                  fontWeight: "bold",
                }}
              >
                {getInitials(task?.assignee.name)}
              </Box>
              <Typography variant="caption">{task?.assignee.name}</Typography>
            </Box>
          )}
        </CardContent>
        <Divider />
        <CardActions sx={{ p: 1.5, pt: 0, justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", fontSize: "0.75rem", color: "text.secondary" }}>
            <CalendarTodayIcon sx={{ mr: 0.5, fontSize: "0.875rem" }} />
            <Typography variant="caption">
              {task.dueDate ? format(new Date(task.dueDate), "MMM d") : "No date"}
            </Typography>
          </Box>
          <Chip
            label={task.priority}
            size="small"
            sx={{
              backgroundColor: getPriorityColor(task.priority).backgroundColor,
              color: getPriorityColor(task.priority).color,
              fontWeight: "medium",
              fontSize: "0.7rem",
            }}
          />
        </CardActions>
      </Card>

      {/* Menu for task actions */}
      <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose}>
        <MenuItem
          onClick={() => {
            setIsDetailsOpen(true)
            handleMenuClose()
          }}
        >
          View Details
        </MenuItem>
        <MenuItem
          onClick={() => {
            onDeleteTask(task.id, task.columnId)
            handleMenuClose()
          }}
          sx={{ color: "error.main" }}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
        <Divider />
        <MenuItem disabled sx={{ opacity: 0.7, fontSize: "0.8rem" }}>
          Move to
        </MenuItem>
        {columns.map(
          (column) =>
            column.id !== task.columnId && (
              <MenuItem key={column.id} onClick={() => handleMoveToColumn(column.id)}>
                <ArrowRightIcon fontSize="small" sx={{ mr: 1 }} />
                {column.title}
              </MenuItem>
            ),
        )}
      </Menu>

      {/* Task details dialog */}
      <Dialog open={isDetailsOpen} onClose={() => setIsDetailsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{task.title}</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ py: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Description
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {task.description}
            </Typography>

            <Grid container spacing={3} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Due Date
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {task.dueDate ? format(new Date(task.dueDate), "PPP") : "No due date"}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Priority
                </Typography>
                <Chip
                  label={task.priority}
                  size="small"
                  sx={{
                    backgroundColor: getPriorityColor(task.priority).backgroundColor,
                    color: getPriorityColor(task.priority).color,
                  }}
                />
              </Grid>
            </Grid>

            <Typography variant="subtitle2" gutterBottom>
              Status
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {columns.find((col) => col.id === task.columnId)?.title || "Unknown"}
            </Typography>

            <Typography variant="subtitle2" gutterBottom>
              Job
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {getJobName(task.jobId)}
            </Typography>

            {task.assignee && (
              <>
                <Typography variant="subtitle2" gutterBottom>
                  Assigned To
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {task.assignee.name}
                </Typography>
              </>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

// PropTypes validation
TaskCard.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    columnId: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    dueDate: PropTypes.string,
    createdAt: PropTypes.string.isRequired,
    jobId: PropTypes.string.isRequired,
    assignee: PropTypes.string,
  }).isRequired,
  onMoveTask: PropTypes.func.isRequired,
  onDeleteTask: PropTypes.func.isRequired,
  columns: PropTypes.array.isRequired,
}

function getAssigneeName(assigneeId) {
  const teamMembers = [
    { id: "person1", name: "John Doe" },
    { id: "person2", name: "Jane Smith" },
    { id: "person3", name: "Alex Johnson" },
    { id: "person4", name: "Sam Wilson" },
    { id: "person5", name: "Taylor Brown" },
  ]

  return teamMembers.find((member) => member.id === assigneeId)?.name || "Unassigned"
}

function getJobName(jobId) {
  const jobs = [
    { id: "job1", name: "Website Redesign" },
    { id: "job2", name: "Mobile App Development" },
    { id: "job3", name: "E-commerce Platform" },
    { id: "job4", name: "CRM Integration" },
  ]

  return jobs.find((job) => job.id === jobId)?.name || "Unknown Job"
}

function getInitials(name) {
  return name ? name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2) : ""
}

