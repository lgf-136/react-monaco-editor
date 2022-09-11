
import React, { useState, useEffect } from "react";
import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";
import { emmetHTML, emmetCSS, emmetJSX,expandAbbreviation } from "emmet-monaco-es";

loader.config({
  paths: {
    vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.34.0/min/vs',
    // vs: './MaconEditor/package/min/vs',
  },
  'vs/nls': {
    availableLanguages: {
      // '*': 'de', // on the editor, press right click to see the German words
      // '*': 'zh-cn',
    },
  },
});

const MonacoEditor =  (props)=>{
  const monaco = useMonaco();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (monaco) {
      const disposeCSS = emmetCSS(monaco);
      const disposeHTML = emmetHTML(monaco);
      const disposeJSX = emmetJSX(monaco);
      //主题设置有问题
      // import('monaco-themes/themes/Monokai Bright.json')
      //   .then((data) => {
      //     monaco.editor.defineTheme('monokai-bright', data);
      //   })
      //   .then((_) => monaco.editor.setTheme('monokai-bright'));

      // render the Editor component only after emmet setup
      setIsReady(true);

      return () => {
        disposeCSS();
        disposeHTML();
        disposeJSX();
      };
    }
  }, [monaco]);

return (
    <>
      <Editor
        className='monaco-editor'
        // height={props.height?props.height:600}
        // width={props.eidth?props.width:800}
        theme={props.theme?props.theme:'vs-dark'}
        language={props.language?props.language:'html'}
        value={props.value?props.value:'<h1>Monaco Editor</h1>'}
        onChange={props.onChange}
        loading={props.loading}
        options={{
          minimap: {
            enabled: props.props?props.props:true,
          },
        }}
      />
      <style jsx={"true"}>
        {`
          .monaco-editor {
            height: 100%;
            padding: 5px 0;
          }
        `}
      </style>
    </>
  );
}

export default MonacoEditor;