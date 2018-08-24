#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const program = require('commander');

const {
  getConfig,
  buildPrettifier,
  logIntro,
  logItemCompletion,
  logConclusion,
  logError,
} = require('./helpers');
const {
  requireOptional,
  mkDirPromise,
  readFilePromiseRelative,
  writeFilePromise,
} = require('./utils');


// Load our package.json, so that we can pass the version onto `commander`.
const { version } = require('../package.json');

// Get the default config for this component (looks for local/global overrides,
// falls back to sensible defaults).
const config = getConfig();

// Convenience wrapper around Prettier, so that config doesn't have to be
// passed every time.
const prettify = buildPrettifier(config.prettierConfig);


program
  .version(version)
  .arguments('<componentName>')
  .option(
    '-t, --type <componentType>',
    'Type of React native component to generate (default: "class")',
    /^(class|pure-class|functional)$/i,
    config.type
  ).option(
    '-d, --dir <pathToDirectory>',
    'Path to the "components" directory (default: "_root directory")',
    config.dir
  ).option(
    '-x, --extension <fileExtension>',
    'Which file extension to use for the component (default: "js")',
    config.extension
  ).parse(process.argv);

const [componentName] = program.args;
const viewComponentName = `${componentName}View`;

// Find the path to the selected template file.
const templatePath = `./templates/${program.type}.js`;

// Get all of our file paths worked out, for the user's project.
const componentDir = `${program.dir}/${componentName}`;
const viewfilePath = `${componentDir}/${viewComponentName}.${program.extension}`;

const containerTemplatePath = `./templates/classViewContainer.js`;
const containerPath = `${componentDir}/${viewComponentName}Container.${program.extension}`;

const styleTemplatePath = `./templates/classStyles.js`;
const stylePath = `${componentDir}/${viewComponentName}Styles.${program.extension}`;

logIntro({ name: componentName, dir: componentDir, type: program.type });


// Check to see if a directory at the given path exists
const fullPathToParentDir = path.resolve(program.dir);
if (!fs.existsSync(fullPathToParentDir)) {
  logError(`Sorry, you need to create a parent "components" directory.\n(redux-cmp-generator is looking for a directory at ${program.dir}).`)
  process.exit(0);
}

// Check to see if this component has already been created
const fullPathToComponentDir = path.resolve(componentDir);
if (fs.existsSync(fullPathToComponentDir)) {
  logError(`Looks like this component already exists! There's already a component at ${componentDir}.\nPlease delete this directory and try again.`)
  process.exit(0);
}

// Start by creating the directory that our component lives in.
mkDirPromise(componentDir)
  .then(() => (
    readFilePromiseRelative(templatePath)
  ))
  .then(template => {
    logItemCompletion('Directory created.');
    return template;
  })
  .then(template => (
    // Replace our placeholders with real data (so far, just the component name)
    template.replace(/COMPONENT_NAME/g, componentName)
  ))
  .then(template => (
    // Format it using prettier, to ensure style consistency, and write to View file.
    writeFilePromise(viewfilePath, prettify(template))
  ))
  .then(template => (
    // We also need the `ViewContainer` file, which allows easy importing.
    writeFilePromise(viewContainerPath, prettify(containerTemplatePath))
  ))
  .then(template => (
    // We also need the `ViewStyles` file, which allows easy importing.
    writeFilePromise(viewStylePath, prettify(styleTemplatePath))
  ))
  .then(template => {
    logItemCompletion('Component built and saved to disk.');
    return template;
  })
  .then(template => {
    logItemCompletion('Index file built and saved to disk.');
    return template;
  })
  .then(template => {
    logConclusion();
  })
  .catch(err => {
    console.error(err);
  })
