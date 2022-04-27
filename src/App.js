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
  Autocomplete,
  Modal,
  Box
} from "@mui/material";
import React, { useEffect } from "react";
import { Add, Clear, Update } from "@mui/icons-material";

var cities;

if (
  localStorage.getItem("cities") != undefined &&
  localStorage.getItem("cities") != ""
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

let handleKeyPress = (event, callback) => {
  if (event.key === "Enter") {
    callback();
  }
};

const AddButton = (prop) => (
  <IconButton onClick={prop.callback}>
    <Add />
  </IconButton>
);

const addCity = () => {
  let name = document.querySelector("#city-input").value;
  if (name.length > 0) {
    cities.set(name, {
      name: name,
      temp: "-",
    });
  }
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
        let obj = {
          ...elm,
          ...data.main,
          ...data.weather[0],
          country: data.sys.country,
        };
        delete obj.id;
        delete obj.icon;
        cities.set(elm.name, obj);
      });
  });

  Promise.all(fetchArr).then((values) => {
    callback(cities);
  });
}

function updateWeather(callback, elm) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${elm.name}&APPID=32ba72b44a465ccf1b555c6c67ae5afc&units=metric`
  )
    .then((response) => response.json())
    .then((data) => {
      let obj = {
        ...elm,
        ...data.main,
        ...data.weather[0],
        country: data.sys.country,
      };
      delete obj.id;
      delete obj.icon;
      cities.set(elm.name, obj);
      callback(new Map(cities));
    });
}

const citiesList = [
  { label: "Kyiv" },
  { label: "London" },
  { label: "Rome" },
  { label: "New York" },
  { label: "Berlin" },
  { label: "Moscow" },
  { label: "Beijing" },
  { label: "Delhi" },
  { label: "Rio de Janeiro" },
  { label: "Paris" },
  { label: "Istanbul" },
  { label: "Madrid" },
  { label: "Athens" },
  { label: "Cairo" },
  { label: "Bangkok" },
  { label: "Hong Kong" },
  { label: "Tokyo" },
  { label: "Mexico" },
  { label: "Los Angeles" },
  { label: "Chicago" },
  { label: "Barcelona" },
  { label: "Abu Dhabi" },
  { label: "Amsterdam" },
  { label: "Sydney" },
  { label: "Lisbon" },
  { label: "Vienna" },
  { label: "Mumbai" },
  { label: "Dubai" },
  { label: "Antalya" },
  { label: "Seoul" },
  { label: "Milan" },
  { label: "Odessa" },
  { label: "Dublin" },
  { label: "Jerusalem" },
  { label: "Saint Petersburg" },
  { label: "Munich" },
  { label: "Warsaw" },
  { label: "Kraków" },
  { label: "Sofia" },
  { label: "Geneva" },
  { label: "Tel Aviv" },
  { label: "Brussels" },
  { label: "Ottawa" },
  { label: "Toronto" },
  { label: "Baku" },
  { label: "Ankara" },
  { label: "Baghdad" },
  { label: "Beirut" },
  { label: "Cape Town" },
  { label: "Bucharest" },
  { label: "Damascus" },
  { label: "Dushanbe" },
  { label: "Havana" },
  { label: "Minsk" },
  { label: "Nairobi" },
  { label: "Oslo" },
  { label: "Prague" },
  { label: "Riga" },
  { label: "Stockholm" },
  { label: "Tunis" },
  { label: "Vilnius" },
];

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  overflow: "hidden",
};

function BasicModal(props) {
  const [open, setOpen] = React.useState(props.state);
  const handleClose = props.close;

  useEffect(() => {
    setOpen(props.state);
  }, [props.state]);
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {props.current.name}
          </Typography>
         
            <ul>
              {Object.entries(props.current).map((elm) => {
                return (
                  <li key={elm[0]}>
                    <strong>{elm[0]}</strong>: {elm[1]}
                  </li>
                );
              })}
            </ul>
         
        </Box>
      </Modal>
    </div>
  );
}

function App() {
  const [state, setState] = React.useState(cities.size);
  const [state2, setState2] = React.useState("");
  const [state3, setState3] = React.useState(new Map());
  const [state4, setState4] = React.useState(cities);
  const [modalState, setModalState] = React.useState(false);
  const [currentElm, setCurrentElm] = React.useState(false);
  React.useEffect(() => {
    loadWeather(setState3);
  }, [state3]);

  const elms = elmsUpdate();

  return (
    <Container maxWidth="sm">
      <Typography variant="h3" component="h1">
        Weather of {state} cities
      </Typography>
      <div style={{ margin: "10px 0" }}>
        <Autocomplete
          onKeyPress={(event) => {
            handleKeyPress(event, () => {
              addCity();
              save();
              setState(cities.size);
            });
          }}
          id="city-input"
          disableClearable
          forcePopupIcon={false}
          options={citiesList}
          getOptionLabel={(option) => option.label}
          sx={{ width: 300 }}
          renderInput={(params) => {
            return (
              <TextField
                {...params}
                label="Add city"
                value={state2}
                variant="outlined"
                onChange={(event) => {
                  setState2(event.target.value);
                }}
                fullWidth
                InputProps={{
                  ...params.InputProps,
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
            );
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
                  <IconButton
                    size="small"
                    onClick={() => {
                      updateWeather(setState4, elm);
                    }}
                  >
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

                {!isNaN(elm.temp) ? (
                  <Typography variant="h5" component="div">
                    {Math.round(elm.temp) + " °C"}{" "}
                  </Typography>
                ) : (
                  "update"
                )}
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => {
                    setCurrentElm(elm);
                    setModalState(true);
                  }}
                >
                  Learn More
                </Button>
              </CardActions>
            </Card>
          );
        })}
      </React.Fragment>
      <BasicModal
        state={modalState}
        close={() => {
          setModalState(false);
        }}
        current={currentElm}
      />
    </Container>
  );
}

export default App;
