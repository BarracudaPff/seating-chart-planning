import * as React from "react";
import {ChangeEvent, useState} from "react";
import {Button} from "antd";
import "./../assets/scss/App.scss";
import {Link} from "react-router-dom";

const reactLogo = require("./../assets/img/react_logo.svg");

const App = () => {
    const [input, setInput] = useState<string>("");

    const onInput = (event: ChangeEvent<HTMLTextAreaElement>) => {
        // console.log({zlib: zlib.inflateSync})
        const value = event.target.value
        setInput(value);
    }

    return (
        <div className="app">
            <h1>DDD</h1>
            <p>Foo 1to11 the barz</p>
            <img src={reactLogo.default} height="480"/>
            <div>
                <textarea className={"long-input"} value={input} onChange={onInput}/>
            </div>
            <div className={"ad"}>
                {input}
            </div>
            <div className="App">
                <Button type="primary">Button</Button>
            </div>
            <nav>
                <Link to="/invoices">Invoices</Link> |{" "}
                <Link to="/expenses">Expenses</Link>
            </nav>
        </div>
    )
}

export default App;
