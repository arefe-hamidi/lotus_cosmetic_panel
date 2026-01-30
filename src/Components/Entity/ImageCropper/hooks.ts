import { useCallback, useEffect, useRef, useState } from "react"
import { ASPECT_RATIOS } from "./constants"

export function useCropState(image: string) {
    const [scale, setScale] = useState(1)
    const [rotation, setRotation] = useState(0)
    const [isDragging, setIsDragging] = useState(false)
    const [isResizing, setIsResizing] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const [resizeHandle, setResizeHandle] = useState<string | null>(null)
    const [selectedAspectRatio, setSelectedAspectRatio] = useState<string>(ASPECT_RATIOS["16/9"])
    const [width, setWidth] = useState(800)
    const [height, setHeight] = useState(450)
    const [originalWidth, setOriginalWidth] = useState<number | undefined>()
    const [originalHeight, setOriginalHeight] = useState<number | undefined>()
    const [canvasWidth, setCanvasWidth] = useState(400)
    const [canvasHeight, setCanvasHeight] = useState(400)
    const isUpdatingFromFrame = useRef(false)
    const [cropFrame, setCropFrame] = useState({
        x: 22,
        y: 100,
        width: 356,
        height: 200
    })

    // Load original image dimensions when component mounts or image changes
    useEffect(() => {
        if (image) {
            const img = new Image()
            img.onload = () => {
                setOriginalWidth(img.naturalWidth)
                setOriginalHeight(img.naturalHeight)

                // Calculate canvas dimensions based on image aspect ratio
                const maxCanvasSize = 400
                const imageAspectRatio = img.naturalWidth / img.naturalHeight
                let newCanvasWidth, newCanvasHeight

                if (imageAspectRatio > 1) {
                    // Landscape: width is larger
                    newCanvasWidth = maxCanvasSize
                    newCanvasHeight = maxCanvasSize / imageAspectRatio
                } else {
                    // Portrait or square: height is larger or equal
                    newCanvasHeight = maxCanvasSize
                    newCanvasWidth = maxCanvasSize * imageAspectRatio
                }

                setCanvasWidth(Math.round(newCanvasWidth))
                setCanvasHeight(Math.round(newCanvasHeight))

                // Initialize crop frame for 16:9 aspect ratio centered on the new canvas
                const cropWidth = Math.min(newCanvasWidth * 0.8, newCanvasHeight * 0.8 * (16 / 9))
                const cropHeight = cropWidth / (16 / 9)
                const cropX = (newCanvasWidth - cropWidth) / 2
                const cropY = (newCanvasHeight - cropHeight) / 2

                setCropFrame({
                    x: cropX,
                    y: cropY,
                    width: cropWidth,
                    height: cropHeight
                })

                // Calculate initial output dimensions
                const cropFrameScaleX = cropWidth / newCanvasWidth
                const cropFrameScaleY = cropHeight / newCanvasHeight

                const initialWidth = Math.round(img.naturalWidth * cropFrameScaleX * scale)
                const initialHeight = Math.round(img.naturalHeight * cropFrameScaleY * scale)

                setWidth(initialWidth)
                setHeight(initialHeight)
            }
            img.src = image
        }
    }, [image, scale])

    // Initialize original dimensions when they're set
    useEffect(() => {
        if (originalWidth && originalHeight && !width && !height) {
            setWidth(originalWidth)
            setHeight(originalHeight)
        }
    }, [originalWidth, originalHeight, width, height])

    // Function to calculate output dimensions based on current state
    const calculateOutputDimensions = useCallback(() => {
        if (!originalWidth || !originalHeight) return { width: 800, height: 450 }

        // Calculate what portion of the original image the crop frame represents
        const cropFrameScaleX = cropFrame.width / canvasWidth
        const cropFrameScaleY = cropFrame.height / canvasHeight

        // Calculate the final output dimensions
        const outputWidth = Math.round(originalWidth * cropFrameScaleX * scale)
        const outputHeight = Math.round(originalHeight * cropFrameScaleY * scale)

        return { width: outputWidth, height: outputHeight }
    }, [
        originalWidth,
        originalHeight,
        cropFrame.width,
        cropFrame.height,
        canvasWidth,
        canvasHeight,
        scale
    ])

    // Update width and height when crop frame changes
    useEffect(() => {
        if (cropFrame.width > 0 && cropFrame.height > 0 && !isUpdatingFromFrame.current) {
            const { width: newWidth, height: newHeight } = calculateOutputDimensions()
            isUpdatingFromFrame.current = true
            setWidth(newWidth)
            setHeight(newHeight)
            setTimeout(() => {
                isUpdatingFromFrame.current = false
            }, 100)
        }
    }, [cropFrame.width, cropFrame.height, calculateOutputDimensions])

    // Update width and height when scale changes
    useEffect(() => {
        if (originalWidth && originalHeight && !isUpdatingFromFrame.current) {
            const { width: newWidth, height: newHeight } = calculateOutputDimensions()
            isUpdatingFromFrame.current = true
            setWidth(newWidth)
            setHeight(newHeight)
            setTimeout(() => {
                isUpdatingFromFrame.current = false
            }, 100)
        }
    }, [scale, originalWidth, originalHeight, calculateOutputDimensions])

    const resetTransform = () => {
        setScale(1)
        setRotation(0)
    }

    const handleAspectRatioChange = (newRatio: string) => {
        setSelectedAspectRatio(newRatio)

        // Calculate new frame dimensions based on aspect ratio
        let aspectRatio: number

        switch (newRatio) {
            case ASPECT_RATIOS["1/1"]:
                aspectRatio = 1
                break
            case ASPECT_RATIOS["3/4"]:
                aspectRatio = 3 / 4
                break
            case ASPECT_RATIOS["16/9"]:
                aspectRatio = 16 / 9
                break
            case ASPECT_RATIOS["0"]:
                // Free form - keep current dimensions
                return
            default:
                aspectRatio = 16 / 9
        }

        // Calculate new crop dimensions that fit within the canvas
        const maxWidth = canvasWidth * 0.9
        const maxHeight = canvasHeight * 0.9

        let newWidth, newHeight

        if (aspectRatio > canvasWidth / canvasHeight) {
            // Crop is wider than canvas - limit by width
            newWidth = Math.min(maxWidth, maxHeight * aspectRatio)
            newHeight = newWidth / aspectRatio
        } else {
            // Crop is taller than canvas - limit by height
            newHeight = Math.min(maxHeight, maxWidth / aspectRatio)
            newWidth = newHeight * aspectRatio
        }

        // Center the frame
        const newX = (canvasWidth - newWidth) / 2
        const newY = (canvasHeight - newHeight) / 2

        setCropFrame({
            x: newX,
            y: newY,
            width: newWidth,
            height: newHeight
        })

        // Calculate output dimensions manually for the new crop frame
        if (originalWidth && originalHeight) {
            const cropFrameScaleX = newWidth / canvasWidth
            const cropFrameScaleY = newHeight / canvasHeight
            const newOutputWidth = Math.round(originalWidth * cropFrameScaleX * scale)
            const newOutputHeight = Math.round(originalHeight * cropFrameScaleY * scale)

            setWidth(newOutputWidth)
            setHeight(newOutputHeight)
        }
    }

    const detectAspectRatio = (width: number, height: number) => {
        const ratio = width / height
        const tolerance = 0.1

        if (Math.abs(ratio - 16 / 9) < tolerance) {
            return ASPECT_RATIOS["16/9"]
        } else if (Math.abs(ratio - 1) < tolerance) {
            return ASPECT_RATIOS["1/1"]
        } else if (Math.abs(ratio - 3 / 4) < tolerance) {
            return ASPECT_RATIOS["3/4"]
        } else {
            return ASPECT_RATIOS["0"] // Free
        }
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!isDragging && !isResizing) {
            setIsDragging(true)
            setDragStart({
                x: e.clientX - cropFrame.x,
                y: e.clientY - cropFrame.y
            })
        }
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) {
            const newX = e.clientX - dragStart.x
            const newY = e.clientY - dragStart.y

            // Constrain to canvas bounds
            const maxX = canvasWidth - cropFrame.width
            const maxY = canvasHeight - cropFrame.height

            setCropFrame(prev => ({
                ...prev,
                x: Math.max(0, Math.min(newX, maxX)),
                y: Math.max(0, Math.min(newY, maxY))
            }))
        } else if (isResizing && resizeHandle) {
            const rect = e.currentTarget.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top

            let newWidth = cropFrame.width
            let newHeight = cropFrame.height
            let newX = cropFrame.x
            let newY = cropFrame.y

            switch (resizeHandle) {
                case "se":
                    newWidth = Math.max(50, Math.min(x - cropFrame.x, canvasWidth - cropFrame.x))
                    newHeight = Math.max(50, Math.min(y - cropFrame.y, canvasHeight - cropFrame.y))
                    break
                case "sw":
                    newWidth = Math.max(
                        50,
                        Math.min(cropFrame.x + cropFrame.width - x, cropFrame.x)
                    )
                    newX = Math.max(0, Math.min(x, cropFrame.x + cropFrame.width - 50))
                    newHeight = Math.max(50, Math.min(y - cropFrame.y, canvasHeight - cropFrame.y))
                    break
                case "ne":
                    newWidth = Math.max(50, Math.min(x - cropFrame.x, canvasWidth - cropFrame.x))
                    newHeight = Math.max(
                        50,
                        Math.min(cropFrame.y + cropFrame.height - y, cropFrame.y)
                    )
                    newY = Math.max(0, Math.min(y, cropFrame.y + cropFrame.height - 50))
                    break
                case "nw":
                    newWidth = Math.max(
                        50,
                        Math.min(cropFrame.x + cropFrame.width - x, cropFrame.x)
                    )
                    newHeight = Math.max(
                        50,
                        Math.min(cropFrame.y + cropFrame.height - y, cropFrame.y)
                    )
                    newX = Math.max(0, Math.min(x, cropFrame.x + cropFrame.width - 50))
                    newY = Math.max(0, Math.min(y, cropFrame.y + cropFrame.height - 50))
                    break
            }

            setCropFrame({
                x: newX,
                y: newY,
                width: newWidth,
                height: newHeight
            })
        }
    }

    const handleMouseUp = () => {
        setIsDragging(false)
        setIsResizing(false)
        setResizeHandle(null)

        // Update selected aspect ratio based on current frame dimensions
        const detectedRatio = detectAspectRatio(cropFrame.width, cropFrame.height)
        setSelectedAspectRatio(detectedRatio)
    }

    const handleResizeStart = (handle: string) => {
        setIsResizing(true)
        setResizeHandle(handle)
    }

    return {
        // State
        scale,
        rotation,
        cropFrame,
        isDragging,
        isResizing,
        resizeHandle,
        selectedAspectRatio,
        width,
        height,
        originalWidth,
        originalHeight,
        canvasWidth,
        canvasHeight,

        // Setters
        setScale,
        setRotation,
        setCropFrame,
        setWidth,
        setHeight,
        setOriginalWidth,
        setOriginalHeight,

        // Actions
        resetTransform,
        handleAspectRatioChange,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleResizeStart
    }
}
