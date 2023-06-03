import {useState, useEffect} from "react"
import {useNavigate} from "react-router-dom"
import Loader from "react-loader-spinner";
import {IoLocationSharp} from "react-icons/io5"
import {FaTemperatureLow} from "react-icons/fa"
import {RiErrorWarningLine} from "react-icons/ri"
import {LoadingViewContainer} from "../Home/styledComponents";
import "./index.css"

const apiStatusConstants = {
    initial: "INITIAL",
    inProgress: "IN_PROGRESS",
    success: "SUCCESS",
    failure: "FAILURE",
};

const FavouriteItem = (props) => {
    const navigate = useNavigate()
    const [apiLocWeather, setApiLocWeather] = useState({status: apiStatusConstants.initial,
        data: null,
        errorMsg : null
      })
    const {itemDetails} = props 
    const {fav_location} = itemDetails

    const apiKey = "439d4b804bc8187953eb36d2a8c26a02"
      useEffect(() => {
        const getFavData =  async() => {
            setApiLocWeather({
            status: apiStatusConstants.inProgress,
            data: null,
            errorMsg : null
          });
        
          const url = `https://openweathermap.org/data/2.5/find?q=${fav_location}&appid=${apiKey}&units=metric`;
          
          
          const response = await fetch(url);
          const responseData = await response.json();
          if (response.ok) {
            setApiLocWeather((prevState) => ({
              ...prevState,
              status: apiStatusConstants.success,
              data: responseData,
            }));
          } else {
            setApiLocWeather((prevState) => ({
              ...prevState,
              status: apiStatusConstants.failure,
              errorMsg: "SOMETHING WENT WRONG",
            }));
          }
        };
    
        getFavData();
      }, [fav_location]);
    
    const renderLoadingView = () => (
      <li className="col-11 mt-2 m-md-2 pt-2 col-md-3 text-light fav-list-item">
        <LoadingViewContainer>
          <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
        </LoadingViewContainer>
      </li>
    );

    const renderFailureView = () => {
      const onClickFav = () => {
        navigate(`/failed-view`)
    }
        return (
          <li className="col-11 mt-2 m-md-2 pt-2 col-md-4 col-lg-3 text-light fav-list-item" onClick={onClickFav}>
                <div>
                  <div className="d-flex flex-row justify-content-between">
                  <div className="d-flex felx-row">
                          <IoLocationSharp size={"22px"} className="d-none d-md-flex" />
                          <IoLocationSharp size={"18px"} className="d-flex d-md-none" />
                          <h1 className="location-name">-------/----</h1>
                  </div>
                  <p className="text-warning server-busy">Temporarily unavailable</p>
                  </div>
                  <div className="d-flex flex-row flex-wrap justify-content-between p-1">
                  <div className="d-flex flex-row temperature-container">
                          <FaTemperatureLow size={"35px"} className="d-none d-md-flex"/>
                          <FaTemperatureLow size={"25px"} className="d-flex d-md-none"/>
                          <p className="temp">-/-<sup>o</sup>C</p>
                  </div>
                          <div className="d-flex flex-row">
                            <RiErrorWarningLine size={"35px"} className="d-none d-md-flex"/>
                            <RiErrorWarningLine size={"25px"} className="d-flex d-md-none"/>
                            <p className="temp">-------/---</p>
                          </div>
                  </div>
                </div>
            </li>
        )
    }

    const renderSuccessView = () => {
        const {data} = apiLocWeather
        const {list} = data
        if (list.length === 0) {
            return renderFailureView()
        }
        const fetchedData = list[0]
        const {main,weather, name, sys} = fetchedData
        const {description, icon} = weather[0]
        const {country} = sys
        const {temp} = main
        const tempC = Math.round(temp - 273)
        const onClickFav = () => {
            navigate(`/weather-detail/${fav_location}`, {state : {data : fetchedData, curr: false}})
        }
        return (
            <li className="col-11 mt-2 m-md-1 pt-2 col-md-3 text-light fav-list-item" onClick={onClickFav}>
                <div>
                <div className="d-flex felx-row">
                        <IoLocationSharp size={"22px"} className="d-none d-md-flex" />
                        <IoLocationSharp size={"18px"} className="d-flex d-md-none" />
                        <h1 className="location-name">{name}/{country}</h1>
                </div>
                <div className="d-flex flex-row justify-content-between p-1">
                <div className="d-flex flex-row temperature-container align-self-center">
                        <FaTemperatureLow size={"25px"} className="d-none d-md-flex"/>
                        <FaTemperatureLow size={"25px"} className="d-flex d-md-none"/>
                        <p className="temp">{tempC}<sup>o</sup>C</p>
                </div>
                <div className="d-flex flex-row">
                          <img src={`https://openweathermap.org/img/wn/${icon}@2x.png`} alt="description-pic" className="icon-image" />
                          
                            <p className="temp mt-2"> {description}</p>
                          
                        </div>
                </div>
                </div>
            </li>
        )
    }

    const rendreViews = () => {
        const { status } = apiLocWeather;
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

    return(
    <>
        {rendreViews()}
    </>
    )
}

export default FavouriteItem