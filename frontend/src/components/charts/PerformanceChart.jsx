import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Card, CardContent, Typography } from "@mui/material";

function PerformanceChart() {
  const data = [
    { grade: "A", students: 30 },
    { grade: "B", students: 45 },
    { grade: "C", students: 25 },
    { grade: "D", students: 10 },
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
          Performance Distribution
        </Typography>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <XAxis dataKey="grade" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="students" fill="#6b7280" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default PerformanceChart;
