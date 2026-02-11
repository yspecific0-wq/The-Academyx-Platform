import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Card, CardContent, Typography } from "@mui/material";

function AttendanceChart() {
  // Dummy data (later comes from backend)
  const data = [
    { day: "Mon", attendance: 92 },
    { day: "Tue", attendance: 95 },
    { day: "Wed", attendance: 90 },
    { day: "Thu", attendance: 93 },
    { day: "Fri", attendance: 97 },
  ];

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: "0px 8px 20px rgba(0,0,0,0.06)",
      }}
    >
      <CardContent>
        <Typography fontWeight={600} mb={2}>
          Weekly Attendance
        </Typography>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="attendance"
              stroke="#6b7280"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default AttendanceChart;
