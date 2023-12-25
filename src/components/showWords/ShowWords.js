import React, { useEffect, useState } from "react";
import { apiUrl } from "../../config.js";
import './ShowWords.css'

const ShowWords = () => {

    const [words, setWords] = useState([]);
    const [needToLearnWords, setNeedToLearnWords] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isOpenBlocks, setIsOpenBlocks] = useState({});
   
    const handleClick = (ind) => {
        setIsOpenBlocks((prevState) => ({
            ...prevState,
            [ind] : !prevState[ind]
        }))
    }

    useEffect(() => {
        const token = localStorage.getItem('token')
        const getWords = async () => {
            const response = await fetch(`${apiUrl}/api/date`,{
                method: "GET",
                headers: {
                    "Content-Type": 'application/json',
                    "Authorization": `Bearer ${token}`
                }
            })
            const data = await response.json();
            if (data.success) {
                setWords(data.words);
                setNeedToLearnWords(data.allWords);
                setCategories(data.arrTitles);
            }
        } 
        getWords();
    },[])

    const printText = (e) => {
        e.stopPropagation();
        const printWindow = window.open('', '_blank');
        const content = document.querySelector('.category_block.open');

        if (content) {
            printWindow.document.write(content.innerHTML);
            printWindow.print();
        }  
    }

    return (
        <div>
            <div className="category">
                {categories.map((category,ind) => {
                    
                    const isOpen = isOpenBlocks[ind] || false
                    return <div key={ind}
                    className={`category_block ${isOpenBlocks[ind] ? 'open' : ''}`}
                    onClick={() => handleClick(ind)}
                    >
                        <strong>{category}</strong>
                        {isOpen && <div>
                                <button onClick={(e) => printText(e)} id="btnPrint" className="btn btn-primary">Print</button>
                                <div>
                                    {words.map((word,ind) => {
                                        return <ul className="text-success" key={ind}>
                                            {category[0] === word.title && 
                                            
                                            <li>{word.eng} - {word.rus}</li>  
                                        }
                                        </ul>
                                    })}
                                </div>
                                <div>
                                    {needToLearnWords.map((needWord, ind) => {
                                        return <ul key={ind} className="text-danger">
                                            {category[0] === needWord.title &&
                                                <li>
                                                    {needWord.eng} - {needWord.rus}
                                                </li>
                                            }
                                        </ul>
                                    })}
                                </div>
                            </div>}
                    </div>
                })}
            </div>
        </div>
    )
}

export default ShowWords;