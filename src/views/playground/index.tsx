import React, {FC, useEffect, useState} from "react"
import "./main2.scss"
import {SketchPicker} from "react-color"
//@ts-ignore
import FPS from "fps-now"
import {
    Breadcrumb,
    Button,
    Divider,
    Input,
    InputNumber,
    Layout,
    Menu,
    message,
    Modal,
    Select,
    Slider,
    Space,
    Tooltip,
    Typography
} from "antd"
import Icon, {
    LaptopOutlined,
    NotificationOutlined,
    SearchOutlined,
    PlusOutlined,
    UserOutlined,
    ArrowLeftOutlined,
    FileImageOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    FrownOutlined,
    SmileOutlined,
} from "@ant-design/icons"
import {IconComponentProps} from "@ant-design/icons/lib/components/Icon"
import {ArrowIcon, ChairIcon, CircleIcon, LineIcon, OtherIcon, PenIcon, RectangleIcon, TableIcon, TextIcon} from "../../components/icons"
import {Fabric} from "./Fabric"
import {Renderer} from "../../core/editor"
import {fabric} from "fabric"
import {round} from "lodash"
import { useKeyPress } from "../../utils/hooks"

const {SubMenu} = Menu
const {Header, Content, Sider, Footer} = Layout

interface Props {
}

interface SubscribedObject {
    width: number
    height: number
    top: number
    left: number
}

