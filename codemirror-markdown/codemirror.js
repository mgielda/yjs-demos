/* eslint-env browser */

// @ts-ignore
import CodeMirror from 'codemirror'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { CodemirrorBinding } from 'y-codemirror'
import 'codemirror/mode/gfm/gfm';

var md = require('markdown-it')('commonmark');

window.addEventListener('load', () => {
  const ydoc = new Y.Doc()
  const provider = new WebsocketProvider(
    'wss://demos.yjs.dev',
    'codemirror',
    ydoc
  )
  const yText = ydoc.getText('codemirror')
  const editorContainer = document.createElement('div')
  editorContainer.setAttribute('id', 'editor')
  document.body.insertBefore(editorContainer, null)
  
  const renderedContainer = document.createElement('div')
  renderedContainer.setAttribute('id', 'rendered')
  document.body.insertBefore(renderedContainer, null)

  const editor = CodeMirror(editorContainer, {
    mode: 'gfm',
    lineNumbers: true
  })
  
  ydoc.on('update', function() {
    var result = md.render(editor.getValue());
    renderedContainer.innerHTML = result;
  });

  const binding = new CodemirrorBinding(yText, editor, provider.awareness)

  const connectBtn = /** @type {HTMLElement} */ (document.getElementById('y-connect-btn'))
  connectBtn.addEventListener('click', () => {
    if (provider.shouldConnect) {
      provider.disconnect()
      connectBtn.textContent = 'Connect'
    } else {
      provider.connect()
      connectBtn.textContent = 'Disconnect'
    }
  })

  // @ts-ignore
  window.example = { provider, ydoc, yText, binding }
})
