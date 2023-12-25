import React, { useEffect, useState } from "react";
import {useNavigate} from "react-router-dom";
import { apiUrl } from "../../config.js";

const Login = ({handleLogin, getName}) => {
   
    const navigate = useNavigate();
    const [isUser, setIsUser] = useState({
        email: '',
        password: '',
    })
    const [isReg, setIsReg] = useState(null);
    const [mes, setMes] = useState('');
    const [servMes, setServMes] = useState(false);

    const succesUser = () => {
        handleLogin()
    }

    const handleChange = (e) => {
        const {name, value} = e.target
        setIsUser((prev) => ({
            ...prev, 
                [name] : value
            }  
        ))
    }

    const sendToServer = async (e) => {
        e.preventDefault();
        try{
            const response = await fetch(`${apiUrl}/checkUser`, {
                method:"POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(isUser)
            })
            const data = await response.json();
            if (data.success) {
                setIsReg(true);
                getName(data.name);
                succesUser();
                localStorage.setItem('token', data.authorization);
            } else {
                setIsReg(false);
                setServMes(true);
                setMes('Такой пользователь не зарегистрирован или неправильное имя пользователя или пароль');
            }
        }catch (err) {
            console.log(err);
        }
    }
    
    useEffect(() => {
        if (isReg) {
            navigate('/userSuccess');
        }
    },[isReg])

    return <>
     {!isReg && <>
            <div className="text-center row justify-content-center">
                <div className="col-md-6">
                    <form className="form-signin" onSubmit={sendToServer} >
                        <h1 className="h3 mb-3 font-weigth-normal">Please sign in</h1>
                        <input 
                            type="email" 
                            id="inputEmail" 
                            className="form-control mb-2" 
                            placeholder="Email address"
                            name="email" 
                            value={isUser.email}
                            onChange={handleChange}
                            required 
                            autoFocus
                        />
                        <input 
                            type="password" 
                            id="inputPassword"
                            name="password" 
                            className="form-control" 
                            placeholder="Password" 
                            value={isUser.password}
                            onChange={handleChange}
                            required 
                            autoFocus 
                        />
                        <div className="checkbox mb-3 mt-3">
                            <label>
                                <input type="checkbox" value="remember-me"/>
                                Remember-me
                            </label>
                        </div>
                        <button className="btn btn-lg btn-primary btn-block" type="submit">Sing in</button>
                    </form>
                </div>
            </div>
        
        {servMes && <div className="alert alert-danger text-center" role="alert">
            {mes}
            <button  onClick={() => setServMes(false)}>&times;</button>
            </div>
        }
     </>
        }  
    </>
}
export default Login;