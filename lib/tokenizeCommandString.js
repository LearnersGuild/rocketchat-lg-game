/* global tokenizeCommandString:true */
/* exported tokenizeCommandString */

// we need to filter out non-args in case the command string was `/cycle `
tokenizeCommandString = str => str.split(/\s+/).filter(arg => arg.trim().length > 0)
