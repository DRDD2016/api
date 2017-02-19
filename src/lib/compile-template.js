import path from 'path';
import fs from 'fs';
import Handlebars from 'handlebars';
let COMPILED_TEMPLATES = {};
/**
 * open template file sync (ONCE) and compile it!
 * @param {String} templateName - filename of template
 * @param {String} type - the file type
 * @returns {Object} - compiled templates
 */
function compileTemplate (templateName, type) {
  const filename = `${templateName}.${type}`;
  const filepath = path.resolve('./src/templates', filename);

  const templateCached = COMPILED_TEMPLATES[`${templateName}.${type}`];

  const template = fs.readFileSync(filepath, 'utf8');
  let compiled = Handlebars.compile(template);

  //check if the template has already been opened
  if (!templateCached) {
    COMPILED_TEMPLATES[`${templateName}.${type}`] = compiled;
  }

  return COMPILED_TEMPLATES[`${templateName}.${type}`];
}

export default compileTemplate;
