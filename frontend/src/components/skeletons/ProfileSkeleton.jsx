import { Card, CardContent, Skeleton, Box } from "@mui/material";

function ProfileSkeleton() {
  return (
    <Box maxWidth={500}>
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Skeleton variant="text" width="50%" height={30} />
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="70%" />
          <Skeleton variant="text" width="60%" />
        </CardContent>
      </Card>
    </Box>
  );
}

export default ProfileSkeleton;
