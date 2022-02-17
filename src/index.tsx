import {render} from 'react-dom'
import React from 'react'
import {Provider} from 'react-redux'
import {ConfigProvider} from 'antd'
import store from "./redux/store"
import AppRoute from "./router"

import "./assets/styles/main.scss"

render(
    <Provider store={store}>
        <ConfigProvider>
            <AppRoute/>
        </ConfigProvider>
    </Provider>
    ,
    document.getElementById('root')
)
