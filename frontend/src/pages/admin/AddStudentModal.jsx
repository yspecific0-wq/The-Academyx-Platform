import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import api from "../../api/axios";

function AddStudentModal({ open, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    class_name: "",
  });

  const handleSubmit = async () => {
    try {
      await api.post("admin/students/create/", form);
      onSuccess();
      onClose();
      setForm({ name: "", email: "", class_name: "" });
    } catch {
      alert("Failed to create student");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Add Student</DialogTitle>

      <DialogContent>
        <TextField
          label="Name"
          fullWidth
          margin="normal"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <TextField
          label="Class"
          fullWidth
          margin="normal"
          value={form.class_name}
          onChange={(e) =>
            setForm({ ...form, class_name: e.target.value })
          }
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddStudentModal;
