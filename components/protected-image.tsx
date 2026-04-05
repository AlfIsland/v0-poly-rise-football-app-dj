"use client"

import { useCallback } from "react"

interface ProtectedImageProps {
  src: string
  alt: string
  className?: string
  containerClassName?: string
}

export function ProtectedImage({ src, alt, className = "", containerClassName = "" }: ProtectedImageProps) {
  const preventAction = useCallback((e: React.MouseEvent | React.DragEvent) => {
    e.preventDefault()
    return false
  }, [])

  return (
    <div className={`relative select-none ${containerClassName}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={`pointer-events-none ${className}`}
        draggable={false}
        onContextMenu={preventAction}
      />
      <div 
        className="absolute inset-0 bg-transparent" 
        onContextMenu={preventAction}
        onDragStart={preventAction}
      />
    </div>
  )
}
