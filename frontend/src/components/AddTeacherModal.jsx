import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack
} from "@mui/material";

import api from "../api/axios";

const AddTeacherModal = ({ open, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
  try {
    setLoading(true);

    const res = await api.post(
      "admin/teachers/create/",
      form
    );

    alert(
      `Teacher created!\nTemporary password: ${res.data.temp_password}`
    );

    onSuccess();
    onClose();
    setForm({ name: "", email: "", subject: "" });
  } catch (err) {
    alert(err.response?.data?.error || "Failed to add teacher");
  } finally {
    setLoading(false);
  }
};

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Teacher</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Teacher Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Subject"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            fullWidth
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Saving..." : "Add Teacher"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddTeacherModal;
