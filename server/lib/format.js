/* global formatUsage:true, formatError:true */
/* exported formatUsage, formatError */

// Rocket.Chat's version of highlight.js that formats blocks of code between
// triple-backticks doesn't support a "plaintext" non-highlighted mode, so
// we fake it with the "diff" language that it does support
formatUsage = text => `\`\`\`diff\n${text}\`\`\``

formatError = msg => {
  return msg.toString()
    // ensure prefixed with bold 'Error:'
    .replace(/(^Error: )?(.*)/, '**Error:** $2')
    // preformat commands or solo options
    .replace(/(\W)((\/\w+)(\s+\-{1,2}[\w_-]+)*|\-{1,2}[\w_-]+)/g, '$1`$2`')
    // make sure nothing got doubly-preformatted
    .replace(/``/g, '`')
}
