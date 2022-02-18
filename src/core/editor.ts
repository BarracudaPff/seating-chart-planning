import {fabric} from "fabric";
import {ILineOptions} from "fabric/fabric-impl";
import config from "../config";
import files from "./basic-files"
import {ConverterMapperService} from "../services/ConverterMapperService";

const STROKE = "#000000";
const FILL = "rgba(255, 255, 255, 0.0)";
const CIRCLE: fabric.ICircleOptions = {
    radius: 20,
    left: 100,
    top: 100,
    fill: FILL,
    stroke: STROKE
};
const RECTANGLE: fabric.IRectOptions = {
    left: 100,
    top: 100,
    fill: FILL,
    stroke: STROKE,
    width: 40,
    height: 40,
    angle: 0
};
const LINE: { points: number[], options: ILineOptions } = {
    points: [50, 100, 200, 200],
    options: {
        left: 170,
        top: 150,
        stroke: STROKE
    }
};
const TEXT: fabric.ITextOptions = {
    type: "text",
    left: 100,
    top: 100,
    fontSize: 16,
    fontFamily: "Arial",
    fill: STROKE
};

const controls = {
    mt: false,
    mb: false,
    ml: false,
    mr: false,
    bl: false,
    br: false,
    tl: false,
    tr: false,
    mtr: true
}

const SNAP = 0; //pixels to snap

export class Renderer {
    activeObjectListener?: (obj: fabric.Object) => void
    quality = 0
    isDragging = false;
    selection = false;
    lastPosX = 0;
    lastPosY = 0;
    backHorGap = 0
    clipboard?: fabric.Group | fabric.Object

    constructor(public canvas: fabric.Canvas) {
        console.log(config.baseURL);
        // this.canvas.selection = false
        this.initBackground()
        this.initListeners()
        fabric.Object.prototype.transparentCorners = false;
    }

    initBackground() {

        console.log(files.background)
        const back = fabric.Image.fromURL(files.background, img => {
            if (!img?.width || !this.canvas?.width || !img?.height || !this.canvas?.height) return
            let scale;
            const scaleX = img.width > this.canvas.width ? this.canvas.width / img.width : 1
            const scaleY = img.height > this.canvas.height ? this.canvas.height / img.height : 1
            scale = Math.min(scaleX, scaleY)
            const left = scaleX != 1 && scaleX > scaleY ? (this.canvas.width - img.width * scale) / 2 : 0
            this.backHorGap = left
            const top = scaleY != 1 && scaleY > scaleX ? (this.canvas.height - img.height * scale) / 2 : 0

            this.backgroundImg = img
            console.log(this.backgroundImg.width * scale, this.backgroundImg.height * scale)
            console.log(this.backgroundImg.width, this.backgroundImg.height)

            this.canvas.setBackgroundImage(img, this.canvas.renderAll.bind(this.canvas), {
                scaleX: scale,
                scaleY: scale,
                left,
                top
            })
        })
        // this.canvas
    }

