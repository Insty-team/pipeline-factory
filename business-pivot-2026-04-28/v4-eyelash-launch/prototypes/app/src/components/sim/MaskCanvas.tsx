"use client";

import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";

export type MaskCanvasHandle = {
  exportImagePng: () => Promise<Blob>;
  exportMaskPng: () => Promise<Blob>;
  clear: () => void;
  hasStrokes: () => boolean;
};

type Props = {
  imageUrl: string;
  size?: number;
};

export const MaskCanvas = forwardRef<MaskCanvasHandle, Props>(function MaskCanvas(
  { imageUrl, size = 1024 },
  ref
) {
  const bgRef = useRef<HTMLCanvasElement>(null);
  const fgRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const lastPt = useRef<{ x: number; y: number } | null>(null);
  const dirty = useRef(false);

  useEffect(() => {
    const bg = bgRef.current!;
    const ctx = bg.getContext("2d")!;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      ctx.clearRect(0, 0, size, size);
      const s = Math.min(size / img.width, size / img.height);
      const w = img.width * s;
      const h = img.height * s;
      ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
    };
    img.src = imageUrl;
    const fg = fgRef.current!;
    fg.getContext("2d")!.clearRect(0, 0, size, size);
    dirty.current = false;
  }, [imageUrl, size]);

  useImperativeHandle(ref, () => ({
    async exportImagePng() {
      const out = document.createElement("canvas");
      out.width = size;
      out.height = size;
      const c = out.getContext("2d")!;
      c.drawImage(bgRef.current!, 0, 0);
      return await new Promise<Blob>((res) =>
        out.toBlob((b) => res(b!), "image/png")
      );
    },
    async exportMaskPng() {
      const out = document.createElement("canvas");
      out.width = size;
      out.height = size;
      const c = out.getContext("2d")!;
      const baseImg = bgRef.current!;
      c.drawImage(baseImg, 0, 0);
      const overlay = fgRef.current!;
      const od = overlay.getContext("2d")!.getImageData(0, 0, size, size);
      const id = c.getImageData(0, 0, size, size);
      for (let i = 0; i < od.data.length; i += 4) {
        if (od.data[i + 3] > 0) {
          id.data[i + 3] = 0;
        }
      }
      c.putImageData(id, 0, 0);
      return await new Promise<Blob>((res) =>
        out.toBlob((b) => res(b!), "image/png")
      );
    },
    clear() {
      const fg = fgRef.current!;
      fg.getContext("2d")!.clearRect(0, 0, size, size);
      dirty.current = false;
    },
    hasStrokes() {
      return dirty.current;
    },
  }));

  function getPos(e: React.PointerEvent<HTMLCanvasElement>) {
    const c = fgRef.current!;
    const rect = c.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * size,
      y: ((e.clientY - rect.top) / rect.height) * size,
    };
  }

  function start(e: React.PointerEvent<HTMLCanvasElement>) {
    e.preventDefault();
    drawing.current = true;
    lastPt.current = getPos(e);
    fgRef.current!.setPointerCapture(e.pointerId);
  }

  function move(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const p = getPos(e);
    const ctx = fgRef.current!.getContext("2d")!;
    ctx.strokeStyle = "rgba(232, 155, 174, 0.55)";
    ctx.lineWidth = Math.round(size * 0.07);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    if (lastPt.current) {
      ctx.moveTo(lastPt.current.x, lastPt.current.y);
    } else {
      ctx.moveTo(p.x, p.y);
    }
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    lastPt.current = p;
    dirty.current = true;
  }

  function end(e: React.PointerEvent<HTMLCanvasElement>) {
    drawing.current = false;
    lastPt.current = null;
    try {
      fgRef.current!.releasePointerCapture(e.pointerId);
    } catch {}
  }

  return (
    <div
      className="relative bg-pink-50 rounded-2xl overflow-hidden touch-none"
      style={{ width: "100%", aspectRatio: "1 / 1" }}
    >
      <canvas
        ref={bgRef}
        width={size}
        height={size}
        className="absolute inset-0 w-full h-full"
      />
      <canvas
        ref={fgRef}
        width={size}
        height={size}
        className="absolute inset-0 w-full h-full cursor-crosshair"
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
      />
    </div>
  );
});
