import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Card, CardContent, Typography } from "@mui/material";

function UserGrowthChart() {
  const data = [
    { month: "Jan", users: 120 },
    { month: "Feb", users: 160 },
    { month: "Mar", users: 210 },
    { month: "Apr", users: 260 },
  ];

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography fontWeight={600} mb={2}>
          User Growth
        </Typography>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="users"
              stroke="#6b7280"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default UserGrowthChart;
