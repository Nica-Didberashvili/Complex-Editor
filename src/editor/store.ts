import { create } from "zustand";
import { Node, EditorState } from "./types";

const generateId = () => Math.random().toString(36).substring(2, 9);

const getSnapshot = (state: EditorState): EditorState => ({
  nodes: state.nodes,
  selectedId: state.selectedId,
  clipboard: state.clipboard,
  dragBackup: state.dragBackup,
  history: { past: [], future: [] },
});

interface EditorStore extends EditorState {
  addNode: (x: number, y: number) => void;
  selectNode: (id: string | null) => void;
  startDrag: () => void;
  moveNode: (id: string, x: number, y: number) => void;
  endDrag: () => void;
  updateLabel: (id: string, label: string) => void;
  deleteSelected: () => void;
  copyNode: () => void;
  pasteNode: () => void;
  undo: () => void;
  redo: () => void;
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  nodes: {},
  selectedId: null,
  clipboard: null,
  dragBackup: null,
  history: { past: [], future: [] },

  addNode: (x, y) => {
    const state = get();
    const id = generateId();
    const newNode: Node = { id, type: "task", x, y, label: "New Task" };
    
    set({
      nodes: { ...state.nodes, [id]: newNode },
      selectedId: id,
      history: { past: [...state.history.past, getSnapshot(state)], future: [] },
    });
  },

  selectNode: (id) => set({ selectedId: id }),

  startDrag: () => {
    const state = get();
    set({ dragBackup: state.nodes });
  },

  moveNode: (id, x, y) => {
    set((state) => {
      const node = state.nodes[id];
      if (!node) return state;
      return { nodes: { ...state.nodes, [id]: { ...node, x, y } } };
    });
  },

  endDrag: () => {
    const state = get();
    if (!state.dragBackup) return;
    
    const snapshot = { ...state, nodes: state.dragBackup };
    
    set({
      dragBackup: null,
      history: { past: [...state.history.past, getSnapshot(snapshot)], future: [] },
    });
  },

  updateLabel: (id, label) => {
    const state = get();
    set({
      nodes: { ...state.nodes, [id]: { ...state.nodes[id], label } },
      history: { past: [...state.history.past, getSnapshot(state)], future: [] },
    });
  },

  deleteSelected: () => {
    const state = get();
    if (!state.selectedId) return;
    
    const newNodes = { ...state.nodes };
    delete newNodes[state.selectedId];
    
    set({
      nodes: newNodes,
      selectedId: null,
      history: { past: [...state.history.past, getSnapshot(state)], future: [] },
    });
  },

  copyNode: () => {
    const state = get();
    if (!state.selectedId) return;
    set({ clipboard: state.nodes[state.selectedId] });
  },

  pasteNode: () => {
    const state = get();
    if (!state.clipboard) return;
    
    const id = generateId();
    const newNode = { ...state.clipboard, id, x: state.clipboard.x + 20, y: state.clipboard.y + 20 };
    
    set({
      nodes: { ...state.nodes, [id]: newNode },
      selectedId: id,
      history: { past: [...state.history.past, getSnapshot(state)], future: [] },
    });
  },

  undo: () => {
    const state = get();
    const previous = state.history.past[state.history.past.length - 1];
    if (!previous) return;
    
    const newPast = state.history.past.slice(0, -1);
    
    set({
      ...previous,
      history: { past: newPast, future: [getSnapshot(state), ...state.history.future] },
    });
  },

  redo: () => {
    const state = get();
    const next = state.history.future[0];
    if (!next) return;
    
    const newFuture = state.history.future.slice(1);
    
    set({
      ...next,
      history: { past: [...state.history.past, getSnapshot(state)], future: newFuture },
    });
  },
}));