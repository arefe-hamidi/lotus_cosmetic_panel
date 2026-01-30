import { useEffect, useRef } from "react"

interface iProps {
    image: string
    scale: number
    rotation: number
    canvasWidth: number
    canvasHeight: number
}

export default function Canvas({ image, scale, rotation, canvasWidth, canvasHeight }: iProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if (image) {
            const img = new Image()
            img.onload = () => {
                const canvas = canvasRef.current
                if (canvas) {
                    const ctx = canvas.getContext("2d")
                    if (ctx) {
                        canvas.width = canvasWidth
                        canvas.height = canvasHeight

                        // Fill the entire canvas with the image (no letterboxing/pillarboxing)
                        ctx.clearRect(0, 0, canvas.width, canvas.height)
                        ctx.save()
                        ctx.translate(canvas.width / 2, canvas.height / 2)
                        ctx.rotate((rotation * Math.PI) / 180)
                        ctx.scale(scale, scale)
                        ctx.translate(-canvas.width / 2, -canvas.height / 2)
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
                        ctx.restore()
                    }
                }
            }
            img.src = image
        }
    }, [image, scale, rotation, canvasWidth, canvasHeight])

    return <canvas ref={canvasRef} />
}
