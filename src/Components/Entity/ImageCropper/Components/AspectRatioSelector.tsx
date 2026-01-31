import Button from "@/Components/Shadcn/button"
import { ASPECT_RATIOS } from "../constants"

interface iProps {
    selectedAspectRatio: string
    onAspectRatioChange: (ratio: string) => void
    width?: number
    height?: number
}

export default function AspectRatioSelector({
    selectedAspectRatio,
    onAspectRatioChange,
    width,
    height
}: iProps) {
    const aspectRatios = [
        { label: "16:9", value: ASPECT_RATIOS["16/9"] },
        { label: "1:1", value: ASPECT_RATIOS["1/1"] },
        { label: "3:4", value: ASPECT_RATIOS["3/4"] },
        { label: "Free", value: ASPECT_RATIOS["0"] }
    ]

    return (
        <div className="flex flex-col justify-between gap-2">
            <div>
                <label className="mb-3 block text-sm font-medium text-gray-700">Aspect Ratio</label>
                <div className="grid grid-cols-4 gap-2">
                    {aspectRatios.map(ratio => (
                        <Button
                            key={ratio.value}
                            variant={selectedAspectRatio === ratio.value ? "default" : "outline"}
                            size="sm"
                            onClick={() => onAspectRatioChange(ratio.value)}
                        >
                            {ratio.label}
                        </Button>
                    ))}
                </div>
            </div>
            <div className="text-muted-foreground flex gap-2 text-xs">
                <b>Current Size</b>
                <span>Width: {width}px</span>
                <span>Height: {height}px</span>
            </div>
        </div>
    )
}
