// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__, { height: 300 });

let errors = [];

// Pass in a style id
// Returns true if id is external to the Figma file
function isLocal(id: string): boolean {
  if (typeof id === 'string') {
    return !id.match(/\,.+:.+/);
  }

  return false; // Need to investigate why fillStyleId is returning symbols
}

// Traverses through nodes
function traverse(node) {
  // Text nodes
  if (node.type === 'TEXT') {
    // Text fill style (font color)
    if (isLocal(node.fillStyleId)) {
      errors.push({ id: node.id, label: node.name, message: 'Fill style not recognized' });
    }

    // // Text text style (font size, family, etc)
    if (isLocal(node.textStyleId)) {
      errors.push({ id: node.id, label: node.name, message: 'Text style not recognized' });
    }
  }

  if (['ELLIPSE', 'POLYGON', 'RECTANGLE', 'GROUP', 'STAR'].includes(node.type)) {
    if (node.fills?.length && isLocal(node.fillStyleId)) {
      errors.push({ id: node.id, label: node.name, message: 'Fill style not recognized' });
    }

    if (node.strokes?.length && isLocal(node.strokeStyleId)) {
      errors.push({ id: node.id, label: node.name, message: 'Stroke style not recognized' });
    }

    if (node.effects?.length && isLocal(node.effectStyleId)) {
      errors.push({ id: node.id, label: node.name, message: 'Effect style not recognized' });
    }
  }

  // Traverses child nodes
  if ('children' in node) {
    if (node.type !== 'INSTANCE') {
      for (const child of node.children) {
        traverse(child);
      }
    }
  }
}

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
figma.ui.onmessage = (msg) => {
  // One way of distinguishing between different types of messages sent from
  // your HTML page is to use an object with a "type" property like this.
  if (msg.type === 'lint') {
    errors = [];
    traverse(figma.currentPage); // start the traversal at the root
    figma.ui.postMessage({ type: 'linting-complete', data: { errors } });
  }

  if (msg.type === 'focus-node') {
    const node = [figma.getNodeById(msg.node)];

    // @ts-ignore
    figma.currentPage.selection = node;
    figma.viewport.scrollAndZoomIntoView(node);
  }

  // Make sure to close the plugin when you're done. Otherwise the plugin will
  // keep running, which shows the cancel button at the bottom of the screen.
  // figma.closePlugin();

  if (msg.type === 'close') {
    figma.closePlugin();
  }
};
