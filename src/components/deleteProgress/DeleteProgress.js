import React, { useState } from "react";
import './DeleteProgress.css';
import { apiUrl } from "../../config.js";

const DeleteProgress = () => {
   
    const [notivication, setNotivication] = useState(null);
    const [isDelProgress, setIsDelProgress] = useState(false);
    const [notProgress, setNotProgress] = useState(false);

    const handleClick = () => {
        setNotivication(!notivication)
    }

    const handleClickCloseInf = () => {
        setNotProgress(!notProgress)
    }

    const handleClickCloseSuccess = () => {
        setIsDelProgress(!isDelProgress)
    }

    const handleClickDelete = async() => {
        const token = localStorage.getItem('token')
        const response = await fetch(`${apiUrl}/deleteProgress`, {
            method:"GET",
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        const data = await response.json();
        if (data.success) {
            setIsDelProgress(!isDelProgress);
            setNotivication(!notivication);
        } else {
            setNotProgress(!notProgress);
            setNotivication(!notivication);
        }
    }

    return (
        <>
        <div className="blockProgress">
            <div>
                <span><i>Удалить весь свой прогресс?</i></span>
            </div>
            <button className="btn btn-warning" onClick={handleClick}>
             удалить
            </button>
        </div>
        {notivication && 
            <div className="modalBlockMain">
                <div className="modalBlock">
                    <span><strong>Do you watn to delete your progress?</strong></span>
                    <div className="btnBlock">
                        <button onClick={handleClickDelete} className="btn btn-success">Yes</button>
                        <button onClick={handleClick} className="btn btn-danger">No</button>
                    </div>
                </div>
            </div>
        }
        {isDelProgress && (
        <div className="alert alert-success text-center" role="alert">
            <div className="closeBlock">
                <h4 className="alert-heading title">Весь прогресс удален</h4>
                <button onClick={handleClickCloseSuccess} className="btn btn-close btnTitle"></button>
            </div>
        </div>  
        )}
        {notProgress && (
        <div className="alert alert-danger text-center mainCloseBlock" role="alert">
            <div className="closeBlock">
                <h4 className="alert-heading title">Прогресс пуст</h4>
                <button onClick={handleClickCloseInf} className="btn btn-close btnTitle"></button>
            </div>
        </div> 
        )}
        </>
    )
}

export default DeleteProgress;