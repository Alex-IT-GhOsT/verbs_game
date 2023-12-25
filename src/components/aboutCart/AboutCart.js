import React, { useEffect } from "react";
import { Link, useMatch } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../../config.js";

const AboutCart = () => {
 
    const match = useMatch('/game/:paramName');
    const blockName = match.params.paramName;
    const token = localStorage.getItem('token');
    const [timer, setTimer] = useState(null);
    const [quests, setQuests] = useState([]);
    const [currentQuest, setCurrentQuest] = useState(0);
    const [isAnswer, setIsAnswer] = useState(true);
    const [isFinisch, setIsFinisch] = useState(false);
    const navigate = useNavigate();
   
    const unsuccess = () => {
        setIsAnswer(false)        
    }

    useEffect(() => {
        const getQuests = async () => {
            const response = await fetch(`${apiUrl}/api/date/${blockName}`,{
                method:'GET',
                headers: {
                    "Content-Type": 'application/json',
                    "Authorization": `Bearer ${token}`
                }, 
            })
            const data = await response.json();
            if (data.success) {
                if (data.data.length !== 0) {
                    setQuests(data.data);
                } else {
                    setIsFinisch(true)
                }
            }
        }
        getQuests();
    },[])

    const success = async (numberQuest, quest) => {
        const response = await fetch(`http://localhost:3001/progressUser/`,{
            method:"POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                quest: quest,
                numberQuest: numberQuest
            })
        })
        const data = await response.json()
        if (data.success) {
            clearTimeout(timer)
        }
    }

    const answeredQuest = () => {
        setIsAnswer(true);
        setCurrentQuest((prev => prev === quests.length ? 0 && setIsFinisch(true) : prev + 1)); 
    }

    const handleButtonClick = (numberQuest, quest) => {
        setCurrentQuest((prev => prev + 1));
        const time = setTimeout(() => {
            success(numberQuest, quest);
        }, 5000)
        setTimer(time);   
    }

    useEffect(() => {
        if (quests.length !== 0 && currentQuest === quests.length) {
            setIsFinisch(true);  
        }
    },[currentQuest])

    useEffect(() => {
        if (isFinisch) {
            navigate('/isRestartGame');
        }
    },[isFinisch, navigate])

    return <>
        <div className={`block ${isAnswer ? ' ': 'rotate'}`}>
            {quests.map((quest, ind) => {
                return <div key={quest._id}>
                    {ind === currentQuest && currentQuest < quests.length ?
                    <div className="card text-center text-bg-dark mb-3" style={{width: '18rem'}}>
                        {isAnswer ? 
                        <div className="card-body">
                            <h5 className="card-title">
                                {quest.eng}  
                            </h5>
                            <div className="blockButton">
                                <button className="btn btn-success" onClick={() => handleButtonClick(currentQuest, quest)}>знаю</button>
                                <button className="btn btn-danger" onClick={unsuccess}>не знаю</button>
                            </div>
                        </div>
                        :
                        <div className="card-body rotate">
                            <h5 className="card-title">
                                {quest.rus}  
                            </h5>
                            <p>
                                {quest.explanation_eng}
                            </p>
                            <p>
                                {quest.explanation_rus}
                            </p> 
                            <button className="btn btn-danger" onClick={answeredQuest}>Ok</button>
                        </div>
                        }
                    </div>
                    :
                    null  
                    }                  
                </div>
            })}
        </div>
    </>
}

export default AboutCart;