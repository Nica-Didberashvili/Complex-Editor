export interface Node {
  id: string;
  type: "task" | "decision";
  x: number;
  y: number;
  label: string;
}

export interface EditorState {
  nodes: Record<string, Node>;
  selectedId: string | null;
  clipboard: Node | null;
  dragBackup: Record<string, Node> | null;
  history: {
    past: EditorState[];
    future: EditorState[];
  };
}

export type Action =
  | { type: "ADD_NODE"; payload: { x: number; y: number } }
  | { type: "SELECT_NODE"; payload: string | null }
  | { type: "START_DRAG" }
  | { type: "MOVE_NODE"; payload: { id: string; x: number; y: number } }
  | { type: "END_DRAG" }
  | { type: "UPDATE_LABEL"; payload: { id: string; label: string } }
  | { type: "DELETE_SELECTED" }
  | { type: "COPY_NODE" }
  | { type: "PASTE_NODE" }
  | { type: "UNDO" }
  | { type: "REDO" };