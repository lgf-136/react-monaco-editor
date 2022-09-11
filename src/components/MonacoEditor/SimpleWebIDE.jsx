import React, { useState, useEffect } from 'react';
import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
import { emmetHTML, emmetCSS, emmetJSX } from 'emmet-monaco-es';
import useLocalStorage from '../../hooks/useLocalStorage';

// be sure that you use the latest version of monaco
loader.config({
  paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.34.0/min/vs' },
});

function SimpleWebIDE() {
  const monaco = useMonaco();
  const [isReady, setIsReady] = useState(false);
  const [html, setHtml] = useLocalStorage('html', '');
  const [css, setCss] = useLocalStorage(
    'css',
    'body {color: #fff;background-color: #191919;}'
  );
  const [js, setJs] = useLocalStorage('js', '');
  const [srcDoc, setSrcDoc] = useState('');

  useEffect(() => {
    if (monaco) {
      const disposeCSS = emmetCSS(monaco);
      const disposeHTML = emmetHTML(monaco);
      const disposeJSX = emmetJSX(monaco);

      import('monaco-themes/themes/Monokai Bright.json')
        .then((data) => {
          monaco.editor.defineTheme('monokai-bright', data);
        })
        .then((_) => monaco.editor.setTheme('monokai-bright'));

      // render the Editor component only after emmet setup
      setIsReady(true);

      return () => {
        disposeCSS();
        disposeHTML();
        disposeJSX();
      };
    }
  }, [monaco]);

  useEffect(() => {
    //console.log(`Something Updated: ${html} ${css} ${js}`);
    const timeout = setTimeout(() => {
      setSrcDoc(`
        <html>
          <head>
            <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/dayjs@1.11.5/dayjs.min.js"></script>
            <style>
              ${css}
            </style>
          </head>
          <body>
            ${html}
            <script >${js}</script>
          </body>
        </html>
      `);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [html, css, js]);

  function switchTab(evt, languageName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName('tabcontent');
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = 'none';
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName('tablinks');
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(' active', '');
    }

    // setLanguage(languageName);
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(languageName).style.display = 'block';
    evt.currentTarget.className += ' active';
  }

  return (
    isReady && (
      <>
        <div className="mainContainer">
          <div className="tab">
            <button
              className="tablinks active"
              onClick={(e) => {
                switchTab(e, 'html');
              }}
            >
              HTML
            </button>
            <button
              className="tablinks"
              onClick={(e) => {
                switchTab(e, 'css');
              }}
            >
              CSS
            </button>
            <button
              className="tablinks"
              onClick={(e) => {
                switchTab(e, 'javascript');
              }}
            >
              JavaScript
            </button>
          </div>
          <div id="html" className="tabcontent" style={{ display: 'block' }}>
            <Editor
              className="editor"
              // height={600}
              language="html"
              value={html}
              onChange={setHtml}
              loading={'Loading...'}
            />
          </div>

          <div id="css" className="tabcontent">
            <Editor
              className="editor"
              // height={600}
              language="css"
              value={css}
              onChange={setCss}
              loading={'Loading...'}
            />
          </div>

          <div id="javascript" className="tabcontent">
            <Editor
              className="editor"
              // height={600}
              language="javascript"
              value={js}
              onChange={setJs}
              loading={'Loading...'}
            />
          </div>
          <iframe
            srcDoc={srcDoc}
            title="output"
            className="result-iframe iframe-visual-update"
            sandbox="allow-downloads allow-forms allow-modals allow-pointer-lock allow-popups allow-presentation allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
          ></iframe>
        </div>
        <style jsx={'true'}>
          {`
          .mainContainer {
            height: 100%;
          }
          .tab{
            overflow: hidden;
            background: #191919;
          }
          .tabcontent{
            display: none;
            width: 100%;
          }
          .result-iframe {
            background: #fff;
            border: none;
            width: 100%;
            min-height: 300px;
          }
          .editor{
            min-height: 600px;
          }
          .tablinks{
            background: #191919;
            color: #fff;
            padding: 10px;
            border: none;
            font-size: 16px;
          }
          .tablinks:hover{
            background: #272822;
          }
          .tablinks.active{
            background: #272822;
          }
        `}
        </style>
      </>
    )
  );
}

export default SimpleWebIDE;
