

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
    const [bthGetQuest, setBtnGetQuest] = useState(true)
    
    const getInfFromServer = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/date');
            const data = await response.json();
            const noQuestFromLocal = JSON.parse(localStorage.getItem('noQuest'));
            const knowQuesrFormLocal = JSON.parse(localStorage.getItem('knowQuest'));
            localStorage.setItem('allQuest',JSON.stringify(data));
            const storeQuestions = JSON.parse(localStorage.getItem('allQuest'));
            
            if (noQuestFromLocal !== null && knowQuesrFormLocal !== null) {
               const filter = storeQuestions.filter((elem) => noQuestFromLocal.includes(elem._id) && knowQuesrFormLocal.includes(elem._id) );
               setQuest(filter);
            } else {
                setQuest(data);
                setQuestSave(data);
            } 
            
            }catch(error){
                console.log('Ошибка при получении данных', error);
            }
            setBtnGetQuest(false);
    }

    const handleShowAnswer = () => {
        setShowAnswer(true);
        setHiddenBtn(false);
    }

    const handleNextQuest = (questionId) => {
        if (currentInd < quest.length -1) {
            setCurrentInd((prev) => prev === quest.length - 1 ? 0 : prev + 1);
            setKnowQuest([...knowQuest, questionId]);
            localStorage.setItem('knowQuest',JSON.stringify([...knowQuest, questionId]));
        } else {
            setEnd(false);
        }
    }

    const handleOk = (questionId) => {
        if (currentInd < quest.length -1) {
            setHiddenBtn(true);
            setShowAnswer(false);
            setCurrentInd((prev) => prev === quest.length - 1 ? 0 : prev + 1);
            setNoAnsweredQuestions([...noAnsweredQuestions, questionId]);
            localStorage.setItem('noQuest',JSON.stringify([...noAnsweredQuestions, questionId]));
        } else {
            setEnd(false);
        }
    }

    const handleAgainGame = () => {
        setEnd(true);
        setCurrentInd(0);
        setQuest(questSave);
        localStorage.removeItem('noQuest');
        localStorage.removeItem('knowQuest');
        setBtnGetQuest(true);
    }

    return <>
        <div>
            {
                bthGetQuest && <button className="btn btn-primary" onClick={getInfFromServer}>Получить карту</button>
            }
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

