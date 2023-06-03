import {useForm} from "react-hook-form"
import Cookies from "js-cookie"
import * as yup from "yup"
import {yupResolver} from "@hookform/resolvers/yup"
import {useNavigate,Navigate} from "react-router-dom"
import BaseUrl from "../BaseUrl"
import "./index.css"



const Register = (props) => {
    const navigate = useNavigate()
    
    const schema = yup.object().shape({
        name : yup.string().required(),
        email : yup.string().email().required(),
        password : yup.string().min(8).required(),
        confirmPassword : yup.string().oneOf([yup.ref("password"),null], "Passwords Don't Match").required("This Feild is Required"),
    })
    const {register, handleSubmit, formState:{errors}} = useForm({
        resolver : yupResolver(schema)
    })
    const onSubmit = async (data) => {
        console.log(data)
        console.log(typeof(data))
        if (data) {
            const url = `${BaseUrl}/users`
            const option = {
                method : "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body : JSON.stringify(data)
            }
            const response = await fetch(url, option)
            const fetchedData = await response.json()
            if (response.ok === true) {
                console.log(fetchedData.result)
                navigate("/login")
            }
            else {
                console.log(fetchedData.result)
            }
        }
    }

    const jwtToken = Cookies.get('jwt_token')
        if (jwtToken !== undefined) {
        return <Navigate to="/home" />
    }

    const onClickLogin = () => {
        navigate("/login")
    }
    
    return (
        <div className="container-fluid form-bg-container w-100 vh-100 d-flex flex-column justify-content-center text-light">
            <div className="row d-flex flex-row justify-content-center">
                <div className="col-lg-6 col-12 d-flex flex-column justify-content-center align-items-center">
                    <h1>SUPER WEATHER</h1>
                    <p>SIGN UP NOW</p>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column col-12 col-lg-4 ml-3">
                    <label className="mt-3" htmlFor="fullname">FULL NAME</label>
                    <input type="text" className="form-input" id="fullname" placeholder="FullName" {...register("name")}/>
                    {errors.name && <p className="text-warning">*{errors.name.message}</p>}
                    <label className="mt-3" htmlFor="email">EMAIL</label>
                    <input type="text" className="form-input" id="email" placeholder="EMAIL" {...register("email")}/>
                    {errors.email && <p className="text-warning">*{errors.email.message}</p>}
                    <label className="mt-3" htmlFor="password">PASSWORD</label>
                    <input type="password" className="form-input" id="password" placeholder="PASSWORD" {...register("password")}/>
                    {errors.password && <p className="text-warning">*{errors.password.message}</p>}
                    <label className="mt-3"  htmlFor="confrimPassword">CONFRIM PASSWORD</label>
                    <input type="password" className="form-input" id="confrimPassword" placeholder="CONFIRM PASSWORD" {...register("confirmPassword")}/>
                    {errors.confirmPassword && <p className="text-warning">*{errors.confirmPassword.message}</p>}
                    <button type="submit" className="btn btn-outline-warning mt-3">CREATE ACCOUNT</button>
                    <h6 className="mt-2">Already have an account? <span onClick={onClickLogin} className="text-warning login-tag">Login</span></h6>
                </form>
        </div>
        </div>
    )
}

export default Register