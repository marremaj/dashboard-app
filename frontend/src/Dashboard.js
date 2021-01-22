import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import List from './List';
import Adder from './Adder';
import Note from './Note';
import Photo from './Photo';

function Dashboard(props) {
    const [name, setName] = useState(null)
    const [lists, setLists] = useState([])
    const [reload, setReload] = useState(true)
    useEffect(() => {
        axios.get('/dashboard/' + props.dash)
            .then(function (response) {
                setName(response.data.data[0].name)
            })
            .catch(function (error) {
                console.log(error);
            });
        axios.get('/elements/' + props.dash)
            .then(function (response) {
                setLists([])
                const newElements = []
                for (const el of response.data.data) {
                    if (el.type === "list") {
                         newElements.push(<List key={el.id} listid={el.id} name={el.name} reload={()=>setReload(!reload)}/>)
                    }
                    else if (el.type === "note") {
                        newElements.push(<Note key={el.id} elementid={el.id} name={el.name} reload={()=>setReload(!reload)}/>)
                    }
                    else if (el.type === "photo") {
                        newElements.push(<Photo key={el.id} elementid={el.id} name={el.name} reload={()=>setReload(!reload)}/>)
                    }
                    else {
                        console.log(el)
                    }
                }
                setLists(newElements)
            })
            .catch(function (error) {
                console.log(error);
            });
    }, [props.dash, reload])
    return (
        <div>
            <h1>{name}</h1>
            <div className="dashBody">
                {lists}
                <div className="List">
                <h3>Add New List</h3>
                <Adder type="Element" did={props.dash} reload={()=>{setReload(!reload)}}/>
                </div>
            </div>
        </div>
    )
}

export default Dashboard