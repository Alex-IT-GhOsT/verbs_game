

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
                setQuest(data)
                setQuestSave(data);
            })
            .catch(error => {
                console.log('Ошибка при получении данных', error);
            });

            
    }

    console.log(knowQuest)

    

    const handleShowAnswer = () => {
        setShowAnswer(true)
        setHiddenBtn(false)
        
    }

    const handleNextQuest = (questionId) => {
            setCurrentInd((prev) => prev === quest.length - 1 ? 0 : prev + 1)
            setKnowQuest([...knowQuest, questionId])
            localStorage.setItem('knowQuest',JSON.stringify([...knowQuest, questionId]))
    }

    const handleOk = (questionId) => {
        if (currentInd < quest.length -1) {
            setHiddenBtn(true)
            setShowAnswer(false)
            setCurrentInd((prev) => prev === quest.length - 1 ? 0 : prev + 1)
            setNoAnsweredQuestions([...noAnsweredQuestions, questionId])
            localStorage.setItem('noQuest',JSON.stringify([...noAnsweredQuestions, questionId]))
           
        }
    }

    console.log(noAnsweredQuestions)
    console.log(quest)
    console.log(knowQuest)

    const handleAgainGame = () => {
        setEnd(true)
        setCurrentInd(0)
        setQuest(questSave)
    }

    

    console.log('не знаю',localStorage.getItem('noQuest'))
    console.log('знаю',localStorage.getItem('knowQuest'))
  
    //localStorage.removeItem('noQuest')
    //localStorage.removeItem('knowQuest')

  
    
    return <>
        <div>
            <button className="btn btn-primary" onClick={getInfFromServer}>Получить карту</button>
        </div>
        {end && quest.map((elem,ind) => {
            return <div key={elem._id}>
                {ind === currentInd ?
                <>
                <h5>{elem.eng}</h5>
                {showAnswer && <>
                    <p className="card-text">Russian: {elem.rus}</p>
                    <button className="btn btn-success" onClick={() => handleOk(elem._id)}>ок</button>
                </>}
                {hiddenBtn && 
                    <button className="btn btn-success" onClick={() => handleNextQuest(elem._id)}>знаю</button>
                }
                {!showAnswer && 
                        <button className="btn btn-danger" onClick={handleShowAnswer}>не знаю</button>
                }
                </>
                :
                null
            }
            </div>
        })}
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

