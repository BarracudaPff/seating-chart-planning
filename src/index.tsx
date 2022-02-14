import {render} from 'react-dom'
import React from 'react'
import {App} from "./components/App"
import {BrowserRouter, Route, Routes} from "react-router-dom"

const root = document.getElementById('root')

render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App/>} key={Math.random()}/>
            <Route path="about" element={<App/>} key={Math.random()}/>
        </Routes>
    </BrowserRouter>,
    root
)
