import React, {useEffect, useState, useMemo, FC} from "react"
import "./style.scss"
// import Avatar from '@/components/avatar'
import moment from "moment"
import config from "../../config"
import {Layout, Badge, Popover, Empty, Avatar} from "antd"
import {Link} from "react-router-dom"
// import { HomeMainState } from '@/views/main/index'
// import { useSelector } from 'react-redux'
// import { logout } from '@/store/actions/user'
// import { serviceGetInnerMessage } from '@/services'
import {fullscreen, exitFullscreen} from "../../utils"
import {
    PoweroffOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    BellFilled,
    BugFilled,
    GithubOutlined,
    FullscreenExitOutlined,
    FullscreenOutlined
} from "@ant-design/icons"
import {AppState} from "../../redux"
import {useSelector} from "react-redux"

const {Header} = Layout
const popoverList = [
    {name: "personal center", path: "/home/setting/base"},
    {name: "notification", path: "/home/setting/notification"},
    {name: "Account Settings", path: "/home/setting/account"}
]

type Props = {
    collapsed?: boolean
    setCollapsed?: React.MouseEventHandler<HTMLSpanElement>
}

const logout = () => console.log("logout")

const PopoverContent = (
    <div className="popover-content">
        {popoverList.map(el => <Link to={el.path} key={el.name} className="ls">{el.name}</Link>)}
        <div className="ls sign-out" onClick={logout}>
            <PoweroffOutlined style={{fontSize: "14px", marginRight: "5px"}}/>
            Quit
        </div>
    </div>
)

const HomeHeader: FC<Props> = ({
                                                  collapsed,
                                                  setCollapsed,
                                              }) =>{
    const [messageList, setMessageList] = useState([])
    const [unReadCount, setUnReadCount] = useState(0)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const {userInfo} = useSelector((state: AppState) => state.user)

    useEffect(() => {
        // serviceGetInnerMessage({pageSize: 5})
        //     .then(res => {
        //         let count = 0
        //         const data = res.rows.map((item: any) => {
        //             item.createdAt = moment(item.createdAt).format("YYYY-MM-DD HH:mm")
        //             if (!item.hasRead) {
        //                 count++
        //             }
        //             return item
        //         })
        //         setUnReadCount(count)
        //         setMessageList(data)
        //     })
    }, [])

    const MessageContent = useMemo(() => (
        <div className="message-popover">
            <div className="msg-header item-block">
                <span className="left">站内消息通知</span>
                <Link className="right" to="/home/setting/notification">Message reception management</Link>
            </div>
            {messageList.length > 0 ? (
                <>
                    {messageList.map((item: any) => (
                        <div className="item-block ls" key={item.id}>
                            <div className="content">{item.content}</div>
                            <div className="date">{item.createdAt}</div>
                        </div>
                    ))}
                    <Link className="item-block ls" to="/home/setting/innerMessage">see more</Link>
                </>
            ) : (
                <Empty style={{padding: "20px 0"}}/>
            )}
        </div>
    ), [messageList])

    function handleFullscreen() {
        setIsFullscreen(isFullscreen => {
            isFullscreen ? exitFullscreen() : fullscreen()
            return !isFullscreen
        })
    }

    return (
        <Header>
            <div className="left">
                {collapsed ? (
                    <MenuUnfoldOutlined
                        onClick={setCollapsed}
                        style={{cursor: "pointer", fontSize: "20px"}}
                    />
                ) : (
                    <MenuFoldOutlined
                        onClick={setCollapsed}
                        style={{cursor: "pointer", fontSize: "20px"}}
                    />
                )}
            </div>
            <ul className="right">
                <Popover content={MessageContent}>
                    <li>
                        <Badge dot={unReadCount > 0}>
                            <BellFilled/>
                        </Badge>
                    </li>
                </Popover>
                <li onClick={handleFullscreen}>
                    {isFullscreen ? <FullscreenOutlined/> : <FullscreenExitOutlined/>}
                </li>
                <li>
                    <a href={config.github.bug} target="_blank" rel="noopener noreferrer">
                        <BugFilled/>
                    </a>
                </li>
                <li>
                    <a href={config.github.repositoryUrl} target="_blank" rel="noopener noreferrer">
                        <GithubOutlined/>
                    </a>
                </li>
                <Popover
                    placement="bottomRight"
                    content={PopoverContent}
                >
                    <li>
                        <Avatar
                            src={"https://www.google.com/url?sa=i&url=https%3A%2F%2Fcommons.wikimedia.org%2Fwiki%2FFile%3ANetflix-avatar.png&psig=AOvVaw0eXTjb2XF78E4wLxVXw0Yn&ust=1645008169803000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCPiVt5zDgfYCFQAAAAAdAAAAABAD"}/>
                        <span className="username">{"https://www.google.com/url?sa=i&url=https%3A%2F%2Fcommons.wikimedia.org%2Fwiki%2FFile%3ANetflix-avatar.png&psig=AOvVaw0eXTjb2XF78E4wLxVXw0Yn&ust=1645008169803000&source=images&cd=vfe&ved=0CAsQjRxqFwoTCPiVt5zDgfYCFQAAAAAdAAAAABAD"}</span>
                    </li>
                </Popover>
            </ul>
        </Header>
    )
}

export default HomeHeader
