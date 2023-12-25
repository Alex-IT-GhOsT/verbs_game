import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LearnedWords from "../learnWords/LearnedWords.js";
import ShowWords from "../showWords/ShowWords.js";
import { apiUrl } from "../../config.js";

const Category = () => {
    const token = localStorage.getItem('token');
    const [arrTitles, setArrTittlles] = useState([]);
    const [learndedWords, setLearndedWords] = useState(false);

    const handleClick = () => {
        setLearndedWords(!learndedWords)
    }
 
    useEffect(() =>  {
        const getTitle = async () => {
            const response = await fetch(`${apiUrl}/api/date`,{
                method:"GET",
                headers: {
                    "Content-Typy": 'application/json',
                    "Authorization": `Bearer ${token}`
                }
            })
            const data = await response.json();
            if (data.success) {
               setArrTittlles(data.arrTitles);
            }
        }
        getTitle();
    },[])

    return <>
        <div>
            <LearnedWords
            handleClick={handleClick}
            />
            <div className="text-center">
                <h2>Выберите предлог для изучения</h2>
            </div>
            <div className="card-group justify-content-around">
                {arrTitles.map((item, ind) => {
                    return <div key={ind}>
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">{item}</h5>
                                        <p className="card-text">описание</p>
                                        <Link to={`/game/${item}`} className="btn btn-primary">начать</Link>
                                    </div>
                                </div>
                            </div>
                })}
            </div>
            {learndedWords && (
                <ShowWords />
            )}
        </div>
    </>
}

export default Category;