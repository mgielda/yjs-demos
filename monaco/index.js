/* eslint-env browser */

import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { MonacoBinding } from 'y-monaco'
import * as monaco from 'monaco-editor'

self.MonacoEnvironment = {
  getWorkerUrl: function (moduleId, label) {
    if (label === 'json') {
      return '/dist/json.worker.bundle.js'
    }
    if (label === 'css') {
      return '/dist/css.worker.bundle.js'
    }
    if (label === 'html') {
      return '/dist/html.worker.bundle.js'
    }
    if (label === 'typescript' || label === 'javascript') {
      return '/dist/ts.worker.bundle.js'
    }
    return '/dist/editor.worker.bundle.js'
  }
}

window.addEventListener('load', () => {
  const ydocument = new Y.Doc()
  const provider = new WebsocketProvider(`${location.protocol === 'http:' ? 'ws:' : 'wss:'}${location.host}`, 'monaco', ydocument)
  const type = ydocument.getText('monaco')

  const editor = monaco.editor.create(document.getElementById('monaco-editor'), {
    value: '',
    language: 'javascript',
    theme: 'vs-dark'
  })
  const monacoBinding = new MonacoBinding(type, editor.getModel(), new Set([editor]), provider.awareness)

  const connectBtn = document.querySelector('.y-connect-btn')
  connectBtn.addEventListener('click', () => {
    if (ydocument.wsconnected) {
      ydocument.disconnect()
      connectBtn.textContent = 'Connect'
    } else {
      ydocument.connect()
      connectBtn.textContent = 'Disconnect'
    }
  })

  window.example = { provider, ydocument, type, monacoBinding }
})