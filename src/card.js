

import React, { useEffect, useState } from "react";


const Card = () => {

    const [quest, setQuest] = useState([]);
    const [questSave, setQuestSave] = useState([]);
    const [noAnsweredQuestions, setNoAnsweredQuestions] = useState([])
    const [currentInd, setCurrentInd] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [end, setEnd] = useState(true)
    const [knowQuest, setKnowQuest] = useState([])
    const [hiddenBtn, setHiddenBtn] = useState(true)

  
    const getInfFromServer = () => {
        fetch('http://localhost:3001/api/date')
            .then(response => response.json())
            .then(data => {
                const know = JSON.parse(localStorage.getItem('know'))
                if (know !== null) {
                    const filter = data.filter((_, index) => !know.includes(index))
                    console.log(filter)
                    setQuest(filter);
                } else {
                    setQuest(data)
                }
                
                setQuestSave(data);
            })
            .catch(error => {
                console.log('Ошибка при получении данных', error);
            });

            
    }

    console.log(knowQuest)

    const handleShowAnswer = () => {
        setShowAnswer(true)
        setNoAnsweredQuestions([...noAnsweredQuestions,currentInd])
        setHiddenBtn(false)
        setCurrentInd((prev) => prev === quest.length - 1 ? 0 : prev + 1)
        localStorage.setItem('dontKnow',JSON.stringify([...noAnsweredQuestions,currentInd]))  
    }

    const handleNextQuest = () => {
        if (currentInd < quest.length -1) {
            setShowAnswer(false)
            setCurrentInd((prev) => prev === quest.length - 1 ? 0 : prev + 1)
            setKnowQuest([...knowQuest, quest._id])
            localStorage.setItem('know', JSON.stringify([...knowQuest,currentInd]))
        } else {
            setEnd(false)
        }
    }

    const handleOk = () => {
        setShowAnswer(false)
        setHiddenBtn(true)
    }

    console.log(noAnsweredQuestions)
    console.log(quest)
    console.log(knowQuest)

    const handleAgainGame = () => {
        setEnd(true)
        setCurrentInd(0)
        setQuest(questSave)
    }

    

    console.log('не знаю',localStorage.getItem('dontKnow'))
    console.log('знаю',localStorage.getItem('know'))
  
    //localStorage.removeItem('dontKnow')
    //localStorage.removeItem('know')

  
    
    return <>
        <div>
            <button className="btn btn-primary" onClick={getInfFromServer}>Получить карту</button>
        </div>
        {end && quest.length > 0 && (
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">English: {quest[currentInd].eng}</h5>
                    {showAnswer && <>
                        <p className="card-text">Russian: {quest[currentInd].rus}</p>
                        <button className="btn btn-success" onClick={handleOk}>ок</button>
                    </>
                    }
                    {hiddenBtn && 
                    <button className="btn btn-success" onClick={handleNextQuest}>знаю</button>
                    }
                    
                    {!showAnswer && 
                        <button className="btn btn-danger" onClick={handleShowAnswer}>не знаю</button>
                    }
                </div>
        </div>
        )}
        {!end && 
            <div>
                <p>Вопросов больше нет</p>
                <button className="btn btn-secondary" onClick={handleAgainGame}>Начать сначала</button>
            </div>   
        }
        <div>

        </div>
        
    </>
        
    
}

export default Card;

