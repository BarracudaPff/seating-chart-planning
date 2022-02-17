import React, {FC} from "react"
import "./style.scss"
import {Button, Result} from "antd"
import {useNavigate} from "react-router-dom"
import {ExceptionStatusType, ResultProps} from "antd/lib/result"
import {NumberMap} from "../../models/types"

interface Props {
    status?: ExceptionStatusType
}

const statusMap: NumberMap<ResultProps> = {
    403: {
        title: "403",
        subTitle: "Sorry, you are not authorized to access this page.",
    },
    404: {
        title: "404",
        subTitle: "Sorry, the page you visited does not exist.",
    },
    500: {
        title: "500",
        subTitle: "Sorry, the server is wrong.",
    }
}

const NoMatch: FC<Props> = ({status = "404"}) => {
    const navigate = useNavigate()

    const goBack = () => navigate(-1)
    return (
        <Result
            status={status}
            extra={<Button type="primary" onClick={goBack}>Back</Button>}
            {...statusMap[status]}
        />
    )
}

export default NoMatch
