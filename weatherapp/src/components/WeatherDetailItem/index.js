import { useEffect, useState } from "react";
import {useLocation,useParams} from "react-router-dom";
import {IoLocationSharp} from "react-icons/io5"
import {FaTemperatureLow,FaWind} from "react-icons/fa"
import {GiWindSlap} from "react-icons/gi"
import {ImMeter2} from "react-icons/im"
import Cookies from "js-cookie";
import Loader from "react-loader-spinner";
import Header from "../Header";
import {LoadingViewContainer} from "../Home/styledComponents";
import BaseUrl from "../BaseUrl"
import "./index.css";
import { WiHumidity } from "react-icons/wi";

const apiStatusConstants = {
    initial: "INITIAL",
    inProgress: "IN_PROGRESS",
    success: "SUCCESS",
    failure: "FAILURE",
};



const WeatherDetailItem = () => {

    const prop = useLocation()
    const jwtToken = Cookies.get('jwt_token')
    const propData = prop.state
    let {loc} = useParams()
    
    
    const [isFav, setIsFav] = useState(false)
    const [errorMsg, setErrorMsg] = useState(null)
    const [apiFavResponse, setApiFavResponse] = useState({
        status: apiStatusConstants.initial,
        data: null,
        errorMsg : null
      })

      
      useEffect(() => {
        const getFavData =  async() => {
          setApiFavResponse({
          status: apiStatusConstants.inProgress,
          data: null,
          errorMsg : null
        });
        const jwtToken = Cookies.get('jwt_token')
        const url = `${BaseUrl}/my-location`;
        const option = {
          method : "GET",
          headers : {
              "Content-type" : "applicaton/json",
              "Authorization" : `Bearer ${jwtToken}`
          }
        }
        const response = await fetch(url,option);
        const responseData = await response.json();
        if (response.ok) {
          const filterLocation = responseData.filter(each => each.fav_location.toLowerCase().includes(loc.toLowerCase()))
          if (filterLocation.length > 0){
            setIsFav(true)
          }
          else {
            setIsFav(false)
          }
          setApiFavResponse((prevState) => ({
            ...prevState,
            status: apiStatusConstants.success,
            data: responseData,
          }));
        } else {
          setApiFavResponse((prevState) => ({
            ...prevState,
            status: apiStatusConstants.failure,
            errorMsg: "SOMETHING WENT WRONG",
          }));
        }
      };
        getFavData();
      }, [loc]);

    
    
    const onClickRemove = async() => {
      const {data} = propData
      const {sys, name} = data
      const {country} = sys
      const newLocation = {location : `${name},${country}`}
      const url = `${BaseUrl}/delete-location`
        const option = {
            method : "DELETE",
            headers : {
                'Content-Type': 'application/json',
                "Authorization" : `Bearer ${jwtToken}`
            },
            body : JSON.stringify(newLocation)
        }
        const response = await fetch(url, option)
        const resposeData = await response.json()
        if (response.ok === true) {
            setErrorMsg(null)
            setIsFav(false)
        }
        else{
            setErrorMsg(resposeData.error_msg)
        }
      
    }

    const onClickAdd = async() => {
      const {data} = propData
      const {sys, name} = data
      const {country} = sys
      const newLocation = {location : `${name},${country}`}
      const url = `${BaseUrl}/add-location`
        const option = {
            method : "POST",
            headers : {
                'Content-Type': 'application/json',
                "Authorization" : `Bearer ${jwtToken}`
            },
            body : JSON.stringify(newLocation)
        }
        const response = await fetch(url, option)
        const responseData = await response.json()
        if (response.ok === true) {
            setErrorMsg(null)
            setIsFav(true)
        }
        else{
            setErrorMsg(responseData.error_msg)
        }
    }
    
    const renderLoadingView = () => (
        <LoadingViewContainer>
          <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
        </LoadingViewContainer>
    );

    const renderSuccessView = () => {
        const {data, curr} = propData
      
        const {main, sys, name, wind, weather} = data
        const {pressure, humidity} = main
        let {temp,feels_like} = main 
        temp = curr ? temp : temp-273.15
        feels_like = curr ? feels_like : feels_like-273.15
        const {country} = sys
        const {speed} = wind
        let windType
        if (speed <= 5.5) {
          windType = "Gentle breeze"
        }else if (speed <= 7.9) {
          windType = "Moderate breeze"
        }else if (speed <= 10.7) {
          windType = "Fresh breeze"
        }else {
          windType = "Strong breeze"
        }
        const {description, icon} = weather[0]
        return (
            <div className="container mt-md-5 w-100">
              <div className="row">
                <div className="col-12 mt-2 d-flex flex-row justify-content-end align-items-start">
                  <div className="d-flex felx-row">
                        <IoLocationSharp size={"22px"} className="d-none d-md-flex" />
                        <IoLocationSharp size={"18px"} className="d-flex d-md-none" />
                        <h1 className="location-name">{name}/{country}</h1>
                    </div>
                </div>
              </div>
              <div className="container detail-container-weather p-2 pt-3 m-md-2">
                <div className="row mt-2 justify-content-center">
                  <div className="col-12 col-md-10 d-flex flex-row justify-content-between align-items-start">
                    <h4>Temperature</h4>
                    <div className="d-flex flex-row">
                      <FaTemperatureLow size={"35px"} className="d-none d-md-flex"/>
                      <FaTemperatureLow size={"25px"} className="d-flex d-md-none"/>
                      <p className="temp">{Math.round(temp)}<sup>o</sup>C</p>
                    </div>
                  </div>
                  <div className="col-12 col-md-10 d-flex flex-row justify-content-between align-items-start">
                    <h4>Feels Like</h4>
                    <div className="d-flex flex-row">
                      <FaTemperatureLow size={"35px"} className="d-none d-md-flex"/>
                      <FaTemperatureLow size={"25px"} className="d-flex d-md-none"/>
                      <p className="temp">{Math.round(feels_like)}<sup>o</sup>C</p>
                    </div>
                  </div>
                  <div className="col-12 col-md-10 d-flex flex-row justify-content-between align-items-start">
                    <h4>Clouds</h4>
                      <div className="d-flex flex-row">
                        <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`} alt="description-pic" className="icon-image" />
                        <p className="temp"> {description}</p>
                      </div>
                  </div>
                  <div className="col-12 col-md-10 d-flex flex-row justify-content-between align-items-start">
                    <h4>Wind Speed</h4>
                    <div className="d-flex flex-row">
                        <FaWind size={"30px"} className="d-none d-md-flex"/>
                        <FaWind size={"22px"} className="d-flex d-md-none"/>
                        <p className="temp">{speed}m/s</p>
                      </div>
                  </div>
                  <div className="col-12 col-md-10 d-flex flex-row justify-content-between align-items-start">
                    <h4>Breeze</h4>
                      <div className="d-flex flex-row">
                        <GiWindSlap size={"30px"} className="d-none d-md-flex"/>
                        <GiWindSlap size={"22px"} className="d-flex d-md-none"/>
                        <p className="temp"> {windType}</p>
                      </div>
                  </div>
                  <div className="col-12 col-md-10 d-flex flex-row justify-content-between align-items-start">
                    <h4>Humidity</h4>
                    <div className="d-flex flex-row">
                        <WiHumidity size={"40px"} className="d-none d-md-flex"/>
                        <WiHumidity size={"30px"} className="d-flex d-md-none"/>
                        <p className="temp">{humidity}%</p>
                      </div>
                  </div>
                  <div className="col-12 col-md-10 d-flex flex-row justify-content-between align-items-start">
                    <h4>pressure</h4>
                    <div className="d-flex flex-row">
                        <ImMeter2 size={"30px"} className="d-none d-md-flex"/>
                        <ImMeter2 size={"25px"} className="d-flex d-md-none"/>
                        <p className="temp">{pressure}hPa</p>
                      </div>
                  </div>
                  
                </div>
                </div>
                <div className="row">
                  <div className="col-12 mt-2 m-md-2">
                    {!isFav ? <button type="button" className="btn btn-success" onClick={onClickAdd}>Add To Favourite</button> : <button type="button" className="btn btn-danger" onClick={onClickRemove}>Remove</button>}
                  </div>
                  {errorMsg && <p className="text-warning">{errorMsg}</p>}
                </div>
            </div>
        )
    }

    const rendreViews = () => {
        const { status } = apiFavResponse;
        switch (status) {
        case apiStatusConstants.inProgress:
            return renderLoadingView();
        case apiStatusConstants.success:
            return renderSuccessView();
        case apiStatusConstants.failure:
            return renderLoadingView();
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

export default WeatherDetailItem
 