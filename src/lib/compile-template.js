import path from 'path';
import fs from 'fs';
import Handlebars from 'handlebars';
let COMPILED_TEMPLATES = {};
/**
 * open template file in sync (open once and cache it in COMPILED_TEMPLATES) and compile it with Handlebars!
 * @param {String} templateName - filename of template
 * @param {String} type - the file type
 * @returns {Object} - compiled templates
 */
function compileTemplate (templateName, type) {
  const filename = `${templateName}.${type}`;
  const filepath = path.resolve('./src/templates', filename);

  const templateCached = COMPILED_TEMPLATES[`${templateName}.${type}`];

  const template = !templateCached ? fs.readFileSync(filepath, 'utf8') : '';

  //check if the template has already been opened, if not compile it 
  if (!templateCached) {
    COMPILED_TEMPLATES[`${templateName}.${type}`] = Handlebars.compile(template);
  }

  return COMPILED_TEMPLATES[`${templateName}.${type}`];
}

export default compileTemplate;
