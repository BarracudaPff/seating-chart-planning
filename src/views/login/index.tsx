// https://007.qq.com/quick-start.html?ADTAG=acces.cfg
import React, {useEffect, useMemo, useState} from "react"
import "./style.scss"
import Footer from "../../components/footer"
import qs from "query-string"
// import md5 from "blueimp-md5"
import config from "../../config"
import {Button, Form, Input, message, Popover} from "antd"
import {useLocation, useNavigate} from "react-router-dom"
import {useDispatch} from "react-redux"
// import {loginByToken, setUser} from "@/store/actions"
// import {serviceLogin} from "@/services"
// import {LOCAL_STORAGE} from "@/constants"
// import {randomCode} from "@/utils"
// import logo from "../../../src/assets/img/common/logo.png"
import {LockOutlined, PictureOutlined, UserOutlined} from "@ant-design/icons"
import {randomCode} from "../../utils"
import {STORAGE_KEYS} from "../../constants"

const PopoverContent = (
    <div style={{padding: "10px 20px 10px 20px"}}>
        <div>This site does not open registered accounts, please use GitHub for the first login</div>
        <div>After logging in, the system will automatically register an account, the password is 123456</div>
    </div>
)

let captcha = randomCode()
const loginName = localStorage.getItem(STORAGE_KEYS.LoginName) || ""

const captchaUrl = config.http.apiURL + "/captcha?code="

const reloadCaptcha = (e: any) => e.target.src = captchaUrl + randomCode()

export default function () {
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch<any>()
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)

    const redirectUrl = useMemo(() => {
        const url = qs.parse(location.search).redirectUrl as string
        return url || "/home/index"
    }, [])

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields()

            setLoading(true)
            // serviceLogin({
            //     loginName: values.loginName.trim(),
            //     password: md5(values.password.trim()),
            //     code: values.code.trim()
            // })
            //     .then(res => {
            //         setLoading(false)
            //         dispatch(setUser(res.userInfo))
            //         navigate(redirectUrl, {replace: true})
            //     })
            //     .catch(() => {
            //         setLoading(false)
            //     })
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        const query = qs.parse(location.search)
        const {token, state} = query

        if (Number(state) === 0) {
            message.error("Authorization failed, please log in again")
            return
        }

        if (token) {
            // dispatch(loginByToken(token as string))
            //     .then((res: any) => {
            //         if (!isEmpty(res.userInfo)) {
            //             navigate(redirectUrl, {replace: true})
            //         }
            //     })
        }
    }, [history, location.search])

    useEffect(() => {
        if (config.isDevelopment) {
            form.setFieldsValue({
                loginName: "test",
                password: "123456"
            })
        }
    }, [])

    return (
        <section className="login-page">
            <div className="wrap">
                <div>
                    <div className="logo-wrap">
                        {/*<img src={logo} className="logo" alt=""/>*/}
                        <em>{config.title}</em>
                    </div>

                    <Form form={form}>
                        <Form.Item
                            name="loginName"
                            initialValue={loginName}
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter user name"
                                }
                            ]}
                        >
                            <Input
                                placeholder="Username"
                                prefix={<UserOutlined/>}
                                maxLength={32}
                                autoComplete="off"
                                onPressEnter={handleSubmit}
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter password"
                                }
                            ]}
                        >
                            <Input
                                placeholder="密码"
                                prefix={<LockOutlined/>}
                                maxLength={32}
                                type="password"
                                autoComplete="off"
                                onPressEnter={handleSubmit}
                            />
                        </Form.Item>

                        <Form.Item
                            name="code"
                            rules={[
                                {
                                    required: true,
                                    message: "Please enter verification code"
                                },
                                {
                                    pattern: /.{4}/,
                                    message: "Please enter the correct verification code"
                                }
                            ]}
                        >
                            <Input
                                placeholder="Verification code"
                                prefix={<PictureOutlined/>}
                                maxLength={4}
                                autoComplete="off"
                                onPressEnter={handleSubmit}
                                suffix={
                                    <img
                                        src={`${captchaUrl}${captcha}`}
                                        className="captcha"
                                        onClick={reloadCaptcha}
                                        alt=""
                                    />
                                }
                            />
                        </Form.Item>
                    </Form>

                    <Button
                        type="primary"
                        style={{marginTop: "20px"}}
                        size="large"
                        loading={loading}
                        block
                        onClick={handleSubmit}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </Button>
                    <div className="register">
                        <Popover
                            content={PopoverContent}
                            trigger="hover"
                            placement="bottomRight"
                        >
                            <span>Register an account</span>
                        </Popover>
                    </div>
                </div>
            </div>
            <Footer/>
        </section>
    )
}
