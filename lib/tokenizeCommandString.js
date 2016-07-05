/* global tokenizeCommandString:true */
/* exported tokenizeCommandString */

tokenizeCommandString = commandStr => {
  let inSingleQuotes = false
  let inDoubleQuotes = false
  const commandArray = commandStr.split('')
  // replace argument-delimiters with '\n' which we'll use to split-on later
  for (let i = 0; i < commandArray.length; ++i) {
    if (commandArray[i] === "'" && !inDoubleQuotes) {
      inSingleQuotes = !inSingleQuotes
      commandArray[i] = '\n'
    }
    if (commandArray[i] === '"' && !inSingleQuotes) {
      inDoubleQuotes = !inDoubleQuotes
      commandArray[i] = '\n'
    }
    if (commandArray[i] === ' ' && !inSingleQuotes && !inDoubleQuotes) {
      commandArray[i] = '\n'
    }
  }
  return commandArray
    .join('')                        // turn array back into string
    .split('\n')                     // split the arguments into an array
    .filter(arg => arg.length > 0)   // empty arguments aren't arguments
}
