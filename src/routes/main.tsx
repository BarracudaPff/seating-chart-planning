import React from "react"
import {BrowserRouter, Route, Routes} from "react-router-dom";
import App from "../components/App";
import Expenses from "./expenses";
import Invoices from "./invoices";

const MainRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App/>}/>
                <Route path="expenses" element={<Expenses/>}/>
                <Route path="invoices" element={<Invoices/>}/>
            </Routes>
        </BrowserRouter>
    )
}

// setConfig({
//     logLevel: "warn"
// })
// export default hot(module)(MainRouter);
export default MainRouter
