import {useState} from "react"
import { useNavigate } from "react-router-dom"
import Cookies from "js-cookie"
import {BsSearch} from "react-icons/bs"
import {AiOutlineLogout} from "react-icons/ai"

import "./index.css"

const Header = (props) => {
    const [city, setCity] = useState("")
    const navigate = useNavigate()
    const onChangeCity = (e) => {
        setCity(e.target.value)
    }

    const renderFailureView = () => {
        navigate("/failed-view", {state : {errorMsg : "To make search more precise put the city's name, comma, 2-letter county code"}})
    }

    const searchLocW = async() => {

        if (city !== "") {
            const apiKey = "439d4b804bc8187953eb36d2a8c26a02";
            const url = `https://openweathermap.org/data/2.5/find?q=${city}&appid=${apiKey}&units=metric`;
            const response = await fetch(url);
            const responseData = await response.json();
            if (response.ok) {
                const {list} = responseData
                if (list.length === 0) {
                    return renderFailureView()
                }
                const fetchedData = list[0]
                navigate(`/weather-detail/${city}`, {state : {data : fetchedData, curr: false}})

            } else {
                console.log("wrong")
            }
            }; 

        }
    
    const onClickAppIcon = () => {
        setCity("")
        navigate("/home")
    }

    const onLogOUt = () => {
        Cookies.remove('jwt_token')
        navigate("/")
    }

    const handleKeyPress = (event) => {
        if(event.key === 'Enter'){
          searchLocW()
        }
    }

    return(
    <div className="container-fluid header-main-container ">
        <div className="row d-flex flex-row justify-content-between pt-1 pb-1  header-back-container">
            <div className="col-2 d-flex d-md-none">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Circle-icons-weather.svg/768px-Circle-icons-weather.svg.png?20160314154011" onClick={onClickAppIcon} alt="weather-icon" className="app-icon"/>
            </div>

            <div className="col-3 d-md-flex d-none" onClick={onClickAppIcon}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Circle-icons-weather.svg/768px-Circle-icons-weather.svg.png?20160314154011"  alt="weather-icon" className="app-icon"/>
            <h1 className="header-title">SUPER WEATHER</h1>
            </div>
        
        <div className="col-9 d-flex flex-row justify-content-end">
        <div className="search-container d-flex flex-row align-self-center">
            <input type="text" placeholder="City" value={city} onChange={onChangeCity} onKeyDown={handleKeyPress} className="input d-flex d-md-none"/>
            <input type="text" placeholder="City,2-letter Country Code" value={city} onKeyDown={handleKeyPress} onChange={onChangeCity} className="input d-none d-md-flex"/>
            <button type="button" onClick={searchLocW}  className="search-button">
                <BsSearch />
            </button>
        </div>
        <div className="d-flex d-md-none align-self-center">
            <AiOutlineLogout onClick={onLogOUt} style={{color : "orange"}} size={"25px"}/>
        </div>
        <button className="d-none d-md-flex align-self-center btn btn-outline-danger" onClick={onLogOUt} type="button">LOGOUT</button>
        </div>
        
        </div>
    </div>
)}

export default Header
