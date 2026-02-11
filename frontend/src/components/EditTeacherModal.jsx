import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
} from "@mui/material";

import api from "../api/axios";

const EditTeacherModal = ({ open, onClose, teacher, onSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    subject: "",
  });

  const [loading, setLoading] = useState(false);

  // Pre-fill form
  useEffect(() => {
    if (teacher) {
      setForm({
        name: teacher.name || "",
        subject: teacher.subject || "",
      });
    }
  }, [teacher]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      await api.put(
        `admin/teachers/${teacher.id}/`,
        form
      );

      onSuccess();
      onClose();
    } catch (err) {
      alert("Failed to update teacher");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit Teacher</DialogTitle>

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
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTeacherModal;
