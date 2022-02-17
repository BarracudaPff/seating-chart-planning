import * as React from "react"
import "../assets/styles/App.scss"

const reactLogo = require("./../assets/img/react_logo.svg")

export const App = () => {
    return (
        <div className="app">
            <h1>Hellhfgo W23orld!</h1>
            <p>Foo to the barz</p>
            <img src={reactLogo.default} height="480"/>
        </div>
    )
}
