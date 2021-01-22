import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

function Photo(props) {
    const [text, setText] = useState("")
    const [newText, setNewText] = useState("")
    const [reload, setReload] = useState(false)
    useEffect(() => {
        axios.get('/photos/' + props.elementid)
            .then(function (response) {
                console.log(response.data.data)
                if (response.data.data.length !== 0) {
                    console.log("jvneovjrenrekflnfjk",response.data.data[0])
                    setText(response.data.data[0].path)
                }
                else {
                    console.log("ADD PHOTO =)")
                }
            })
            .catch(function (error) {
                console.log(error);
            });

    }, [props.elementid, reload])


    function deleteElement() {
        axios.delete("/element/" + props.elementid)
        props.reload()
    }

    function handleSubmit(e) {
        e.preventDefault()
        const img = document.getElementById("image-input").files[0]
        const data = new FormData()
        data.append("image", img)
        data.append("id", props.elementid)
        axios.post("/photo", data, {headers: {'Content-Type': 'multipart/form-data' }})
        setNewText("")
        setReload(!reload)
        props.reload()
    }

    return (
        <div className="List">
            <h3>{props.name} <span onClick={deleteElement} className="deleter">x</span></h3>
            <div>
                {(text ?
                    <img src={"photo/"+text} />
                    :
                    <form onSubmit={handleSubmit}>
                        <input type="file" id="image-input"/>
                        <br />
                        <input type="submit" value="+" className="plus" />
                    </form>

                )}

            </div>
        </div>
    )
}

export default Photo