import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "react-loader-spinner";
import Header from "../Header";
import {IoLocationSharp} from "react-icons/io5"
import {FaTemperatureLow} from "react-icons/fa"
import {WiHumidity,WiCloudyGusts} from "react-icons/wi"
import {
    LoadingViewContainer,
  } from "./styledComponents";

import "./index.css"
import Favourites from "../Favourites";

const apiStatusConstants = {
    initial: "INITIAL",
    inProgress: "IN_PROGRESS",
    success: "SUCCESS",
    failure: "FAILURE",
};



const Home = () => {
  const navigate = useNavigate()
    const [apiCurResponse, setApiCurResponse] = useState({
        status: apiStatusConstants.initial,
        data: null,
        errorMsg: null,
      });

    const [currentTime, setCurTime] = useState({})

    useEffect(() => {
        setInterval(() => {
            const dateTime = new Date()
            const month = dateTime.getMonth() + 1
            const date = dateTime.getDate()
            
            const year = dateTime.getFullYear()
            const hour = dateTime.getHours()
            const minutes = dateTime.getMinutes()
            const hourFormat = hour >= 13 ? hour%12 : hour
            const amOrPm = hour >= 12 ? "PM" : "AM"
            const time = hourFormat + ":" + (minutes <= 9 ? "0"+minutes : minutes)
            const today = date + "/" + month + "/" + year
            setCurTime({time, amOrPm, today})
        }, 1000)
        
        const getCurLocData =  () => {
          setApiCurResponse({
            status: apiStatusConstants.inProgress,
            data: null,
            errorMsg: null,
          });
          
          navigator.geolocation.getCurrentPosition( async(sucess) => {
            var {latitude, longitude} = sucess.coords
          const apiKey = "a67ac82fe78e5b019cf0e222fa42af25"
    
          const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
          
          const response = await fetch(url);
          const responseData = await response.json();
          if (response.ok) {
            setApiCurResponse((prevState) => ({
              ...prevState,
              status: apiStatusConstants.success,
              data: responseData,
            }));
          } else {
            setApiCurResponse((prevState) => ({
              ...prevState,
              status: apiStatusConstants.failure,
              errorMsg: responseData.error_msg,
            }));
          }
        })};
    
        getCurLocData();
      }, []);
    

    const renderLoadingView = () => (
        <LoadingViewContainer>
          <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
        </LoadingViewContainer>
    );

    const renderSuccessView = () => {
        const {data} = apiCurResponse
        const {name, sys, main, wind, weather} = data
        const {country} = sys
        const {description, icon} = weather[0]
        const {time, amOrPm, today} = currentTime
        const {temp,humidity} = main
        const {speed} = wind
        const onClickCurr = () => {
          navigate(`/weather-detail/${name},${country}`, {state : {data : data, curr: true}}) 
      }
        return (
            <div className="mt-1">
                <h1 className="mt-md-5 mt-1 section-heading">CURRENT LOCATION</h1>
                <div className="Weather-container"  onClick={onClickCurr}>
                    <div className=" loc-time-container">
                    <div className="d-flex felx-row">
                        <IoLocationSharp size={"22px"} className="d-none d-md-flex" />
                        <IoLocationSharp size={"18px"} className="d-flex d-md-none" />
                        <h1 className="location-name">{name}/{country}</h1>
                    </div>
                    </div>
                    <div className="d-flex flex-row justify-content-around">
                    <div className="weather">
                      <div className="d-flex flex-row temperature-container">
                        <FaTemperatureLow size={"35px"} className="d-none d-md-flex"/>
                        <FaTemperatureLow size={"25px"} className="d-flex d-md-none"/>
                        <p className="temp">{Math.round(temp)}<sup>o</sup>C</p>
                      </div>
                        <div className="d-flex flex-row">
                          <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`} alt="description-pic" className="icon-image" />
                        <p className="temp"> {description}</p>
                        </div>
                    </div>
                    <div className="d-md-flex d-none flex-column">
                      <div className="d-flex flex-row">
                        <WiHumidity size={"40px"} />
                        <p className="temp">{humidity}%</p>
                      </div>
                      <div className="d-flex flex-row">
                        <WiCloudyGusts size={"40px"} />
                        <p className="temp">{speed}m/s</p>
                      </div>
                    </div>
                    <div>
                        <p className="time">{time} <span className="amorpm">{amOrPm}</span></p>
                        <p className="today">{today}</p>
                    </div>
                    </div>
                </div>
                <div>
                  <h1 className="mt-3 section-heading">FAVOURITES</h1>
                    <Favourites />
                </div>
            </div>
        )
    }

    const renderFailureView = () => {
      navigate("/failed-view")

    }
    
    const rendreViews = () => {
        const { status } = apiCurResponse;
        switch (status) {
        case apiStatusConstants.inProgress:
            return renderLoadingView();
        case apiStatusConstants.success:
            return renderSuccessView();
        case apiStatusConstants.failure:
            return renderFailureView();
        default:
            return null;
        }
      }

    return (
        <>
          <Header />
          <div className="home-container">
              {rendreViews()}
          </div>
        </>
    )
}

export default Home