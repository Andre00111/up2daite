export function downloadCardAsPng(canvas: HTMLCanvasElement, filename: string) {
  canvas.toBlob((blob) => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.png`
    a.click()
    URL.revokeObjectURL(url)
  }, 'image/png')
}
