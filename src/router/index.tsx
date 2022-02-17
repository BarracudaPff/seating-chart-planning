import React from 'react'
import { MainRoutes } from './routes'
import { BrowserRouter as Router } from 'react-router-dom'
import config from '../config'

export default function () {
    return (
        <Router basename={config.baseURL}>
            <MainRoutes />
        </Router>
    )
}
