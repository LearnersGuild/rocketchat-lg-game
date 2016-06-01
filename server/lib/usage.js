/* global usageFormat:true, usageMessage:true */
/* exported usageFormat, usageMessage */

// Rocket.Chat's version of highlight.js that formats blocks of code between
// triple-backticks doesn't support a "plaintext" non-highlighted mode, so
// we fake it with the "diff" language that it does support
usageFormat = text => `\`\`\`diff\n${text}\`\`\``

usageMessage = msg => {
  const formattedText = msg.toString().replace(/error:/i, '**ERROR:**').replace(/\-{1,2}[^\s]+/, '`$&`')
  return `${formattedText}. Try \`--help\` for usage.`
}
