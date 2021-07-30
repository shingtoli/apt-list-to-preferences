const fs = require('fs');
const { execSync } = require('child_process');
const yargs = require('yargs');

argv = yargs
        .scriptName('apt-list-to-preferences')
        .usage('$0 [args]')
        .option('filename', {
            alias: 'f',
            description: 'Indicate file to load, leave blank to call apt internally',
            type: 'string'
        })
        .option('priority', {
            alias: 'p',
            description: 'Pin Priority to generate',
            type: 'number',
            default: -1
        })
        .option('writeout', {
            alias: 'w',
            description: 'Filename to write output to',
            type: 'string',
            default: './preferences'
        })
        .help()
        .argv

const {filename, priority, writeout} = argv;

let aptlist;
if (filename) {
    aptlist = fs.readFileSync(filename, { encoding: 'utf8' });
} else {
    aptlist = execSync('apt list', {"shell":"/bin/bash", "maxBuffer": 1024*1024*1024}).toString();
}

const packageRegex = /([\w-]*)\/([\w-,]*)\s([^\s]*)\s(\w*)\s\[(.*)\]/;

const aptprefs = aptlist
    .split('\n')
    .filter(p => p.trim().length > 0)
    .map((package) => {
        const matches = package.match(packageRegex);
        if (!matches) {
            return null;
        }
        
        const [, name, , version] = matches;
        return `
Package: ${name}
Pin: version ${version}
Pin-Priority: ${priority}
        `;
    })
    .filter(s => s !== null)
    .join('');

fs.writeFileSync(writeout, aptprefs)
