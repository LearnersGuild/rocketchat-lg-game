/* global usageFormat:true */
/* exported usageFormat */

// Rocket.Chat's version of highlight.js that formats blocks of code between
// triple-backticks doesn't support a "plaintext" non-highlighted mode, so
// we fake it with the "diff" language that it does support
usageFormat = text => `\`\`\`diff\n${text}\`\`\``
