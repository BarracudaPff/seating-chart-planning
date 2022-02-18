import {fabric} from "fabric"
import React, {FC} from "react"
import {FabricJS} from "../../core/Fabric"
import {Renderer} from "../../core/editor"

export interface Props {
    onRenderLoaded: (renderer: Renderer) => void

}

export const Fabric: FC<Props> = ({onRenderLoaded}) => {
    const onCustomReady = (canvas: fabric.Canvas) => onRenderLoaded(new Renderer(canvas))

    return (
        <div style={{width: "100%", height: "100%"}}>
            <FabricJS
                onReady={onCustomReady}
                options={{
                    fireRightClick: true,  // enable firing of right click events
                    fireMiddleClick: true, // enable firing of middle click events
                    stopContextMenu: true, // prevent context menu from showing
                }}
                innerProps={{
                    div: {
                        style: {width: "100%", height: "100%"}
                    },
                    canvas: {
                        style: {width: "100%", height: "100%"}
                    }
                }}/>
        </div>
    )
}


// var canvas = new fabric.Canvas("c")
//
// var rect = new fabric.Rect({
//     left: 150,
//     top: 200,
//     originX: "left",
//     originY: "top",
//     width: 150,
//     height: 120,
//     angle: -10,
//     fill: "rgba(255,0,0,0.5)",
//     transparentCorners: false
// })
//
// canvas.add(rect).setActiveObject(rect)
//
// document.getElementById("rotatingPointOffset").oninput = function () {
//     canvas.item(0).controls.mtr.offsetY = -parseFloat(this.value)
//     canvas.requestRenderAll()
// }
//
// function observeBoolean(property) {
//     document.getElementById(property).onclick = function () {
//         canvas.item(0)[property] = this.checked
//         canvas.renderAll()
//     }
// }
//
// function observeNumeric(property) {
//     document.getElementById(property).oninput = function () {
//         canvas.item(0)[property] = parseFloat(this.value)
//         if (property === "padding") {
//             canvas.item(0).setCoords()
//         }
//         canvas.requestRenderAll()
//     }
// }
//
// function observeValue(property) {
//     document.getElementById(property).oninput = function () {
//         canvas.item(0)[property] = this.value
//         canvas.requestRenderAll()
//     }
// }
//
// function observeRadio(property) {
//     document.getElementById(property).onchange = function () {
//         var name = document.getElementById(this.id).name
//         canvas.item(0)[name] = this.value
//         canvas.renderAll()
//     }
// }
//
// function observeOptionsList(property) {
//     var list = document.querySelectorAll("#" + property +
//         " [type=\"checkbox\"]")
//     for (var i = 0, len = list.length; i < len; i++) {
//         list[i].onchange = function () {
//             canvas.item(0)[property](this.name, this.checked)
//             canvas.renderAll()
//         }
//     }
//
// }
//
// observeBoolean("hasControls")
// observeBoolean("hasBorders")
// observeBoolean("visible")
// observeBoolean("selectable")
// observeBoolean("evented")
// observeBoolean("transparentCorners")
// observeBoolean("centeredScaling")
// observeBoolean("centeredRotation")
//
// observeNumeric("padding")
// observeNumeric("cornerSize")
// observeValue("borderColor")
// observeValue("cornerColor")
// observeValue("cornerStrokeColor")
// observeRadio("cornerStyle1")
// observeRadio("cornerStyle2")
//
// observeOptionsList("setControlVisible")


// const {editor, onReady} = useFabricJSEditor()
// const onAddCircle = () => {
//     editor?.addCircle()
// }
// const onAddRectangle = () => {
//     editor?.addRectangle()
// }

