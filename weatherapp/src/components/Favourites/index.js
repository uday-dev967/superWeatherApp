import { useEffect, useState } from "react"
import Cookies from "js-cookie";
import Loader from "react-loader-spinner";
import FavouriteItem from "../FavouriteItem"
import {LoadingViewContainer,} from "../Home/styledComponents";

import "./index.css"
import BaseUrl from "../BaseUrl";

const apiStatusConstants = {
    initial: "INITIAL",
    inProgress: "IN_PROGRESS",
    success: "SUCCESS",
    failure: "FAILURE",
};

const Favourites = () => {
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
      }, []);    
    
    const renderLoadingView = () => (
        <LoadingViewContainer>
          <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
        </LoadingViewContainer>
    );

    const renderSuccessView = () => {
        const {data} = apiFavResponse
        
        if (data.length === 0) {
          return (
            <div className="d-flex flex-row justify-content-center align-items-center">
              <p className="m-5">YOU HAVE NO FAVOURITES!</p>
            </div>
          )
        }
        return (
            <div className="container">
                <ul className="row justify-content-center unorder-list">
                    {data.map(each => <FavouriteItem key={each.id} itemDetails={each} />)}
                </ul>
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
        <div>
            {rendreViews()}
        </div>
    )
}

export default Favourites