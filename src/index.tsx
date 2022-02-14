import * as React from "react";
import {render} from "react-dom";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import App from "./components/App";
import MainRouter from "./routes/main";

const rootEl = document.getElementById("root");

render(
    <MainRouter/>,
    // <App />,
    // <BrowserRouter>
    //     <Routes>
    //         <Route path="/" element={<App />} />
    //         {/*<Route path="expenses" element={<Expenses />} />*/}
    //         {/*<Route path="invoices" element={<Invoices />} />*/}
    //     </Routes>
    // </BrowserRouter>,
    rootEl
);
