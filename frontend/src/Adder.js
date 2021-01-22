import './App.css';
import { useState } from "react"
import axios from "axios"


function Adder(props) {
    const [name, setName] = useState("")
    const [open, setOpen] = useState(false)
    const [type, setType] = useState("list")
    function handleSubmit(e) {
        if (props.type === "Dashboard") {
            axios.post("/dashboard", {"name": name})
        }
        else if (props.type === "Element") {
            e.preventDefault()
            console.log(type)
            axios.post("/element", {"name": name, "did": props.did, "type": type})
            props.reload()
        }
        else {
            console.log(props.type)
        }
        setName("")
    }
    function handleSetName(event) {
        setName(event.target.value);
    }
    function toggle() {
        setOpen(!open)
    }
    
    return (
        <>
        <button  className="plus" onClick={toggle}>{open?"x":"+"}</button>
        {open&&
            <form onSubmit={handleSubmit}>
                <label htmlFor="newName">Name:</label>
                <input id="newName" name="name" type="text" value={name} onChange={handleSetName} minLength={3} />
                {(props.type === "Element")&&
                    <>
                    <br/>
                    <select name="type" id="type" onChange={x => {setType(x.target.value)}}>
                        <option value="list">List</option>
                        <option value="photo">Photo</option>
                        <option value="note">Note</option>
                    </select>
                    <br/>
                    </>
                }
                <input type="submit"/>
            </form>
        }
        </>
    )
}

export default Adder