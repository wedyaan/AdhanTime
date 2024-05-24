import * as React from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import GitHubIcon from "@mui/icons-material/GitHub";
import { useState, useEffect } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import axios from "axios";
import moment from "moment";
import "../App.css";
// import Grid from "@mui/material/Grid";

import PrayerTime from "../Components/PrayerTime";
import "moment/dist/locale/ar";
moment.locale("ar");

export default function Navbar() {
  // STATES
  const [nextPrayerIndex, setNextPrayerIndex] = useState(2);
  const [timings, setTimings] = useState({
    Fajr: "04:20",
    Dhuhr: "11:50",
    Asr: "15:18",
    Sunset: "18:03",
    Isha: "19:33",
  });

  const [remainingTime, setRemainingTime] = useState("");

  const [selectedCity, setSelectedCity] = useState({
    displayName: "مكة المكرمة",
    apiName: "Makkah al Mukarramah",
  });

  const [today, setToday] = useState("");

  const avilableCities = [
    {
      displayName: "مكة المكرمة",
      apiName: "Makkah al Mukarramah",
    },
    {
      displayName: "الرياض",
      apiName: "Riyadh",
    },
    {
      displayName: "الدمام",
      apiName: "Dammam",
    },
  ];

  const prayersArray = [
    { key: "Fajr", displayName: "الفجر" },
    { key: "Dhuhr", displayName: "الظهر" },
    { key: "Asr", displayName: "العصر" },
    { key: "Sunset", displayName: "المغرب" },
    { key: "Isha", displayName: "العشاء" },
  ];
  const getTimings = async () => {
    const response = await axios.get(
      `https://api.aladhan.com/v1/timingsByCity?country=SA&city=${selectedCity.apiName}`
    );
    setTimings(response.data.data.timings);
  };
  useEffect(() => {
    getTimings();
  }, [selectedCity]);

  useEffect(() => {
    let interval = setInterval(() => {
      setupCountdownTimer();
    }, 1000);

    const t = moment();
    setToday(t.format("MMM Do YYYY | h:mm"));

    return () => {
      clearInterval(interval);
    };
  }, [timings]);

  // const data = await axios.get(
  // 	"https://api.aladhan.com/v1/timingsByCity?country=SA&city=Riyadh"
  // );

  const setupCountdownTimer = () => {
    const momentNow = moment();

    let prayerIndex = 2;

    if (
      momentNow.isAfter(moment(timings["Fajr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Dhuhr"], "hh:mm"))
    ) {
      prayerIndex = 1;
    } else if (
      momentNow.isAfter(moment(timings["Dhuhr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Asr"], "hh:mm"))
    ) {
      prayerIndex = 2;
    } else if (
      momentNow.isAfter(moment(timings["Asr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Sunset"], "hh:mm"))
    ) {
      prayerIndex = 3;
    } else if (
      momentNow.isAfter(moment(timings["Sunset"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Isha"], "hh:mm"))
    ) {
      prayerIndex = 4;
    } else {
      prayerIndex = 0;
    }

    setNextPrayerIndex(prayerIndex);

    // now after knowing what the next prayer is, we can setup the countdown timer by getting the prayer's time
    const nextPrayerObject = prayersArray[prayerIndex];
    const nextPrayerTime = timings[nextPrayerObject.key];
    const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm");

    let remainingTime = moment(nextPrayerTime, "hh:mm").diff(momentNow);

    if (remainingTime < 0) {
      const midnightDiff = moment("23:59:59", "hh:mm:ss").diff(momentNow);
      const fajrToMidnightDiff = nextPrayerTimeMoment.diff(
        moment("00:00:00", "hh:mm:ss")
      );

      const totalDiffernce = midnightDiff + fajrToMidnightDiff;

      remainingTime = totalDiffernce;
    }

    const durationRemainingTime = moment.duration(remainingTime);

    setRemainingTime(
      `${durationRemainingTime.seconds()} : ${durationRemainingTime.minutes()} : ${durationRemainingTime.hours()}`
    );
  };
  const handleCityChange = (event) => {
    const cityObject = avilableCities.find((city) => {
      return city.apiName === event.target.value;
    });
    console.log("the new value is ", event.target.value);
    setSelectedCity(cityObject);
  };

  return (
    <Box sx={{ flexGrow: 1, marginTop: "20px" }}>
      <div position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            aria-label="open drawer"
            sx={{ mr: 1, color: "white" }}
          >
            <GitHubIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: "block", sm: "block", color: "white" } }}
          >
            WEDYAN
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ color: "white" }}
              onChange={handleCityChange}
            >
              {selectedCity.displayName}
            </Typography>

            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ color: "white" }}
            >
              {today}
            </Typography>
          </Box>
        </Toolbar>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          style={{ paddingTop: "6%", direction: "rtl" }}
        >
          <FormControl style={{ width: "20%" }}>
            <InputLabel style={{ color: "white" }}>المدينة</InputLabel>
            <Select
              style={{ color: "white" }}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={"Dammam"}
              label="Age"
              onChange={handleCityChange}
            >
              {avilableCities.map((city) => {
                return (
                  <MenuItem value={city.apiName} key={city.apiName}>
                    {city.displayName}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ color: "white" }}
            >
              متبقي حتى صلاة {prayersArray[nextPrayerIndex].displayName}
            </Typography>

            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ color: "white", textAlign: "center" }}
            >
              {remainingTime}
            </Typography>
          </Box>{" "}
        </Stack>

        {/*  */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          flexWrap={"wrap"}
          style={{ direction: "rtl", gap: "10px" }}
          sx={{
            flexDirection: {
              xs: "column",
              sm: "row",
              md: "row",
              lg: "row",
            },
            "& > *": {
              flex: 1,
              maxWidth: {
                xs: "100%",
                sm: "100%",
                md: "100%",
                lg: "19%",
              },
            },
          }}
        >
          <PrayerTime
            name={"الفجر"}
            prayerTime={timings.Fajr}
            image={
              "https://wepik.com/api/image/ai/9a07baa7-b49b-4f6b-99fb-2d2b908800c2"
            }
          />
          <PrayerTime
            name={"الظهر"}
            prayerTime={timings.Dhuhr}
            image={
              "https://wepik.com/api/image/ai/9a07bb45-6a42-4145-b6aa-2470408a2921"
            }
          />
          <PrayerTime
            name={"العصر"}
            prayerTime={timings.Asr}
            image={
              "https://wepik.com/api/image/ai/9a07bb90-1edc-410f-a29a-d260a7751acf"
            }
          />
          <PrayerTime
            name={"المغرب "}
            prayerTime={timings.Sunset}
            image={
              "https://wepik.com/api/image/ai/9a07bbe3-4dd1-43b4-942e-1b2597d4e1b5"
            }
          />
          <PrayerTime
            name={"العشاء"}
            prayerTime={timings.Isha}
            image={
              "https://wepik.com/api/image/ai/9a07bc25-1200-4873-8743-1c370e9eff4d"
            }
          />
        </Stack>
      </div>
    </Box>
  );
}
