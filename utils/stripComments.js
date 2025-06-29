/**
 * Strips comments from the content.
 * @param {string} content - The content to strip comments from.
 * @description
 * - Removes HTML comments
 * - Removes multi-line JS comments
 * - Removes single-line JS comments
 * @returns {string} The content with comments stripped.
 */
function stripComments(content) {
  return (
    content
      .replace(/<!--[\s\S]*?-->/g, "") // remove html comments
      .replace(/\/\*[\s\S]*?\*\//g, "") // remove multi-line js comments
      .replace(/\/\/.*/g, "") // remove single-line js comments
  );
}

module.exports = { stripComments };
