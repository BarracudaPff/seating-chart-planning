import React from "react"
import PrivateRoute from "../components/private-route"
import Login from "../views/login"
import {useRoutes} from "react-router-dom"
import NoMatch from "../components/exception"
import Playground from "../views/playground"

export function MainRoutes() {
    const _Login = <PrivateRoute element={Login} meta={{
        title: "Log in"
    }}/>

    return useRoutes([
        {
            path: "/",
            element: <Playground/>
        },
        {
            path: "/login",
            element: _Login
        },
        {
            path: "playground",
            element: <Playground/>,
        },
        // {
        //     path: '/home',
        //     element: <MainEntry />,
        //     children: [
        //         {
        //             path: 'index',
        //             element: <PrivateRoute element={HomeIndex} meta={{
        //                 requiresAuth: true,
        //                 title: '后台首页'
        //             }} />,
        //         },
        //         {
        //             path: 'log',
        //             element: <PrivateRoute element={Log} meta={{
        //                 requiresAuth: true,
        //                 title: '日志管理'
        //             }} />
        //         },
        //         {
        //             path: 'log/create/:type',
        //             element: <PrivateRoute element={CreateLog} meta={{
        //                 requiresAuth: true,
        //                 title: '日志创建'
        //             }} />
        //         },
        //         {
        //             path: 'log/detail/:id',
        //             element: <PrivateRoute element={CreateLog} meta={{
        //                 requiresAuth: true,
        //                 title: '查看日志'
        //             }} />
        //         },
        //         {
        //             path: 'company',
        //             element: <PrivateRoute element={Company} meta={{
        //                 requiresAuth: true,
        //                 title: '公司单位'
        //             }} />
        //         },
        //         {
        //             path: 'reminder',
        //             element: <PrivateRoute element={Reminder} meta={{
        //                 requiresAuth: true,
        //                 title: '提醒事项'
        //             }} />
        //         },
        //         {
        //             path: 'todayTask',
        //             element: <PrivateRoute element={TodayTask} meta={{
        //                 requiresAuth: true,
        //                 title: '今日待办'
        //             }} />
        //         },
        //         {
        //             path: 'memorandum',
        //             element: <PrivateRoute element={Memorandum} meta={{
        //                 requiresAuth: true,
        //                 title: '备忘录列表'
        //             }} />
        //         },
        //         {
        //             path: 'memorandum/create',
        //             element: <PrivateRoute element={MemorandumCreate} meta={{
        //                 requiresAuth: true,
        //                 title: '备忘录创建'
        //             }} />
        //         },
        //         {
        //             path: 'memorandum/update/:id',
        //             element: <PrivateRoute element={MemorandumCreate} meta={{
        //                 requiresAuth: true,
        //                 title: '备忘录更新'
        //             }} />
        //         },
        //         {
        //             path: 'memorandum/detail/:id',
        //             element: <PrivateRoute element={MemorandumDetail} meta={{
        //                 requiresAuth: true,
        //             }} />
        //         },
        //         {
        //             path: 'capitalFlow',
        //             element: <PrivateRoute element={CapitalFlow} meta={{
        //                 title: '资金流动',
        //                 requiresAuth: true,
        //             }} />
        //         },
        //         {
        //             path: 'capitalFlow/type',
        //             element: <PrivateRoute element={CapitalFlowType} meta={{
        //                 title: '创建类别',
        //                 requiresAuth: true,
        //             }} />
        //         },
        //         {
        //             path: 'todoList',
        //             element: <PrivateRoute element={TodoList} meta={{
        //                 title: '活动清单',
        //                 requiresAuth: true,
        //             }} />
        //         },
        //
        //         // Setting
        //         {
        //             path: 'setting',
        //             element: <SettingIndex />,
        //             children: [
        //                 {
        //                     path: '/home/setting/base',
        //                     element: <PrivateRoute element={Base} meta={{
        //                         title: '个人中心',
        //                         requiresAuth: true,
        //                     }} />
        //                 },
        //                 {
        //                     path: '/home/setting/innerMessage',
        //                     element: <PrivateRoute element={InnerMessage} meta={{
        //                         title: '消息中心',
        //                         requiresAuth: true,
        //                     }} />
        //                 },
        //                 {
        //                     path: '/home/setting/notification',
        //                     element: <PrivateRoute element={Notification} meta={{
        //                         title: '消息通知',
        //                         requiresAuth: true,
        //                     }} />
        //                 },
        //                 {
        //                     path: '/home/setting/account',
        //                     element: <PrivateRoute element={Account} meta={{
        //                         title: '账号设置',
        //                         requiresAuth: true,
        //                     }} />
        //                 },
        //             ]
        //         },
        //
        //         {
        //             path: '*',
        //             element: <PrivateRoute element={NoMatch} meta={{
        //                 requiresAuth: false,
        //                 title: '404 Not Found'
        //             }} />
        //         },
        //     ]
        // },
        {
            path: "*",
            element: <PrivateRoute element={NoMatch} meta={{
                requiresAuth: false,
                title: "404 Not Found"
            }}/>
        },
    ])
}
