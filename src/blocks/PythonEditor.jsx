import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";

export default function PythonEditor({ value, onChange }) {
  return <CodeMirror value={value} extensions={[python()]} onChange={onChange} />;
}
