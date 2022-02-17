import React, {FC} from "react"
import qs from "query-string"
import {Navigate, useLocation} from "react-router-dom"
import {useSelector} from "react-redux"
import config from "../../config"
import {AppState} from "../../redux"

type Props = {
    element: FC | React.ComponentClass
    meta?: Record<string, any>
}

const PrivateRoute: FC<Props> = ({element: Component, meta = {}, ...rest}) => {
    const {pathname, search} = useLocation()
    const {isLogin} = useSelector((state: AppState) => state.user)
    const isLoginPage = pathname === "/" || pathname === "/login"

    React.useEffect(() => {
        if (meta.title) {
            document.title = `${meta.title} - ${config.title}`
        } else {
            document.title = config.title
        }
    }, [meta])

    if (isLoginPage && isLogin) {
        const redirectUrl = qs.parse(search).redirectUrl as string
        const url = redirectUrl || ("/home/index" + search)
        return <Navigate to={url} replace/>
    }

    if (meta.requiresAuth) {
        if (isLogin) {
            return <Component {...rest} />
        } else {
            if (!isLoginPage) {
                return <Navigate to={`/?redirectUrl=${pathname}${search}`} replace/>
            }
        }
    }

    return <Component {...rest} />
}

export default PrivateRoute
