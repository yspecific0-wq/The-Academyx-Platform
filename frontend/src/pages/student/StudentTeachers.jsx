// src/pages/student/StudentTeachers.jsx

// 1. You must import React to use React.Fragment
import React from "react"; 
// 2. You must add Divider here so the browser knows what it is
import { 
  Box, Typography, List, ListItem, ListItemAvatar, 
  Avatar, ListItemText, Paper, Divider 
} from "@mui/material";
import Layout from "../../layouts/AdminLayout";
import PersonIcon from "@mui/icons-material/Person";

const StudentTeachers = () => {
  const teachers = [
    { id: 1, name: "Dr. Aris", subject: "Mathematics", email: "aris@school.com" },
    { id: 2, name: "Prof. Sarah", subject: "Physics", email: "sarah@school.com" },
  ];

  return (
    
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>My Teachers</Typography>
        <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <List>
            {teachers.map((teacher, index) => (
              // This Fragment requires the 'React' import added above
              <React.Fragment key={teacher.id}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar><PersonIcon /></Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={teacher.name}
                    secondary={`${teacher.subject} — ${teacher.email}`}
                  />
                </ListItem>
                {/* Now Divider will work because it is imported at the top! */}
                {index < teachers.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </Box>
    
  );
};

export default StudentTeachers;