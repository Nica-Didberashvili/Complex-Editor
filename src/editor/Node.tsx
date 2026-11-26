import { useRef } from "react";
import { useEditorStore } from "./store";

export function Node({ id }: { id: string }) {
  const node = useEditorStore((state) => state.nodes[id]);
  const isSelected = useEditorStore((state) => state.selectedId === id);
  
  const selectNode = useEditorStore((state) => state.selectNode);
  const startDrag = useEditorStore((state) => state.startDrag);
  const moveNode = useEditorStore((state) => state.moveNode);
  const endDrag = useEditorStore((state) => state.endDrag);

  const dragOffset = useRef({ x: 0, y: 0 });

  if (!node) return null;

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    selectNode(id);
    startDrag();
    dragOffset.current = { x: e.clientX - node.x, y: e.clientY - node.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.buttons !== 1) return;
    moveNode(id, e.clientX - dragOffset.current.x, e.clientY - dragOffset.current.y);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    endDrag();
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        position: "absolute", left: node.x, top: node.y, width: 140, padding: "12px 16px",
        background: isSelected ? "#eff6ff" : "#ffffff",
        border: isSelected ? "2px solid #2563eb" : "1px solid #cbd5e1",
        borderRadius: 8, cursor: "grab", userSelect: "none", touchAction: "none",
        boxShadow: isSelected ? "0 4px 12px rgba(37, 99, 235, 0.15)" : "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <div style={{ fontSize: 11, textTransform: "uppercase", color: "#64748b", fontWeight: 600, marginBottom: 4 }}>
        {node.type}
      </div>
      <div style={{ fontWeight: 500, color: "#0f172a" }}>{node.label}</div>
    </div>
  );
}