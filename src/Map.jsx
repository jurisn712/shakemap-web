import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, HeatmapLayer } from "@react-google-maps/api";
import axios from "axios";
import { Box, Slider, Typography, Stack, ToggleButton, ToggleButtonGroup, TextField } from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";

const containerStyle = {
  width: "100vw",
  height: "100vh",
};

const center = { lat: 56.9241, lng: 24.1343 };

const MapComponent = () => {
  const [vibrations, setVibrations] = useState([]);
  const [minVibration, setMinVibration] = useState(5);
  const [maxVibration, setMaxVibration] = useState(10);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dateRange, setDateRange] = useState("custom");

  useEffect(() => {
    fetchFilteredData();
  }, [minVibration, maxVibration, startDate, endDate]);

  const fetchFilteredData = () => {
    const params = new URLSearchParams();
    params.append("minVibration", minVibration);
    params.append("maxVibration", maxVibration);
    if (startDate) params.append("startDate", startDate.toISOString());
    if (endDate) params.append("endDate", endDate.toISOString());

    console.log("Fetching data with filters:", {
      minVibration,
      maxVibration,
      startDate,
      endDate,
    });

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/vibrations?${params.toString()}`)
      .then((response) => {
        console.log("API Response:", response.data);
        setVibrations(response.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  const handleDateRangeChange = (event, newRange) => {
    if (newRange !== null) {
      setDateRange(newRange);
      const today = new Date();
      let newStartDate = null;
      let newEndDate = today;
      if (newRange === "today") {
        newStartDate = new Date(today);
        newStartDate.setHours(0, 0, 0, 0);
      } else if (newRange === "week") {
        newStartDate = new Date();
        newStartDate.setDate(today.getDate() - 7);
      } else if (newRange === "month") {
        newStartDate = new Date();
        newStartDate.setMonth(today.getMonth() - 1);
      }
      setStartDate(newStartDate);
      setEndDate(newEndDate);
    }
  };

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} libraries={["visualization"]}>
      <Box
        sx={{
          position: "absolute",
          top: 20,
          left: 20,
          background: "white",
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
          zIndex: 100,
          width: "320px",
          fontFamily: "Roboto, sans-serif",
        }}
      >
        <Typography sx={{ fontSize: 18, fontWeight: 500, color: "primary.main" }}>Фильтр</Typography>

        <Typography sx={{ fontSize: 14, fontWeight: 500, color: "primary.main" }}>Уровень вибрации:</Typography>
        <Slider
          value={[minVibration, maxVibration]}
          onChange={(e, newValue) => {
            setMinVibration(newValue[0]);
            setMaxVibration(newValue[1]);
          }}
          valueLabelDisplay="auto"
          min={0}
          max={10}
          sx={{ mb: 2 }}
        />

        <ToggleButtonGroup value={dateRange} exclusive onChange={handleDateRangeChange} sx={{ mb: 2 }}>
          <ToggleButton value="today" sx={{ backgroundColor: "#e3f2fd", color: "#1565c0" }}>Сегодня</ToggleButton>
          <ToggleButton value="week" sx={{ backgroundColor: "#e3f2fd", color: "#1565c0" }}>За неделю</ToggleButton>
          <ToggleButton value="month" sx={{ backgroundColor: "#e3f2fd", color: "#1565c0" }}>За месяц</ToggleButton>
        </ToggleButtonGroup>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Stack spacing={2}>
            <DatePicker label="Дата от" value={startDate} onChange={setStartDate} renderInput={(params) => <TextField {...params} fullWidth />} />
            <DatePicker label="Дата до" value={endDate} onChange={setEndDate} renderInput={(params) => <TextField {...params} fullWidth />} />
          </Stack>
        </LocalizationProvider>
      </Box>

      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
        <HeatmapLayer
          data={vibrations.map((vib) => ({
            location: new window.google.maps.LatLng(vib.latitude, vib.longitude),
            weight: vib.vibration_level,
          }))}
        />
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
