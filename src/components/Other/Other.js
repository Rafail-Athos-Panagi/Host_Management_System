import React, { useState } from 'react';
import Tabs from 'react-bootstrap/Tabs';
import { Tab } from "react-bootstrap";
import "./Other.css"
import Todos from './Todos';
import Logging from './Logging';



export default function Other() {
    const [key, setKey] = useState('todo');
    return (
        <div className="other">
            <div className="box">
                <p className='title'>Other functions</p>
               

                <Tabs
                    id="controlled-tab"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                    className="mb-3"
                >
                    <Tab eventKey="todo" title="To-Do List">
                        <Todos/>
                    </Tab>
                    <Tab eventKey="logs" title="System Logs">
                        <Logging/>
                    </Tab>
                </Tabs>
            </div>
        </div>
    )
}
