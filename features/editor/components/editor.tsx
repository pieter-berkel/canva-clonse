"use client";

import { useEffect, useRef } from "react";
import { fabric } from "fabric";

import { useEditor } from "../hooks/use-editor";
import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";

export const Editor = () => {
  const { init } = useEditor();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      controlsAboveOverlay: true,
      preserveObjectStacking: true,
    });

    init({
      initialCanvas: canvas,
      initialContainer: containerRef.current!,
    });

    return () => {
      canvas.dispose();
    };
  }, [init]);

  return (
    <div className="flex h-full flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main>
          <div className="flex-1 bg-muted" ref={containerRef}>
            <canvas ref={canvasRef} />
          </div>
        </main>
      </div>
    </div>
  );
};
