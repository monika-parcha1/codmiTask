import React, { useState, useEffect } from "react";
import { FormFields } from "../constants";
import Button from "./button";
import Input from "./input";

let timer;
function Form({ title }) {
  const [mytime, setMyTime] = useState({
    seconds: 0,
    minutes: 0,
  });
  const [initialStartTime, setInitialStartTime] = useState({
    seconds: 0,
    minutes: 0,
  });
  const [isStartTimer, SetStartTimer] = useState(false);
  const [isPause, SetPause] = useState(false);
  const [resetTime, SetResetTime] = useState(false);

  const formatTime = (time) => {
    return time.seconds > 60
      ? {
          seconds: time.seconds % 60,
          minutes: parseInt(time.minutes) + parseInt(time.seconds / 60),
        }
      : time;
  };

  const handleFieldChange =  (event) => {
    const time = { ...mytime };
    time[event.target.name] = event.target.value;
    const formattedTime = formatTime(time);
    setMyTime(formattedTime);
  };

  useEffect(() => {
    if (isStartTimer && !isPause) {
      timer = setInterval(() => {
        let isClearInterval = false;
        setMyTime((prevState) => {
          isClearInterval = prevState.minutes == 0 && prevState.seconds == 1;
          return {
            minutes:
              prevState.seconds === 0
                ? prevState.minutes - 1
                : prevState.minutes,
            seconds: prevState.seconds === 0 ? 59 : prevState.seconds - 1,
          };
        });
        if (isClearInterval) {
          clearInterval(timer);
        }
      }, 1000);
    }

    if (isPause) {
      clearInterval(timer);
    }
  }, [isStartTimer, isPause]);

  const startTime = () => {
    SetStartTimer(true);
    setInitialStartTime(mytime);
  };

  const handleClick =  (event, name) => {
    event.preventDefault();
    if (name === "start") {
      startTime();
    } else if (name == "pause/resume") {
      SetPause(!isPause);
    } else if (name == "reset") {
      setMyTime(initialStartTime);
      SetStartTimer(true)
    }
  };

  return (
    <form>
      <h1>{title} </h1>
      {FormFields.map((field) => {
        const FormField = field.type === "number" ? Input : Button;
        return (
          <FormField
            {...field}
            onChange={handleFieldChange}
            onClick={(event) => {
              handleClick(event, field.name);
            }}
          />
        );
      })}
      {isStartTimer && (
        <p>
          {mytime.minutes} : {mytime.seconds}
        </p>
      )}
    </form>
  );
}
export default Form;
