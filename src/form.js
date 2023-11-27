import React, { useState } from "react";
import Card from "./card.js";
const FormRegister = () => {

    const [formDate, setFormDate] = useState({
        name: '',
        password: '',
        email: ''
    })

    const [registrationSuccess, setRegistrationSuccess] = useState(false);
    console.log(formDate)

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormDate((prevForm) => ({
            ...prevForm, 
            [name] : value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            const response = await fetch('http://localhost:3001/registerUser', {
                method:'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formDate)
            });

            const data = await response.json()

            if (data.success) {
                console.log('good')
                setRegistrationSuccess(true);
            } else {
                console.log('no')
                setRegistrationSuccess(false);
            }
        } catch (err) {
            console.log(err)
        }
    }



    return <>
    <div>
        {!registrationSuccess ? (
        <form onSubmit={handleSubmit}>
        <input 
            type="text"
            name="name"
            value={formDate.name}
            onChange={handleChange}
            placeholder="name"
        />
        <input 
            type="password"
            name="password"
            value={formDate.password}
            onChange={handleChange}
            placeholder="password"
        />
        <input 
            type="email"
            name="email"
            value={formDate.email}
            onChange={handleChange}
            placeholder="email"
        />
        <input type="submit" value='зарегистрироваться'/>
        </form>
            ) : <>
            <p>Вы успешно зарегистрировались!</p>
            <Card/> 
            </>
            
        }
    </div>
    
    </>
}

export default FormRegister;