    initListeners() {
        this.canvas.on("mouse:down", (opt) => {
            const e = opt.e
            // Left click
            if (e.button == 0) {
                this.activeObjectListener && this.activeObjectListener(this.canvas.getActiveObject())
            }
            // Right click
            if (e.button === 1) {
                // console.log("right click");
            }
            // Middle mouse click
            if (e.button === 2) {
                this.isDragging = true;
                this.selection = false;
                this.lastPosX = e.clientX;
                this.lastPosY = e.clientY;
                // console.log("middle click");
            }
        });
        this.canvas.on("mouse:move", opt => {
            if (this.canvas.getActiveObject() != null) return
            if (this.isDragging) {
                const e = opt.e;
                let vpt = this.canvas.viewportTransform!;
                const m = fabric.util.qrDecompose(this.canvas.viewportTransform!)

                vpt[4] += e.clientX - this.lastPosX;
                vpt[5] += e.clientY - this.lastPosY;
                if (vpt[4] >= 0) vpt[4] = 0
                if (vpt[5] >= 0) vpt[5] = 0

                if (vpt[5] < (this.borderHeight / m.scaleY - this.borderHeight) * m.scaleY) {
                    vpt[5] = m.translateY
                }

                if (vpt[4] < (this.borderWidth / m.scaleX - this.borderWidth) * m.scaleX) {
                    vpt[4] = m.translateX
                }

                this.requestRenderAll();
                this.lastPosX = e.clientX;
                this.lastPosY = e.clientY;
            }
        });
        this.canvas.on("mouse:up", opt => {
            // on mouse up we want to recalculate new interaction
            // for all objects, so we call setViewportTransform
            this.canvas.setViewportTransform(this.canvas.viewportTransform!);
            this.isDragging = false;
            this.selection = true;
        });

        const intersectingCheck = (event: fabric.IEvent<Event>) => {
            this.activeObjectListener && this.activeObjectListener(this.canvas.getActiveObject())
            // console.log(event.e)
            if (!event.e.altKey) return

            const activeObject = event.target!
            activeObject.setCoords();
            if (typeof activeObject.refreshLast != "boolean") {
                activeObject.refreshLast = true
            }

            //loop canvas objects
            this.canvas.forEachObject(function (targ) {
                if (targ === activeObject) return; //bypass self
                //check intersections with every object in canvas
                if (activeObject.intersectsWithObject(targ)
                    || activeObject.isContainedWithinObject(targ)
                    || targ.isContainedWithinObject(activeObject)) {
                    //objects are intersecting - deny saving last non-intersection position and break loop
                    if (typeof activeObject.lastLeft == "number") {
                        activeObject.left = activeObject.lastLeft;
                        activeObject.top = activeObject.lastTop;
                        activeObject.refreshLast = false;
                        return;
                    }
                } else {
                    activeObject.refreshLast = true;
                }
            });
            if (activeObject.refreshLast) {
                //save last non-intersecting position if possible
                activeObject.lastLeft = activeObject.left
                activeObject.lastTop = activeObject.top;
            }
        }

        this.canvas.on("object:moving", intersectingCheck)
        this.canvas.on("object:scaling", intersectingCheck)
        this.canvas.on("object:rotating", intersectingCheck)

        this.canvas.on("mouse:wheel", opt => {
            const delta = opt.e.deltaY;
            let zoom = this.canvas.getZoom();
            zoom *= 0.999 ** delta;
            if (zoom > 4) zoom = 4;
            if (zoom < 1) zoom = 1;

            this.canvas.zoomToPoint({x: opt.e.offsetX, y: opt.e.offsetY}, zoom);
            opt.e.preventDefault();
            opt.e.stopPropagation();

            const vpt = this.canvas.viewportTransform!;
            const m = fabric.util.qrDecompose(vpt)

            if (vpt[4] >= 0) vpt[4] = 0
            if (vpt[5] >= 0) vpt[5] = 0

            if (vpt[5] < (this.borderHeight / m.scaleY - this.borderHeight) * m.scaleY) {
                vpt[5] = (this.borderHeight / m.scaleY - this.borderHeight) * m.scaleY
            }

            if (vpt[4] < (this.borderWidth / m.scaleX - this.borderWidth) * m.scaleX) {
                vpt[4] = (this.borderWidth / m.scaleX - this.borderWidth) * m.scaleX
            }
        })
    }

    setActiveObjectListener(listener: (obj: fabric.Object) => void) {
        this.activeObjectListener = listener
    }

    changeActiveObject(props: Partial<fabric.IObjectOptions>) {
        const obj = this.canvas.getActiveObject()
        console.log(obj)
        if (!obj) return

        const scale = obj.getObjectScaling();


        props.width && obj.width && obj.set("scaleX", props.width / obj.width)
        props.height && obj.height && obj.set("scaleY", props.height / obj.height)

        props.top && obj.set("top", props.top);
        props.left && obj.set("left", props.left);

        obj.setCoords()
        this.canvas.requestRenderAll();
    }

    addCircle(props?: fabric.ICircleOptions) {
        const object = new fabric.Circle({...CIRCLE, ...props});
        this.canvas.add(object);
    }

    addRectangle(props: Partial<fabric.IRectOptions>) {
        const object = new fabric.Rect({...RECTANGLE, ...props});
        this.canvas.add(object);
    }

    addLine(props: Partial<fabric.ILineOptions>) {
        const object = new fabric.Line(LINE.points, {...LINE.options, ...props});
        this.canvas.add(object);
    }

    addText(text: string, props: Partial<fabric.ITextOptions>) {
        const object = new fabric.Textbox(text, { ...TEXT, ...props});
        object.set({
            text: text
        });
        this.canvas.add(object);
    }

    addChair(props: Partial<fabric.IObjectOptions>) {
        fabric.loadSVGFromURL(files.chair, (objects, options) => {
            const svgData = fabric.util.groupSVGElements(objects, {...options, ...props});
            svgData.top = 30;
            svgData.left = 50;
            svgData.setControlsVisibility(controls);
            this.canvas.add(svgData);
        })
    }

    addSofa(props: Partial<fabric.IObjectOptions>) {
        fabric.loadSVGFromURL(files.sofa, (objects, options) => {
            const svgData = fabric.util.groupSVGElements(objects, {...options, ...props});
            svgData.top = 30;
            svgData.left = 50;
            svgData.setControlsVisibility(controls);
            this.canvas.add(svgData);
        })
    }

