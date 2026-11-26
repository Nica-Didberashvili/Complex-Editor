import { useEditorStore } from "./store";
import { Node } from "./Node";
import { PropertiesPanel } from "./PropertiesPanel";

export function Editor() {
  const nodeIds = useEditorStore((state) => Object.keys(state.nodes));
  
  const addNode = useEditorStore((state) => state.addNode);
  const selectNode = useEditorStore((state) => state.selectNode);
  const undo = useEditorStore((state) => state.undo);
  const redo = useEditorStore((state) => state.redo);
  const pasteNode = useEditorStore((state) => state.pasteNode);
  
  const pastLength = useEditorStore((state) => state.history.past.length);
  const futureLength = useEditorStore((state) => state.history.future.length);
  const clipboard = useEditorStore((state) => state.clipboard);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) selectNode(null);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    addNode(e.clientX - rect.left, e.clientY - rect.top);
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif", overflow: "hidden" }}>
      <div style={{ width: 240, padding: 20, borderRight: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: 12, background: "#fff" }}>
        <h2 style={{ margin: 0, fontSize: 18, color: "#0f172a", marginBottom: 8 }}>Workflow Builder</h2>
        <button onClick={undo} disabled={pastLength === 0} style={{ padding: 10, borderRadius: 6, border: "1px solid #cbd5e1", background: "#f8fafc", opacity: pastLength ? 1 : 0.5 }}>Undo</button>
        <button onClick={redo} disabled={futureLength === 0} style={{ padding: 10, borderRadius: 6, border: "1px solid #cbd5e1", background: "#f8fafc", opacity: futureLength ? 1 : 0.5 }}>Redo</button>
        <button onClick={pasteNode} disabled={!clipboard} style={{ padding: 10, borderRadius: 6, border: "1px solid #cbd5e1", background: "#f8fafc", opacity: clipboard ? 1 : 0.5 }}>Paste</button>
      </div>

      <div
        onClick={handleCanvasClick}
        onDoubleClick={handleDoubleClick}
        style={{ flex: 1, position: "relative", backgroundColor: "#f8fafc", backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)", backgroundSize: "20px 20px", overflow: "hidden" }}
      >
        <div style={{ position: "absolute", top: 20, left: 20, color: "#64748b", pointerEvents: "none", fontSize: 14 }}>
          Double-click anywhere to add a node.
        </div>
        
        {nodeIds.map((id) => <Node key={id} id={id} />)}
      </div>

      <PropertiesPanel />
    </div>
  );
}