// Joins the sources into the two files the game loads: js/app.js and css/app.css.
// Run from the project folder:  node tools/build.js
const fs=require('fs');
const js=['config','state','online','world','audio','ui','screens','generator','gen','fx','game','skin','main'];
fs.writeFileSync('js/app.js','// Built by tools/build.js from src/*.js.txt. Edit the sources, then rebuild.\n'+js.map(f=>'/* '+f+' */\n'+fs.readFileSync('src/'+f+'.js.txt','utf8')).join('\n'));
const css=['style','theme','skin'];
fs.writeFileSync('css/app.css',css.map(f=>'/* '+f+' */\n'+fs.readFileSync('src/'+f+'.css.txt','utf8')).join('\n'));
console.log('built js/app.js and css/app.css');
