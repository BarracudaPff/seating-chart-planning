import React, {createElement, FC, useEffect, useRef} from "react"
import {fabric} from "fabric"
import {OmitTS} from "../models/types"
import {ICanvasOptions} from "fabric/fabric-impl"

type NoRefHTMLProps<T> = OmitTS<React.DetailedHTMLProps<React.HTMLAttributes<T>, T>, "ref">

interface Props {
    innerProps?: {
        div?: NoRefHTMLProps<HTMLDivElement>
        canvas?: NoRefHTMLProps<HTMLCanvasElement>
    }
    options?: ICanvasOptions
    onReady?: (canvas: fabric.Canvas) => Function | void;
}

export const FabricJS: FC<Props> = (props) => {
    const onReady = props.onReady
    const canvasEl = useRef<HTMLCanvasElement>(null)
    const canvasElParent = useRef<HTMLDivElement>(null)

    useEffect(function () {
        const canvas = new fabric.Canvas(canvasEl.current, props.options)

        const setCurrentDimensions = function setCurrentDimensions() {
            let _canvasElParent$current, _canvasElParent$current2: HTMLDivElement | null

            canvas.setHeight(((_canvasElParent$current = canvasElParent.current) === null || _canvasElParent$current === void 0 ? void 0 : _canvasElParent$current.clientHeight) || 0)
            canvas.setWidth(((_canvasElParent$current2 = canvasElParent.current) === null || _canvasElParent$current2 === void 0 ? void 0 : _canvasElParent$current2.clientWidth) || 0)
            canvas.renderAll()
        }

        const resizeCanvas = () => setCurrentDimensions()

        setCurrentDimensions()
        window.addEventListener("resize", resizeCanvas, false)

        const foo = onReady && onReady(canvas)

        return () => {
            canvas.dispose()
            foo && foo()
            window.removeEventListener("resize", resizeCanvas)
        }
    }, [])
    return createElement("div", {
        ...props?.innerProps?.div,
        ref: canvasElParent,
    }, createElement("canvas", {
        ...props?.innerProps?.canvas,
        ref: canvasEl
    }))
}
