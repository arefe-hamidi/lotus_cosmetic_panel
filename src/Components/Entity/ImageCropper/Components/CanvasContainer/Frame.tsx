interface iProps {
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
    onResizeStart: (handle: string) => void
}

export default function CropFrame({
    cropFrame,
    isDragging,
    canvasWidth,
    canvasHeight,
    onMouseDown,
    onResizeStart
}: iProps) {
    return (
        <>
            {/* Dark Overlay - Top */}
            <div
                className="absolute bg-black/60 backdrop-blur-[1px]"
                style={{
                    left: 0,
                    top: 0,
                    width: "100%",
                    height: cropFrame.y
                }}
            />

            {/* Dark Overlay - Bottom */}
            <div
                className="absolute bg-black/60 backdrop-blur-[1px]"
                style={{
                    left: 0,
                    top: cropFrame.y + cropFrame.height,
                    width: "100%",
                    height: canvasHeight - (cropFrame.y + cropFrame.height)
                }}
            />

            {/* Dark Overlay - Left */}
            <div
                className="absolute bg-black/60 backdrop-blur-[1px]"
                style={{
                    left: 0,
                    top: cropFrame.y,
                    width: cropFrame.x,
                    height: cropFrame.height
                }}
            />

            {/* Dark Overlay - Right */}
            <div
                className="absolute bg-black/60 backdrop-blur-[1px]"
                style={{
                    left: cropFrame.x + cropFrame.width,
                    top: cropFrame.y,
                    width: canvasWidth - (cropFrame.x + cropFrame.width),
                    height: cropFrame.height
                }}
            />

            {/* Crop Frame Overlay */}
            <div
                className="absolute border-2 border-white shadow-lg ring-1 ring-black/20"
                style={{
                    left: cropFrame.x,
                    top: cropFrame.y,
                    width: cropFrame.width,
                    height: cropFrame.height,
                    cursor: isDragging ? "grabbing" : "grab",
                    boxShadow:
                        "0 0 0 1px rgba(0,0,0,0.1), 0 0 0 3px rgba(255,255,255,0.8), 0 4px 12px rgba(0,0,0,0.15)"
                }}
                onMouseDown={e => {
                    e.stopPropagation()
                    onMouseDown(e)
                }}
            >
                {/* Resize Handles */}
                <div
                    className="absolute -top-1 -left-1 h-3 w-3 cursor-nw-resize border border-gray-600 bg-white shadow-md ring-1 ring-black/10"
                    onMouseDown={e => {
                        e.stopPropagation()
                        onResizeStart("nw")
                    }}
                />
                <div
                    className="absolute -top-1 -right-1 h-3 w-3 cursor-ne-resize border border-gray-600 bg-white shadow-md ring-1 ring-black/10"
                    onMouseDown={e => {
                        e.stopPropagation()
                        onResizeStart("ne")
                    }}
                />
                <div
                    className="absolute -bottom-1 -left-1 h-3 w-3 cursor-sw-resize border border-gray-600 bg-white shadow-md ring-1 ring-black/10"
                    onMouseDown={e => {
                        e.stopPropagation()
                        onResizeStart("sw")
                    }}
                />
                <div
                    className="absolute -right-1 -bottom-1 h-3 w-3 cursor-se-resize border border-gray-600 bg-white shadow-md ring-1 ring-black/10"
                    onMouseDown={e => {
                        e.stopPropagation()
                        onResizeStart("se")
                    }}
                />
            </div>
        </>
    )
}
