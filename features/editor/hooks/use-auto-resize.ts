import { useCallback, useEffect } from "react";
import { fabric } from "fabric";

type UseAutoResizeArgs = {
  canvas: fabric.Canvas | null;
  container: HTMLDivElement | null;
};

export const useAutoResize = ({ canvas, container }: UseAutoResizeArgs) => {
  const autoZoom = useCallback(() => {
    if (!canvas || !container) return;

    const width = container.offsetWidth;
    const height = container.offsetHeight;

    canvas.setWidth(width);
    canvas.setHeight(height);

    const center = canvas.getCenter();

    const localWorkspace = canvas
      .getObjects()
      .find(({ name }) => name === "clip");

    // @ts-expect-error - fabric types are wrong
    const scale = fabric.util.findScaleToFit(localWorkspace, {
      width,
      height,
    });

    const zoomRatio = 0.85;
    const zoom = scale * zoomRatio;

    canvas.setViewportTransform(fabric.iMatrix.concat());
    canvas.zoomToPoint(new fabric.Point(center.left, center.top), zoom);

    if (!localWorkspace) return;
    if (canvas.width === undefined || canvas.height === undefined) return;

    const workspaceCenter = localWorkspace.getCenterPoint();
    const viewportTransform = canvas.viewportTransform;

    if (!viewportTransform) return;

    viewportTransform[4] =
      canvas.width / 2 - workspaceCenter.x * viewportTransform[0];
    viewportTransform[5] =
      canvas.height / 2 - workspaceCenter.y * viewportTransform[3];

    canvas.setViewportTransform(viewportTransform);

    localWorkspace.clone((cloned: fabric.Rect) => {
      canvas.clipPath = cloned;
      canvas.requestRenderAll();
    });
  }, [canvas, container]);

  useEffect(() => {
    if (!canvas || !container) return;

    const resizeObserber = new ResizeObserver(() => {
      autoZoom();
    });

    resizeObserber.observe(container);

    return () => {
      resizeObserber.disconnect();
    };
  }, [canvas, container, autoZoom]);
};
