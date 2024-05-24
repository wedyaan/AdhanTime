import React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

export default function PrayerTime({ name, prayerTime, image }) {
  return (
    <div>
      <Grid container style={{ paddingTop: "4%", textAlign: "right" }}>
        <Grid>
          <Card>
            <CardMedia
              component="img"
              alt="green iguana"
              height="140"
              image={image}
            />
            <CardContent style={{ padding: "10px" }}>
              <Typography gutterBottom variant="h5" component="div">
                {name}
              </Typography>
              <Typography variant="h1" color="text.secondary">
                {prayerTime}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
