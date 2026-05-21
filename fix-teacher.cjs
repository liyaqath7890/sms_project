const fs = require('fs');
const file = 'c:/Users/liyaq/OneDrive/Desktop/SMS_project/src/features/teacher/pages/AddTeacher.jsx';
let c = fs.readFileSync(file, 'utf8');
const match = c.match(/<div style=\{\{padding:'1rem',backgroundColor:'#fee2e2'/);
if (!match) {
  console.log('No fee2e2 div found - tag scenario changed');
} else {
  // Ensure proper close
  if (!c.includes("#fee2e2',borderRadius:8,marginBottom:'1rem',fontWeight:500}}>{error}</motion.div>")) {
    c = c.replace("#fee2e2',borderRadius:8,marginBottom:'1rem',fontWeight:500}}>{error}</motion.div>", "#fee2e2',borderRadius:8,marginBottom:'1rem',fontWeight:500}}>{error}</div></motion.div>");
  }
}
// Actually easier: run through tsx verification or just rewrite cleanly. 
// Let's just check for unclosed div
const lines = c.split('\n');
let depth=0;
for(let i=0;i<lines.length;i++){
  const l=lines[i];
  const opens=(l.match(/<div/g)||[]).length;
  const closes=(l.match(/<\/div>/g)||[]).length;
  depth+=opens-closes;
}
console.log('div depth at end:',depth);
if(depth>0) {
  c = c.trimEnd();
  if(!c.endsWith(';')) c += String.fromCharCode(10) + '}'.repeat(depth);
}
fs.writeFileSync(file,c);
console.log('Fixed AddTeacher');
