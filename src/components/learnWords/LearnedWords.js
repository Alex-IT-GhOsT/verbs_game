import React from "react";
import './LearnedWords.css'

const LearnedWords = ({handleClick}) => {

    return <>
    <div className="switchBox">
        <label className="switch">
            <input 
            type="checkbox"
            onChange={handleClick}
            />
            <span className="slider round"></span>
        </label>
    </div> 
    </>
}

export default LearnedWords;