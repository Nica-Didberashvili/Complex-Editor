import { useEditorStore } from "./store";

export function PropertiesPanel() {
  const selectedId = useEditorStore((state) => state.selectedId);
  
  const node = useEditorStore((state) => (state.selectedId ? state.nodes[state.selectedId] : null));

  const updateLabel = useEditorStore((state) => state.updateLabel);
  const copyNode = useEditorStore((state) => state.copyNode);
  const deleteSelected = useEditorStore((state) => state.deleteSelected);

  return (
    <div style={{ width: 280, padding: 20, borderLeft: "1px solid #e2e8f0", background: "#f8fafc", display: "flex", flexDirection: "column", gap: 16 }}>
      <h2 style={{ margin: 0, fontSize: 16, color: "#0f172a" }}>Properties</h2>
      {!node ? (
        <p style={{ color: "#64748b", fontSize: 14 }}>Select a node to edit its properties.</p>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: "#475569" }}>Label</label>
            <input
              value={node.label}
              onChange={(e) => updateLabel(node.id, e.target.value)}
              style={{ padding: 8, borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 14 }}
            />
          </div>
          <hr style={{ border: "none", borderTop: "1px solid #e2e8f0", margin: "8px 0" }} />
          <button onClick={copyNode} style={{ padding: 10, borderRadius: 6, border: "1px solid #cbd5e1", background: "#fff", cursor: "pointer", fontWeight: 500 }}>Copy</button>
          <button onClick={deleteSelected} style={{ padding: 10, borderRadius: 6, border: "none", background: "#ef4444", color: "white", cursor: "pointer", fontWeight: 500 }}>Delete Node</button>
        </>
      )}
    </div>
  );
}