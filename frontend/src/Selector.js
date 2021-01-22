import './App.css';
import axios from 'axios';
import React, { useState, useEffect } from 'react';


function Selector(props) {
    const [dashboards, setDashboards] = useState([]);
    useEffect(() => {
        axios.get('/dashboards')
            .then(function (response) {
                console.log(response);
                setDashboards(response.data.data.map(d => { return (<option value={d.id} key={d.id}>{d.name}</option>) }))
                if (response.data.data) {
                    props.setDash(response.data.data[0].id)
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }, [])

    return (
        <>
            <label htmlFor="dashes">Choose a Dashboard:</label>
            <select name="dashes" id="dashes" onChange={x => {props.setDash(x.target.value)}}>
                {dashboards}
            </select>
        </>
    )
}

export default Selector