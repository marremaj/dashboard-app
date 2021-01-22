import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

function List(props) {
    const [objects, setObjects] = useState([])
    const [newObject, setNewObject] = useState("")
    const [showSubmit, setShowSubmit] = useState(false)
    const [reload, setReload] = useState(false)
    useEffect(() => {
        axios.get('/listobjects/' + props.listid)
            .then(function (response) {
                console.log(response.data.data)
                setObjects(response.data.data.map(x => { return <p key={x.id}>{x.title} <span className="deleter" onClick={() => deleteObject(x.id)}>x</span></p> }))
            })
            .catch(function (error) {
                console.log(error);
            });

    }, [props.listid,reload])

    function deleteObject(id) {
        axios.delete("/listobject/"+id)
        setReload(!reload)
    } 

    function deleteList() {
        axios.delete("/element/"+props.listid)
        props.reload()
    }

    function handleSubmit(e) {
        e.preventDefault()
        setObjects([...objects, <p className="listObject" key={objects.length}>{newObject}</p>])
        axios.post("/listobject", { "name": newObject, "id": props.listid })
        setNewObject("")
        setShowSubmit(false)
        setReload(!reload)
    }
    function handleChange(event) {
        setNewObject(event.target.value);
        if (newObject !== "")
            setShowSubmit(true)
        else
            setShowSubmit(false)
    }
    return (
        <div className="List">
            <h3>{props.name} <span onClick={deleteList} className="deleter">x</span></h3>
            <div>
                {objects}
                <div className="ObjectAdder">
                    <form onSubmit={handleSubmit}>
                        <input type="text" value={newObject} onChange={handleChange} />
                        <br />
                        {showSubmit && <input type="submit" value="+" className="plus" />}
                    </form>
                </div>
            </div>
        </div>
    )
}

export default List