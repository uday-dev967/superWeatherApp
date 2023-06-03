import {useState} from "react"
import { Navigate, useNavigate } from "react-router-dom"
import {useForm} from "react-hook-form"
import Cookies from "js-cookie"
import * as yup from "yup"
import {yupResolver} from "@hookform/resolvers/yup"
import BaseUrl from "../BaseUrl"

const LoginPage = () => {
    const [errorMsg, setErrorMsg] = useState(null)
    const navigate = useNavigate()
    const schema = yup.object().shape({
        email : yup.string().email().required(),
        password : yup.string().required(),
    })
    const {register, handleSubmit, formState:{errors}} = useForm({
        resolver : yupResolver(schema)
    })
    
    const onSubmitSuccess = (token) => {
        Cookies.set('jwt_token', token, {expires: 30})
        navigate("/home")
    } 

    const onSubmit = async(credential) => {
        const url = `${BaseUrl}/login`
        const option = {
            method : "POST",
            headers : {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify(credential)
        }
        const response = await fetch(url, option)
        const data = await response.json()
        if (response.ok === true) {
            setErrorMsg(null)
            onSubmitSuccess(data.jwtToken)
        }
        else{
            setErrorMsg(data.error_msg)
        }
    }
    const jwtToken = Cookies.get('jwt_token')
        if (jwtToken !== undefined) {
        return <Navigate to="/home" />
    }

    const onClickSignUp = () => {
        navigate("/register")
    }

    return (
        <div className="container-fluid form-bg-container w-100 vh-100 d-flex flex-column justify-content-center text-light">
            <div className="row d-flex flex-row justify-content-center">
                <div className="col-lg-6 col-12 d-flex flex-column justify-content-center align-items-center">
                    <h1>SUPER WEATHER</h1>
                    <p>LOG IN</p>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column col-12 col-lg-4 ml-3">
                    <label className="mt-3" htmlFor="email">EMAIL</label>
                    <input type="text" className="form-input" id="email" placeholder="EMAIL" {...register("email")}/>
                    {errors.email && <p className="text-warning">*{errors.email.message}</p>}
                    <label className="mt-3" htmlFor="password">PASSWORD</label>
                    <input type="password" className="form-input" id="password" placeholder="PASSWORD" {...register("password")}/>
                    {errors.password && <p className="text-warning">*{errors.password.message}</p>}
                    <button type="submit" className="btn btn-outline-warning mt-3">DIVE IN</button>
                    {errorMsg && <p className="text-warning">*{errorMsg}</p>}
                    <h6 className="mt-2">Don't have an account? <span onClick={onClickSignUp} className="text-warning login-tag">sign up</span></h6>
                </form>
            </div>
        </div>
    )
}

export default LoginPage