    store(): string {
        return ConverterMapperService.toString(this.canvas.toJSON(), 0)
    }

    load(data: string, onLoad?: () => void) {
        this.canvas.loadFromJSON(ConverterMapperService.parse(data), () => onLoad && onLoad())
    }

    addCircleBigTable = (props: Partial<fabric.IObjectOptions>) => this.addTable(files.tableCircleBig, props,false)
    addCircleSmallTable = (props: Partial<fabric.IObjectOptions>) => this.addTable(files.tableCircleSmall, props,false)
    addRectangleTable = (props: Partial<fabric.IObjectOptions>) => this.addTable(files.tableRectangle, props)

    addRectangleSplittedTable = (props: Partial<fabric.IObjectOptions>) => this.addTable(files.tableRectangleSplitted, props)

    dataURL = (format: "png" | "jpeg", multiplier?: number) => this.canvas.toDataURL({
        format,
        quality: 1,
        multiplier
        // enableRetinaScaling: true
    })

    toCSV = (format: "png" | "jpeg") => this.canvas.toSVG({
        // format,
        // quality: 1
        // enableRetinaScaling: true
    })


    private addTable(file: string, props: Partial<fabric.IObjectOptions>, rotate: boolean = true) {
        fabric.loadSVGFromURL(file, (objects, options) => {
            const svgData = fabric.util.groupSVGElements(objects, options);
            svgData.top = 30;
            svgData.left = 50;
            svgData.setControlsVisibility({...controls, mtr: rotate});
            this.canvas.add(svgData);
        })
    }

    updateText(text: string) {
        const objects = this.canvas.getActiveObjects();

        if (objects.length && objects[0].type === TEXT.type && objects[0] instanceof fabric.Text) {
            var textObject = objects[0];
            textObject.set({text});
            this.canvas.renderAll();
        }
    }

    deleteAll() {
        this.canvas.getObjects().forEach(obj => this.canvas.remove(obj))
        this.canvas.discardActiveObject();
        this.canvas.renderAll();
    }

    deleteSelected() {
        this.canvas.getActiveObjects().forEach(obj => this.canvas.remove(obj));
        this.canvas.discardActiveObject();
        this.canvas.renderAll();
    }

    // | fabric.Pattern | fabric.Gradient

    setFillColor(backgroundColor: string) {
        this.canvas.backgroundImage?.set({backgroundColor})
        this.canvas.backgroundImage?.render(this.canvas.getContext())
    }

    setStrokeColor(stroke: string | fabric.Pattern | fabric.Gradient) {

        this.canvas.getActiveObjects().forEach(function (object) {
            if (object.type === TEXT.type) {
                object.set({
                    fill: stroke
                });
                return;
            }

            object.set({
                stroke: stroke.toString()
            });
        });
        this.canvas.renderAll();
    }

    zoomIn() {
        const zoom = this.canvas.getZoom();
        this.canvas.setZoom(zoom / 0.5);
    }

    zoomOut() {
        const zoom = this.canvas.getZoom();
        this.canvas.setZoom(zoom * 0.5);
    }

    zoomReset() {
        this.canvas.setZoom(1);
    }

    backgroundImg?: fabric.Image

    get borderHeight(): number {
        return this.backgroundImg?.height! * this.backgroundImg?.scaleY!
    }

    get borderWidth(): number {
        return (this.backgroundImg?.width! + this.backHorGap * 2) * this.backgroundImg?.scaleX!
    }

    copyObject() {
        // clone what are you copying since you
        // may want copy and paste on different moment.
        // and you do not want the changes happened
        // later to reflect on the copy.
        // this.canvas.getActiveObject().clone((cloned: fabric.Object) => clipboard = cloned);
        this.canvas.getActiveObject()?.clone((clone: fabric.Group | fabric.Object) => this.clipboard = clone)
    }

    pasteObject() {
        if (!this.clipboard) return

        this.clipboard.clone((clonedObj: fabric.Object) => {
            this.canvas.discardActiveObject();
            clonedObj.set({
                left: (clonedObj.left ?? 0) + 10,
                top: (clonedObj.top ?? 0) + 10,
                evented: true
            });
            if (clonedObj.type === "activeSelection") {
                clonedObj.canvas = this.canvas;
                (clonedObj as fabric.Group)?.forEachObject(obj => this.canvas.add(obj));
                clonedObj.setCoords();
            } else {
                this.canvas.add(clonedObj);
            }
            this.clipboard.top += 10;
            this.clipboard.left += 10;
            this.canvas.setActiveObject(clonedObj);
            this.canvas.requestRenderAll();
        });
    }