const Playground: FC<Props> = () => {
    const [collapsed, setCollapsed] = useState<boolean>(false)
    const [renderer, setRenderer] = useState<Renderer>()
    const [onFabricClickFoo, setOnFabricClickFoo] = useState<Function>()
    const [activeObject, setActiveObject] = useState<SubscribedObject>()
    const toggleCollapsed = () => setCollapsed(it => !it)

    const [quality, setQuality] = useState<number>(1)
    const [format, setFormat] = useState<string>("png")
    const [backgroundFillUse, setBackgroundFillUse] = useState<number>()
    const [backgroundFill, setBackgroundFill] = useState<number>()
    const [modalDataString, setModalDataString] = useState<string>()
    const [fillColor, setFillColor] = useState<string>("transparent")
    const [showColorPicker, setShowColorPicker] = useState<boolean>(false)
    const [exportLoading, setExportLoading] = useState<boolean>(false)

    const cKey = useKeyPress("c", {ctrlKey: true})
    const vKey = useKeyPress("v", {ctrlKey: true})

    cKey && renderer?.copyObject()
    vKey && renderer?.pasteObject()

    useEffect(() => {
        let animationFrameId: number
        const render = () => {

            const fpsComp = FPS.of({x: 0, y: 0})

            fpsComp.start()
            // animationFrameId = window.requestAnimationFrame(render)
        }
        render()
        // return () => window.cancelAnimationFrame(animationFrameId)
    })

    // const [showPanelBut, setShowPanelBut] = useState(false)
    //
    // {/*{showPanelBut && (*/}
    // {/*    <Tooltip title="search">*/}
    // {/*        <Button shape="circle" icon={<SearchOutlined/>} onClick={()=>{*/}
    // {/*            setCollapsePanel(false)*/}
    // {/*            setShowPanelBut(false)*/}
    // {/*        }}/>*/}
    // {/*    </Tooltip>*/}
    // {/*)}*/}

    function initRenderer(renderer: Renderer) {
        setRenderer(renderer)
        //https://css-tricks.com/using-requestanimationframe-with-react-hooks/
    }

    function activateOL() {
        renderer?.setActiveObjectListener(obj => {
            if (!obj || !!obj?.length) {
                setActiveObject(undefined)
                return
            }
            setActiveObject(prev => (prev ?? {}) && {
                ...prev, ...{
                    width: round(obj.width! * (obj.scaleX ?? 1), 2),
                    height: round(obj.height! * (obj.scaleY ?? 1), 2),
                    top: round(obj.top!, 2),
                    left: round(obj.left!, 2),
                }
            })
        })
    }

    function changeActiveObject(opt: Partial<SubscribedObject>) {
        renderer?.changeActiveObject(opt)
        setActiveObject(prev => (prev ?? {}) && {
            width: opt.width ?? prev?.width!,
            height: opt.height ?? prev?.height!,
            top: opt.top ?? prev?.top!,
            left: opt.left ?? prev?.left!,
        })
    }

    const addCircle = () => renderer?.addCircle({strokeUniform: true})
    const addRectangle = () => renderer?.addRectangle({strokeUniform: true})
    const addLine = () => renderer?.addLine({strokeUniform: true})
    const addText = () => renderer?.addText("Text here", {strokeUniform: true})
    const addChair = () => renderer?.addChair({strokeUniform: true})
    const addSofa = () => renderer?.addSofa({strokeUniform: true})
    const addRectangleTable = () => renderer?.addRectangleTable({strokeUniform: true})
    const addCircleBigTable = () => renderer?.addCircleBigTable({strokeUniform: true})
    const addCircleSmallTable = () => renderer?.addCircleSmallTable({strokeUniform: true})
    const addRectangleSplittedTable = () => renderer?.addRectangleSplittedTable({strokeUniform: true})

    const todo = async () => message.warn("Not implemented yet")
    const onNumberChange = (v: React.ChangeEvent<HTMLInputElement>, foo: (num: number) => void) => {
        const num = round(Number(v.target.value), 2)

        if (num) foo(num)
    }

    async function importFrom() {
        const data = await navigator.clipboard.readText()
        if (!data.length) {
            message.info("Copy any blueprint string.")
            return
        }

        try {
            renderer?.load(data)
            message.success("Successfully loaded!")
        } catch (e) {
            message.error("Can't load, please copy correct blueprint.")
        }
    }

    function exportTo() {
        if (!renderer) return
        switch (format) {
            case "png": {
                setExportLoading(true)
                const link = document.createElement("a")
                renderer.dataURL("png", quality, fillColor).then(data => {
                    link.href = data
                    link.setAttribute("download", `image-${new Date().getTime()}.png`)
                    document.body.appendChild(link)
                    link.click()
                }).finally(()=> {
                    setExportLoading(false)
                    link.remove()
                })
                return
            }
            case "jpeg": {
                setExportLoading(true)
                const link = document.createElement("a")
                renderer.dataURL("jpeg", quality, fillColor).then(data => {
                    link.href = data
                    link.setAttribute("download", `image-${new Date().getTime()}.jpeg`)
                    document.body.appendChild(link)
                    link.click()
                }).finally(()=> {
                    setExportLoading(false)
                    link.remove()
                })
                return
            }
            case "string":
                const data = renderer.store()
                setModalDataString(data)
                return
        }
    }

    const renderLeftSlider = () => {
        return (
            <Sider
                breakpoint="lg"
                collapsed={collapsed}
                collapsedWidth={56}
                width={240}
                theme="light"
                style={{overflow: "scroll", scrollbarWidth: "none"}}
                className="site-layout-background unselectable">
                <Menu
                    theme="light"
                    mode="inline"
                    defaultOpenKeys={["sub1"]}
                    style={{border: 0, paddingBottom: 0}}>
                    <SubMenu key="sub1" icon={<TableIcon/>} title="Столы">
                        <Menu.Item onClick={addRectangleTable} key="1">Small rectangle</Menu.Item>
                        <Menu.Item onClick={addRectangleSplittedTable} key="2">Splitted rectangle</Menu.Item>
                        <Menu.Item onClick={addCircleSmallTable} key="3">Small circle</Menu.Item>
                        <Menu.Item onClick={addCircleBigTable} key="4">Big circle</Menu.Item>
                        <Menu.Item onClick={todo} key="5">
                            <Space>
                                <PlusOutlined/>
                                <Typography.Text>Add new</Typography.Text>
                            </Space>
                        </Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub2" icon={<ChairIcon/>} title="Стулья">
                        <Menu.Item onClick={addChair} key="6">One seat chair</Menu.Item>
                        <Menu.Item onClick={addSofa} key="7">Two seat sofa</Menu.Item>
                        <Menu.Item onClick={todo} key="8">
                            <Space>
                                <PlusOutlined/>
                                <Typography.Text>Add new</Typography.Text>
                            </Space>
                        </Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub3" icon={<PenIcon/>} title="Базовые">
                        <Menu.Item onClick={addLine} key="9">
                            <Space>
                                <LineIcon/>
                                <Typography.Text>Line</Typography.Text>
                            </Space>
                        </Menu.Item>
                        <Menu.Item onClick={todo} key="10">
                            <Space>
                                <ArrowIcon/>
                                <Typography.Text>ArrowIcon</Typography.Text>
                            </Space>
                        </Menu.Item>
                        <Menu.Item onClick={addRectangle} key="11">
                            <Space>
                                <RectangleIcon/>
                                <Typography.Text>Rectangle</Typography.Text>
                            </Space>
                        </Menu.Item>
                        <Menu.Item onClick={addCircle} key="12">
                            <Space>
                                <CircleIcon/>
                                <Typography.Text>Ellipse</Typography.Text>
                            </Space>
                        </Menu.Item>
                        <Menu.Item onClick={addText} key="13">
                            <Space>
                                <TextIcon/>
                                <Typography.Text>Text</Typography.Text>
                            </Space>
                        </Menu.Item>
                        <Menu.Item onClick={todo} key="14">
                            <Space>
                                <FileImageOutlined/>
                                <Typography.Text>Image</Typography.Text>
                            </Space>
                        </Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub4" icon={<OtherIcon/>} title="Разное">
                        <Menu.Item onClick={todo} key="15">Import from string</Menu.Item>
                        <Menu.Item onClick={todo} key="16">Import from file</Menu.Item>
                        <Menu.Item onClick={todo} key="17">
                            <Space>
                                <PlusOutlined/>
                                <Typography.Text>Add new</Typography.Text>
                            </Space>
                        </Menu.Item>
                    </SubMenu>
                </Menu>
            </Sider>
        )
    }

    const renderRightSlider = () => {
        const inputStyle: React.CSSProperties = {width: 100}

        return (
            <Sider
                width={240}
                theme="light"
                className="site-layout-background unselectable">
                <Typography.Title level={3} style={{margin: 16, marginBottom: 0}}>Attributes</Typography.Title>
                <Space direction="vertical" style={{padding: 16, width: "100%", height: "calc(100% - 100px)"}}>
                    {activeObject && <Space direction="vertical">
                      <Typography.Title level={5}>Coordinates</Typography.Title>
                      <Space>
                        <Typography.Text>W</Typography.Text>
                        <Input bordered={false} size={"small"} style={inputStyle} value={activeObject.width}
                               onChange={v => onNumberChange(v, it => changeActiveObject({width: it}))}/>
                      </Space>
                      <Space>
                        <Typography.Text>H</Typography.Text>
                        <Input bordered={false} size={"small"} style={inputStyle} value={activeObject.height}
                               onChange={v => onNumberChange(v, it => changeActiveObject({height: it}))}/>
                      </Space>
                      <Space>
                        <Typography.Text>X</Typography.Text>
                        <Input bordered={false} size={"small"} style={inputStyle} value={activeObject.left}
                               onChange={v => onNumberChange(v, it => changeActiveObject({left: it}))}/>
                      </Space>
                      <Space>
                        <Typography.Text>Y</Typography.Text>
                        <Input bordered={false} size={"small"} style={inputStyle} value={activeObject.top}
                               onChange={v => onNumberChange(v, it => changeActiveObject({top: it}))}/>
                      </Space>
                    </Space>}
                    <Divider style={{marginLeft: -16, marginRight: -16, width: "calc(100% + 32px)"}}/>
                    <Typography.Title level={5}>Export & Import</Typography.Title>
                    <Space direction={"horizontal"} style={{gap: 16, width: "100%"}}>
                        <Select defaultValue={"1.5"} style={{width: 80}} onChange={(value) => setQuality(Number(value))}>
                            <Select.Option value="1">1x</Select.Option>
                            <Select.Option value="1.5">1.5x</Select.Option>
                            <Select.Option value="2">2x</Select.Option>
                            <Select.Option value="3">3x</Select.Option>
                            <Select.Option value="4">4x</Select.Option>
                            <Select.Option value="5" disabled>5x</Select.Option>
                        </Select>
                        <Select defaultValue={"png"} style={{width: 80}} onChange={(value) => setFormat(value)}>
                            <Select.Option value="png">PNG</Select.Option>
                            <Select.Option value="jpeg">JPEG</Select.Option>
                            <Select.Option value="string">String</Select.Option>
                        </Select>
                    </Space>
                    {!showColorPicker && (
                        <Button onClick={() => setShowColorPicker(it => !it)} icon={(
                            <div className={"anticon anticon-poweroff color-preview"} style={{background: fillColor}}/>
                        )}>Back fill color</Button>
                    )}
                    {showColorPicker && <SketchPicker
                      presetColors={["transparent", "#fff", "#000"]}
                      color={fillColor}
                      onChange={({hex}) => {
                          setShowColorPicker(false)
                          setFillColor(hex)
                      }}
                    />}
                    <Button type={"primary"} onClick={exportTo} loading={exportLoading} style={{marginTop: 16, width: "100%"}}>{"Export to " + format}</Button>
                    <Button type={"dashed"} onClick={importFrom} style={{marginTop: 16, width: "100%"}}>{"Import from string"}</Button>
                    {/*<div className="icon-wrapper">*/}
                    {/*    <FrownOutlined className={quality >= 5 ? "" : "icon-wrapper-active"}/>*/}
                    {/*    <Slider min={1} step={1} max={10} onChange={(num) => setQuality(num)} value={quality}/>*/}
                    {/*    <SmileOutlined className={quality >= 5 ? "icon-wrapper-active" : ""}/>*/}
                    {/*</div>*/}
                    {/*<Space direction="vertical" >*/}
                    {/*<Space >*/}
                    {/*</Space>*/}
                    {/*</Space>*/}
                </Space>
                <Button title={"In test mode. Needs good PC or 'll be too laggy :("} style={{alignSelf: "flex-end", marginLeft: 16, width: "calc(100% - 32px)"}} type={"dashed"} danger onClick={activateOL}>Activate listeners</Button>
            </Sider>
        )
    }

    const renderContent = () => {
        const menu = (
            <Menu>
                <Menu.Item>
                    <a href="?node-id=floor2">Floor 2</a>
                </Menu.Item>
                <Menu.Item>
                    <a href="?node-id=floor3">Floor 3</a>
                </Menu.Item>
                <Menu.Item>
                    <a href="?node-id=floor4">Floor 4</a>
                </Menu.Item>
            </Menu>
        )

        return (
            <Layout style={{padding: "0", marginLeft: 0,}}>
                <Breadcrumb separator={""} className={"smooth"} style={{margin: "16px 0"}}>
                    <Breadcrumb.Item className={"collapse-toggle-div"}>
                        <Button shape={"circle"} className={"collapse-toggle"} type="primary" onClick={toggleCollapsed}>
                            {collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                        </Button>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item href={"?node-id=rest"}>Restaurant</Breadcrumb.Item>
                    <Breadcrumb.Separator/>
                    <Breadcrumb.Item overlay={menu} href={"?node-id=floor1"}>Floor 1</Breadcrumb.Item>
                </Breadcrumb>
                <Content
                    className="site-layout-background"
                    style={{
                        // padding: 24,
                        // margin: 0,
                        // minHeight: 280,
                    }}>
                    <noscript>You need to enable JavaScript to run this app.</noscript>
                    <Fabric onRenderLoaded={renderer => initRenderer(renderer)}/>
                </Content>
            </Layout>
        )
    }

    return (
        <Layout style={{height: "100vh", minWidth: 1000}}>
            <Header className="header">
                <div className="logo"/>
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
                    <Menu.Item key="1">Il Lago</Menu.Item>
                    <Menu.Item key="2">Premier Tips</Menu.Item>
                </Menu>
            </Header>
            <Layout hasSider>
                {renderLeftSlider()}
                {renderContent()}
                {renderRightSlider()}
            </Layout>
            <Modal title="Blueprint string" visible={!!modalDataString} onOk={() => setModalDataString(undefined)}
                   onCancel={() => setModalDataString(undefined)}>
                <Typography.Text onClick={() => {
                    if (!modalDataString) return
                    navigator.clipboard.writeText(modalDataString)
                        .then(() => message.success("Successfully copied!"))
                }}>{modalDataString}</Typography.Text>
            </Modal>
            {/*<Footer className={"footer-background"} style={{textAlign: "center"}}>*/}
            {/*    <Typography.Text>Created by </Typography.Text>*/}
            {/*    <Typography.Link href={"github.com/BarracudaPff"}>github.com/BarracudaPff</Typography.Link>*/}
            {/*</Footer>*/}
        </Layout>
    )
}

export default Playground
