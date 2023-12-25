import React, { useState, useEffect } from "react";
import { apiUrl } from "../../config.js";
import DeleteProgress from "../deleteProgress/DeleteProgress.js";
import './Progress.css'

const Progress = () => {
    const [knowQuestions, setKnowQuestions] = useState([]);
    const [totalWords, setTotalWords] = useState([]);
    const [progress, setProgress] = useState(0)
    
    useEffect(() => {
        const token = localStorage.getItem('token')
        const getProgressFromServer = async () => {
            const response = await fetch(`${apiUrl}/api/date`,{
                method:"GET",
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            const data = await response.json();
            if (data.success) {
                setKnowQuestions(data.words);
                setTotalWords(data.totalWords);
            }
        }
        getProgressFromServer();
    },[])

    const getProgressPercentage = (category) => {
        const total = totalWords.find(item => Object.keys(item)[0] === category);
        const know = knowQuestions.filter(item => item.title === category);
        return Math.round((know.length / total[category]) * 100);
      };

      console.log(progress)
      return (
        <>
        <div className="progress-container">
          <div className="titleProgress">
            <h4>Your progress</h4>
          </div>
          {totalWords.map((total, index) => {
            const category = Object.keys(total)[0];
            const progress = getProgressPercentage(category);
            return (
              <div className="progressbar" key={index}>
                <div className="progress-text">
                  <span><strong>{category}</strong></span>
                </div>
                <div className="progress" role="progressbar" aria-label="Example with label" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
                    <div className="progress-bar" style={{width: `${progress}%`}}>{progress}%</div>
                </div>
              </div>
            );
          })}
        </div>
        <DeleteProgress />
        </>
      );
}

export default Progress;