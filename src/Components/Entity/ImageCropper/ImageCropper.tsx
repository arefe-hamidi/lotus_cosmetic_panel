import Button from "@/Components/Shadcn/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/Components/Shadcn/dialog"
import { iRegularParams } from "@/lib/configs/types"
import { Check, Crop, X } from "lucide-react"
import { useParams } from "next/navigation"
import { useState } from "react"
import AspectRatioSelector from "./Components/AspectRatioSelector"
import CanvasContainer from "./Components/CanvasContainer/CanvasContainer"
import TransformControls from "./Components/TransformControls"
import { useCropState } from "./hooks"
import { getDictionary } from "./i18n"

interface iProps {
    isOpen: boolean
    image: string
    type: string
    onClose: () => void
    onSubmit: (imageBlob: Blob) => Promise<void>
}

export default function ImageCropper({ isOpen, image, type, onClose, onSubmit }: iProps) {
    const { locale } = useParams<iRegularParams>()
    const dictionary = getDictionary(locale)
    const cropState = useCropState(image)
    const [isProcessing, setIsProcessing] = useState(false)

    const submitCropHandler = async () => {
        setIsProcessing(true)
        try {
            const img = new Image()
            img.onload = () => {
                try {
                    // Create final canvas with desired output dimensions
                    const canvas = document.createElement("canvas")
                    const ctx = canvas.getContext("2d")

                    if (ctx) {
                        canvas.width = cropState.width
                        canvas.height = cropState.height

                        // Calculate scale factors from display canvas to original image
                        const scaleX = img.width / cropState.canvasWidth
                        const scaleY = img.height / cropState.canvasHeight

                        // Calculate crop region in original image coordinates
                        const cropX = cropState.cropFrame.x * scaleX
                        const cropY = cropState.cropFrame.y * scaleY
                        const cropWidth = cropState.cropFrame.width * scaleX
                        const cropHeight = cropState.cropFrame.height * scaleY

                        // Apply transformations to canvas context
                        ctx.save()
                        ctx.translate(canvas.width / 2, canvas.height / 2)
                        ctx.rotate((cropState.rotation * Math.PI) / 180)
                        ctx.scale(cropState.scale, cropState.scale)

                        // Draw the cropped portion directly from original image
                        ctx.drawImage(
                            img,
                            cropX,
                            cropY,
                            cropWidth,
                            cropHeight,
                            -canvas.width / 2,
                            -canvas.height / 2,
                            canvas.width,
                            canvas.height
                        )
                        ctx.restore()

                        // Convert to blob and submit (type may be "jpeg" or "image/jpeg")
                        const mimeType = type.startsWith("image/") ? type : `image/${type}`
                        canvas.toBlob(
                            async blob => {
                                try {
                                    if (blob) {
                                        await onSubmit(blob)
                                    } else {
                                        console.error("Failed to create blob from canvas")
                                    }
                                } catch (error) {
                                    console.error("Error submitting cropped image:", error)
                                } finally {
                                    setIsProcessing(false)
                                }
                            },
                            mimeType,
                            0.95
                        )
                    } else {
                        setIsProcessing(false)
                    }
                } catch (error) {
                    console.error("Error processing image:", error)
                    setIsProcessing(false)
                }
            }
            img.onerror = () => {
                console.error("Failed to load image")
                setIsProcessing(false)
            }
            img.src = image
        } catch (error) {
            console.error("Error in submitCropHandler:", error)
            setIsProcessing(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-[90vh] gap-0 overflow-auto p-0 sm:max-w-2xl">
                <DialogHeader className="border-b px-6 py-4">
                    <DialogTitle className="flex items-center gap-2">
                        <Crop className="h-5 w-5" />
                        {dictionary.title}
                    </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-6 p-6">
                    <CanvasContainer
                        image={image}
                        scale={cropState.scale}
                        rotation={cropState.rotation}
                        cropFrame={cropState.cropFrame}
                        isDragging={cropState.isDragging}
                        canvasWidth={cropState.canvasWidth}
                        canvasHeight={cropState.canvasHeight}
                        onMouseDown={cropState.handleMouseDown}
                        onMouseMove={cropState.handleMouseMove}
                        onMouseUp={cropState.handleMouseUp}
                        onResizeStart={cropState.handleResizeStart}
                    />
                </div>
                <div className="flex flex-wrap items-stretch justify-between border-t p-6">
                    <AspectRatioSelector
                        selectedAspectRatio={cropState.selectedAspectRatio}
                        onAspectRatioChange={cropState.handleAspectRatioChange}
                        width={cropState.width}
                        height={cropState.height}
                    />
                    <TransformControls
                        scale={cropState.scale}
                        rotation={cropState.rotation}
                        onScaleChange={cropState.setScale}
                        onRotationChange={cropState.setRotation}
                    />
                </div>
                <div className="flex items-center justify-end border-t p-4">
                    <div className="flex items-center gap-3">
                        <Button variant="outline" onClick={() => onClose()}>
                            <X />
                            {dictionary.cancel}
                        </Button>
                        <Button onClick={submitCropHandler} disabled={isProcessing}>
                            <Check />
                            {isProcessing ? dictionary.processing : dictionary.apply}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