    requestRenderAll() {
        this.canvas.renderAll()
    }

    dispose() {

    }

    // // Context ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // _context?: CanvasRenderingContext2D
    // _fps?: FpsGetter
    // eventListeners: { bind: EventListenerObject, type: string }[] = []
    //
    // get context(): CanvasRenderingContext2D {
    //     return this._context!;
    // }
    //
    // get fps(): number {
    //     return this._fps!();
    // }
    //
    // constructor(context?: CanvasRenderingContext2D, fps?: FpsGetter) {
    //     this._context = context;
    //     this._fps = fps;
    // }
    //
    // withContext = (context: CanvasRenderingContext2D) => this._context = context
    // withFPS = (fps: FpsGetter) => this._fps = fps
    // bindListeners = (canvas: HTMLCanvasElement) => {
    //     canvas.addEventListener("mousedown", this.bindListener("mousedown", this.onMouseDown));
    // }
    //
    // private bindListener = (type: string, foo: Function): EventListenerOrEventListenerObject => {
    //     const bind = foo.bind(this)
    //     this.eventListeners.push({type, bind})
    //     return bind
    // }
    //
    // withListeners() {
    // }
    //
    // init() {
    //     console.log(require("../assets/sample/chair.svg"))
    // }
    //
    // items: Item[] = [
    //     {
    //         id: "7d0b3e90-c315-e7a5-a6d9-594757d5b7e4",
    //         itemName: "Test Item",
    //         itemType: ItemType.Table,
    //         position: [10, 140],
    //         rotation: [0, 1.5707963267948966],
    //         scale: [1, 1],
    //         size: [240, 100],
    //         fixed: false,
    //         resizable: false,
    //         data: "",
    //         dataType: DataType.SVG
    //     }
    // ]
    //
    // // Events ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // onMouseDown(ev: MouseEvent) {
    //     console.log(ev.type)
    // }
    //
    // onMouseUp(ev: MouseEvent) {
    //     console.log(ev.type)
    //     console.log("??")
    // }
    //
    // onMouseMove(ev: MouseEvent) {
    //
    // }
    //
    // // Logic ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // draw(timestamp: DOMHighResTimeStamp) {
    //     this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height)
    //     this.context.fillStyle = "#e00"
    //     this.items.forEach(this.drawItem)
    //     // this.context.beginPath()
    //     // this.context.arc(50, 100, 20 * Math.sin(timestamp * 0.005) ** 2, 0, 2 * Math.PI)
    //     // this.context.fill()
    // }
    //
    // drawItem(item: Item) {
    //     console.log("Drawing ", item.itemName)
    //
    //     //TODO
    // }
    //
    // dispatch(canvas?: HTMLCanvasElement) {
    //     this.eventListeners.forEach(({bind, type}) => canvas?.removeEventListener(type, bind))
    // }
}

//         this.canvas.on("mouse:move", opt => {
//             if (this.isDragging) {
//                 const e = opt.e;
//                 let vpt = this.canvas.viewportTransform!;
//                 const m = fabric.util.qrDecompose(this.canvas.viewportTransform!)
//                 // console.log(m.translateY * m.scaleY)
//                 vpt[4] += e.clientX - this.lastPosX;
//                 const vpt5 = vpt[5] + e.clientY - this.lastPosY;
//                 // if (vpt[4] >= 0 || vpt[4] <= 0) vpt[4] = 0
//                 if (vpt[4] >= 0) vpt[4] = 0
//                 if (vpt[5] >= 0) vpt[5] = 0
//                 // if (vpt5 < (border / m.scaleY - border - 10) * m.scaleY) {
//                 //     // vpt[5] = (border / m.scaleY - border) * m.scaleY
//                 // } else  {
//                 //     vpt[5] = vpt5
//                 // }
//
//
//                 if (vpt5 < (this.border / m.scaleY - this.border - 10) * m.scaleY) {
//                     vpt[5] = m.translateY
//                     // vpt[5] = (border / m.scaleY - border) * m.scaleY
//                 } else  {
//                     vpt[5] = vpt5
//                 }
//
//                 // console.log(
//                 //     m.translateY,
//                 //     (border / m.scaleY - border) * m.scaleY,
//                 // )
//                 // if (border + m.translateY / m.scaleY <= border / m.scaleY)
//
//                 // if (vpt[5] <= m.translateY / m.scaleY) vpt[5] = 0
//                 // console.log("=".repeat(60))
//                 this.requestRenderAll();
//                 this.lastPosX = e.clientX;
//                 this.lastPosY = e.clientY;
//             }
//         })
