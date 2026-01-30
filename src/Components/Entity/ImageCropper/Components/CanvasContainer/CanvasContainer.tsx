import Canvas from "./Canvas"
import CropFrame from "./Frame"

interface iProps {
    image: string
    scale: number
    rotation: number
    cropFrame: {
        x: number
        y: number
        width: number
        height: number
    }
    isDragging: boolean
    canvasWidth: number
    canvasHeight: number
    onMouseDown: (e: React.MouseEvent) => void
    onMouseMove: (e: React.MouseEvent) => void
    onMouseUp: () => void
    onResizeStart: (handle: string) => void
}

export default function CanvasContainer({
    image,
    scale,
    rotation,
    cropFrame,
    isDragging,
    canvasWidth,
    canvasHeight,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onResizeStart
}: iProps) {
    return (
        <div className="flex items-center justify-center">
            <div
                className="relative overflow-hidden border"
                style={{ width: canvasWidth, height: canvasHeight }}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
            >
                <Canvas
                    image={image}
                    scale={scale}
                    rotation={rotation}
                    canvasWidth={canvasWidth}
                    canvasHeight={canvasHeight}
                />
                <CropFrame
                    cropFrame={cropFrame}
                    isDragging={isDragging}
                    canvasWidth={canvasWidth}
                    canvasHeight={canvasHeight}
                    onMouseDown={onMouseDown}
                    onResizeStart={onResizeStart}
                />
            </div>
        </div>
    )
}
