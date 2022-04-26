import "./App.css";
import {
  Container,
  Card,
  Button,
  Typography,
  CardActions,
  CardContent,
  IconButton,
  TextField,
} from "@mui/material";
import React from "react";
import { Add, Clear, Update } from "@mui/icons-material";

var cities;

if (
  localStorage.getItem("cities") !== undefined &&
  localStorage.getItem("cities").length > 0
) {
  cities = new Map(Object.entries(JSON.parse(localStorage.getItem("cities"))));
} else {
  cities = new Map();

  cities.set("Kyiv", {
    name: "Kyiv",
    temp: "1",
  });
  cities.set("London", {
    name: "London",
    temp: "2",
  });
  cities.set("Rome", {
    name: "Rome",
    temp: "3",
  });
  cities.set("Berlin", {
    name: "Berlin",
    temp: "4",
  });
  cities.set("New York", {
    name: "New York",
    temp: "5",
  });
}

const AddButton = (prop) => (
  <IconButton onClick={prop.callback}>
    <Add />
  </IconButton>
);

const addCity = () => {
  cities.set(document.querySelector("#city-input").value, {
    name: document.querySelector("#city-input").value,
    temp: "-",
  });
};

function deleteCity(name) {
  cities.delete(name);
}

function save() {
  localStorage.setItem("cities", JSON.stringify(Object.fromEntries(cities)));
}

function elmsUpdate() {
  let elms = [];
  for (const element of cities) {
    elms.push(element[1]);
  }

  return elms;
}

function loadWeather(callback) {
  const elms = elmsUpdate();
  const fetchArr = elms.map((elm) => {
    return fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${elm.name}&APPID=32ba72b44a465ccf1b555c6c67ae5afc&units=metric`
    )
      .then((response) => response.json())
      .then((data) => {
        cities.set(elm.name, { ...elm, ...data.main, ...data.weather[0] });
      });
  });

  Promise.all(fetchArr).then((values) => {
    callback(cities);
  });
}

function App() {
  const [state, setState] = React.useState(cities.size);
  const [state2, setState2] = React.useState("");
  const [state3, setState3] = React.useState(new Map());

  React.useEffect(() => {
    loadWeather(setState3);
  }, [state3]);

  const elms = elmsUpdate();

  return (
    <Container maxWidth="sm">
      <Typography variant="h3" component="h1">
        Weather of {cities.size} cities
      </Typography>
      <div style={{ margin: "10px 0" }}>
        <TextField
          label="Add city"
          value={state2}
          id="city-input"
          variant="outlined"
          onChange={(event) => {
            setState2(event.target.value);
          }}
          InputProps={{
            endAdornment: (
              <AddButton
                callback={() => {
                  addCity();
                  save();
                  setState(cities.size);
                }}
              />
            ),
          }}
        />
      </div>
      <React.Fragment>
        {elms.map((elm) => {
          return (
            <Card
              sx={{
                maxWidth: 300,
                display: "inline-block",
                margin: "20px 20px 20px 0",
              }}
              key={elm.name}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <IconButton size="small">
                    <Update />
                  </IconButton>
                </div>
                <div style={{ textAlign: "right" }}>
                  <IconButton
                    onClick={() => {
                      deleteCity(elm.name);
                      save();
                      setState(cities.size);
                    }}
                    size="small"
                    color="error"
                  >
                    <Clear />
                  </IconButton>
                </div>
              </div>
              <CardContent>
                <Typography
                  sx={{ fontSize: 14 }}
                  color="text.secondary"
                  gutterBottom
                >
                  {elm.name}
                </Typography>
                <Typography variant="h5" component="div">
                  {elm.temp}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Learn More</Button>
              </CardActions>
            </Card>
          );
        })}
      </React.Fragment>
    </Container>
  );
}

export default App;
