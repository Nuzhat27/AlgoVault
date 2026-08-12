import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { javascript } from '@codemirror/lang-javascript';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { go } from '@codemirror/lang-go';
import { dracula } from '@uiw/codemirror-theme-dracula';

const extensionsFor = (lang) => {
  switch (lang) {
    case 'javascript':
      return [javascript()];
    case 'java':
      return [java()];
    case 'c++':
      return [cpp()];
    case 'go':
      return [go()];
    default:
      return [python()];
  }
};

export default function CodeEditor({ value, language, onChange }) {
  return (
    <div className="cm-wrap">
      <CodeMirror
        value={value}
        height="260px"
        theme={dracula}
        extensions={extensionsFor(language)}
        onChange={onChange}
        basicSetup={{ lineNumbers: true, highlightActiveLine: true, bracketMatching: true }}
      />
    </div>
  );
}
