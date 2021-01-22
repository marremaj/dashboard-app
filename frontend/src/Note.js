import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

function Note(props) {
    const [text, setText] = useState("")
    const [newText, setNewText] = useState("")
    const [showSubmit, setShowSubmit] = useState(false)
    const [reload, setReload] = useState(false)
    useEffect(() => {
        axios.get('/notes/' + props.elementid)
            .then(function (response) {
                if (response.data.data.length !== 0){
                    setText(response.data.data[0].body)
                }
            })
            .catch(function (error) {
                console.log(error);
            });

    }, [props.elementid,reload])


    function deleteElement() {
        axios.delete("/element/"+props.elementid)
        props.reload()
    }

    function handleSubmit(e) {
        e.preventDefault()
        axios.post("/note", { "body": newText, "id": props.elementid })
        setNewText("")
        setShowSubmit(false)
        setReload(!reload)
    }
    function handleChange(event) {
        setNewText(event.target.value);
        if (newText !== "")
            setShowSubmit(true)
        else
            setShowSubmit(false)
    }
    return (
        <div className="List">
            <h3>{props.name} - NOTE <span onClick={deleteElement} className="deleter">x</span></h3>
            <div>
                {(text ? <p>{text}</p>: 
                <form onSubmit={handleSubmit}>
                    <textarea placeholder="write here..." value={newText} onChange={handleChange}/>
                    <br/>
                    {showSubmit && <input type="submit" value="+" className="plus" />}
                </form>
                
                )}
                
            </div>
        </div>
    )
}

export default Note