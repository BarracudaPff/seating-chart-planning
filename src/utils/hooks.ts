// Hook
import {useEffect, useState} from "react";

type KeyOptions = { ctrlKey?: boolean, altKey?: boolean, metaKey?: boolean }
export const useKeyPress = (targetKey: string, options?: KeyOptions) => {
    // State for keeping track of whether key is pressed
    const [keyPressed, setKeyPressed] = useState(false)

    // If pressed key is our target key then set to true
    const downHandler = (ev: KeyboardEvent) => {
        if (ev.key === targetKey
            && ev.ctrlKey === (options?.ctrlKey ?? false)
            && ev.altKey === (options?.altKey ?? false)
            && ev.metaKey === (options?.metaKey ?? false)) {
            setKeyPressed(true)
        }
    }

    // If released key is our target key then set to false
    const upHandler = (ev: KeyboardEvent) => {
        if (ev.key === targetKey) {
            setKeyPressed(false)
        }
    }

    // Add event listeners
    useEffect(() => {
        window.addEventListener("keydown", downHandler)
        window.addEventListener("keyup", upHandler)
        // Remove event listeners on cleanup
        return () => {
            window.removeEventListener("keydown", downHandler)
            window.removeEventListener("keyup", upHandler)
        }
    }, []) // Empty array ensures that effect is only run on mount and unmount

    return keyPressed
}
