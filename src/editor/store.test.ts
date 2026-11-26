import { describe, it, expect, beforeEach } from "vitest";
import { useEditorStore } from "./store";

describe("Editor Store (Zustand)", () => {
  beforeEach(() => {
    useEditorStore.setState({
      nodes: {},
      selectedId: null,
      clipboard: null,
      dragBackup: null,
      history: { past: [], future: [] },
    });
  });

  it("adds a node and selects it", () => {
    useEditorStore.getState().addNode(100, 100);
    
    const state = useEditorStore.getState();
    const nodes = Object.values(state.nodes);
    expect(nodes.length).toBe(1);
    expect(nodes[0].x).toBe(100);
    expect(state.selectedId).toBe(nodes[0].id);
    expect(state.history.past.length).toBe(1);
  });

  it("moves a node and tracks history at the end of drag", () => {
    const store = useEditorStore.getState();
    store.addNode(0, 0);
    const id = useEditorStore.getState().selectedId!;
    
    store.startDrag();
    store.moveNode(id, 50, 50);
    store.endDrag();
    
    const state = useEditorStore.getState();
    expect(state.nodes[id].x).toBe(50);
    expect(state.history.past.length).toBe(2);
  });

  it("undoes and redoes actions", () => {
    const store = useEditorStore.getState();
    
    store.addNode(0, 0);
    const id = useEditorStore.getState().selectedId!;

    store.startDrag();
    store.moveNode(id, 100, 100);
    store.endDrag();

    useEditorStore.getState().undo();
    let state = useEditorStore.getState();
    
    expect(state.nodes[id].x).toBe(0);
    expect(state.history.past.length).toBe(1);
    expect(state.history.future.length).toBe(1);

    state.redo();
    state = useEditorStore.getState();
    
    expect(state.nodes[id].x).toBe(100);
    expect(state.history.past.length).toBe(2);
    expect(state.history.future.length).toBe(0);
  });

  it("does not track history when selecting", () => {
    const store = useEditorStore.getState();
    store.addNode(0, 0);
    
    store.selectNode(null);
    
    const state = useEditorStore.getState();
    expect(state.history.past.length).toBe(1);
  });

  it("copies and pastes a node", () => {
    const store = useEditorStore.getState();
    store.addNode(10, 10);
    
    store.copyNode();
    store.pasteNode();
    
    const state = useEditorStore.getState();
    const nodes = Object.values(state.nodes);
    expect(nodes.length).toBe(2);
    
    const pasted = nodes.find(n => n.x === 30);
    expect(pasted).toBeDefined();
  });
});