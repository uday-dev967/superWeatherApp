import {BrowserRouter, Routes, Route} from "react-router-dom"
import Home from "./components/Home"
import FailureView from "./components/FailureView";
import WeatherDetailItem from "./components/WeatherDetailItem"
import MainPage from "./components/MainPage";
import LoginPage from "./components/LoginPage";
import Register from "./components/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute"
import './App.css';
import NotFound from "./components/NotFound";

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
      <Route  path="/" element={<MainPage />} />
        <Route path="/"  element={<ProtectedRoute />}>
          <Route exact path="/home" element={<Home />} />
          <Route exact path="/weather-detail/:loc" element={<WeatherDetailItem />} />
        </Route>
        <Route exact path="/failed-view" element={<FailureView />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
