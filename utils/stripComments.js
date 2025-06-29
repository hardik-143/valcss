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
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/.*/g, "")
  );
}

module.exports = { stripComments };
