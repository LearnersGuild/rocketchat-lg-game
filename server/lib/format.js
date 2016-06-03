/* global formatUsage:true, formatError:true */
/* exported formatUsage, formatError */

// Rocket.Chat's version of highlight.js that formats blocks of code between
// triple-backticks doesn't support a "plaintext" non-highlighted mode, so
// we fake it with the "diff" language that it does support
formatUsage = text => `\`\`\`diff\n${text}\`\`\``

formatError = msg => {
  const formattedText = `**Error:** ${msg.toString()}`  // prefix with bold 'Error:'
    .replace(/\-{1,2}[^\s]+/, '`$&`')                   // show options preformatted
  return `${formattedText}. Try \`--help\` for usage.`  // append usage suggestion
}
