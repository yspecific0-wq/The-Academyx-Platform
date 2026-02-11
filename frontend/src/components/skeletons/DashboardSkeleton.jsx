import { Grid, Skeleton, Card, CardContent } from "@mui/material";

function DashboardSkeleton() {
  return (
    <Grid container spacing={3}>
      {[1, 2, 3, 4].map((item) => (
        <Grid item xs={12} md={3} key={item}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Skeleton variant="text" width="60%" height={30} />
              <Skeleton variant="text" width="40%" height={20} />
              <Skeleton variant="rectangular" height={60} sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default DashboardSkeleton;
