import React, { useState } from "react";
import Card from "../card/Card.js";
import { Link } from "react-router-dom";
import { apiUrl } from "../../config.js";
import UserSuccess from "../userSuccess/UserSucces.js";

const FormRegister = ({handleLogin, getName}) => {

    const [formDate, setFormDate] = useState({
        name: '',
        password: '',
        email: ''
    })
    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    const [messageServer, setMessageServer] = useState('')
    const [againReg, setAgainReg] = useState(false)

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormDate((prevForm) => ({
            ...prevForm, 
            [name] : value
        }))
    }

    const successUser = () => {
        handleLogin();
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const response = await fetch(`${apiUrl}/registerUser`, {
                method:'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formDate)
            });
            const data = await response.json();
            console.log(data)
            if (data.success) {
                localStorage.setItem('token1', data.authorization);
                setRegistrationSuccess(true);
                successUser();
                getName(formDate.name)
                
            } else {
                setAgainReg(true);
                setMessageServer(data.message);
                setRegistrationSuccess(false);
            }
        } catch (err) {
            console.log(err);
        }
    }

    return <>
        {!registrationSuccess ? <>
            <div className="text-center">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <form className="form-signin" onSubmit={handleSubmit}>
                            <h1 className="h3 mb-3 font-weigth-normal">New register</h1>
                            <input className="form-control mb-2"
                                type="text"
                                name="name"
                                value={formDate.name}
                                onChange={handleChange}
                                placeholder="name"
                                autoFocus
                                required/>
                            <input 
                                className="form-control  mb-2"
                                type="password"
                                name="password"
                                value={formDate.password}
                                onChange={handleChange}
                                placeholder="password"
                                autoFocus
                                required/>
                            <input 
                                className="form-control  mb-2"
                                type="email"
                                name="email"
                                value={formDate.email}
                                onChange={handleChange}
                                placeholder="email"
                                autoFocus
                                required/>
                            <input className="btn btn-primary btn-lg btn-block" type="submit" value='Sing up'/>
                        </form>
                    </div>
                </div>
            </div>
            {againReg && <div className="alert alert-primary mt-3" role="alert">
                {messageServer}
                <button  onClick={() => setAgainReg(false)}>&times;</button>
                </div>}
        </> :  <UserSuccess name={formDate.name} />
        }
    </>
}

export default FormRegister;