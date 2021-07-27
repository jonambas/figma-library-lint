import * as React from 'react';
import * as ReactDOM from 'react-dom';
function App(props) {
    return React.createElement("div", null, "test");
}
// class App extends React.Component {
//   // textbox: HTMLInputElement
//   // countRef = (element: HTMLInputElement) => {
//   //   if (element) element.value = '5'
//   //   this.textbox = element
//   // }
//   // onCreate = () => {
//   //   const count = parseInt(this.textbox.value, 10)
//   //   parent.postMessage({ pluginMessage: { type: 'create-rectangles', count } }, '*')
//   // }
//   // onCancel = () => {
//   //   parent.postMessage({ pluginMessage: { type: 'cancel' } }, '*')
//   // }
//   render() {
//     return (
//       <div>
//         test
//         {/* <p>Count: <input ref={this.countRef} /></p>
//         <button id="create" onClick={this.onCreate}>Create</button>
//         <button onClick={this.onCancel}>Cancel</button> */}
//       </div>
//     );
//   }
// }
ReactDOM.render(React.createElement(App, null), document.getElementById('react-root'));
// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.
// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).
// This shows the HTML page in "ui.html".
// figma.showUI(__html__);
// const errors = [];
// // Pass in a style id
// // Returns true if id is external to the Figma file
// function isRemote(id: string): RegExpMatchArray {
//   return id.match(/\,.+:.+/)
// }
// // Traverses through nodes
// function traverse(node) {
//   if (node.type !== 'PAGE') {
//     // console.log(node.fillStyleId)
//   }
//   if (node.type === 'TEXT') {
//     if (!isRemote(node.fillStyleId)) {
//       errors.push(node.id)
//     }
//   }
//   if ("children" in node) {
//     if (node.type !== "INSTANCE") {
//       for (const child of node.children) {
//         traverse(child)
//       }
//     }
//   }
// }
// // Calls to "parent.postMessage" from within the HTML page will trigger this
// // callback. The callback will be passed the "pluginMessage" property of the
// // posted message.
// figma.ui.onmessage = msg => {
//   // One way of distinguishing between different types of messages sent from
//   // your HTML page is to use an object with a "type" property like this.
//   if (msg.type === 'lint') {
//     traverse(figma.currentPage) // start the traversal at the root
//     console.log(errors)
//     figma.ui.postMessage({ errors })
//   }
//   // Make sure to close the plugin when you're done. Otherwise the plugin will
//   // keep running, which shows the cancel button at the bottom of the screen.
//   // figma.closePlugin();
//   if (msg.type === 'close') {
//     figma.closePlugin();
//   }
// };
