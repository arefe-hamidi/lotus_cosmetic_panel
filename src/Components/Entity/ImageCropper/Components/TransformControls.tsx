import Button from "@/Components/Shadcn/button"
import  Input  from "@/Components/Shadcn/input"
import { Slider } from "@/Components/Shadcn/slider"
import { RotateCcw, RotateCw } from "lucide-react"
import { useState } from "react"

interface iProps {
    scale: number
    rotation: number
    onScaleChange: (scale: number) => void
    onRotationChange: (rotation: number) => void
}

export default function TransformControls({
    scale,
    rotation,
    onScaleChange,
    onRotationChange
}: iProps) {
    const [isEditingRotation, setIsEditingRotation] = useState(false)
    const [rotationInput, setRotationInput] = useState("")

    const rotateLeft = () => {
        const newRotation = rotation - 90
        onRotationChange(newRotation < -180 ? newRotation + 360 : newRotation)
    }

    const rotateRight = () => {
        const newRotation = rotation + 90
        onRotationChange(newRotation > 180 ? newRotation - 360 : newRotation)
    }

    const handleRotationInputChange = (value: string) => {
        setRotationInput(value)
    }

    const handleRotationInputBlur = () => {
        const numValue = parseFloat(rotationInput)
        if (!isNaN(numValue)) {
            // Constrain to -180 to 180 range
            let constrainedValue = numValue
            while (constrainedValue > 180) constrainedValue -= 360
            while (constrainedValue < -180) constrainedValue += 360

            onRotationChange(constrainedValue)
        }
        setRotationInput("")
        setIsEditingRotation(false)
    }

    const handleRotationInputKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleRotationInputBlur()
        } else if (e.key === "Escape") {
            setRotationInput("")
            setIsEditingRotation(false)
        }
    }

    const startEditingRotation = () => {
        setRotationInput(rotation.toString())
        setIsEditingRotation(true)
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                    <label className="text-sm font-medium text-gray-700">Scale :</label>
                    <span className="text-sm font-medium">{scale.toFixed(1)}x</span>
                </div>
                <Slider
                    value={[scale]}
                    onValueChange={([value]: [number]) => onScaleChange(value)}
                    min={0.1}
                    max={3}
                    step={0.1}
                    className="w-full"
                />
            </div>
            <div>
                <label className="mb-3 block text-sm font-medium text-gray-700">Rotation</label>
                <div className="flex items-center gap-3">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={rotateLeft}
                        className="h-10 w-10 p-0"
                    >
                        <RotateCcw className="h-4 w-4" />
                    </Button>

                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                            const newRotation = rotation - 15
                            onRotationChange(newRotation < -180 ? newRotation + 360 : newRotation)
                        }}
                        className="flex-1"
                    >
                        -15°
                    </Button>

                    {isEditingRotation ? (
                        <Input
                            type="number"
                            value={rotationInput}
                            onChange={e => handleRotationInputChange(e.target.value)}
                            onBlur={handleRotationInputBlur}
                            onKeyDown={handleRotationInputKeyDown}
                            className="w-20 text-center text-sm"
                            autoFocus
                        />
                    ) : (
                        <div
                            className="bg-muted hover:bg-muted-foreground flex h-10 w-20 cursor-pointer items-center justify-center rounded-lg transition-colors"
                            onClick={startEditingRotation}
                        >
                            <span className="text-sm font-medium">{rotation}°</span>
                        </div>
                    )}
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                            const newRotation = rotation + 15
                            onRotationChange(newRotation > 180 ? newRotation - 360 : newRotation)
                        }}
                        className="flex-1"
                    >
                        +15°
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={rotateRight}
                        className="h-10 w-10 p-0"
                    >
                        <RotateCw className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
