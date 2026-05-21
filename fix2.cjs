const fs = require('fs');
const file = 'c:/Users/liyaq/OneDrive/Desktop/SMS_project/src/features/dashboard/pages/PremiumDashboard.jsx';
let c = fs.readFileSync(file, 'utf8');
c = c.replace(
  `          <div style={{ width: pct + '%', height:'100%', backgroundColor:'var(--primary)', borderRadius:'3px' }} />\n        </div>\n    </div>\n  );\n}`,
  `          <div style={{ width: pct + '%', height:'100%', backgroundColor:'var(--primary)', borderRadius:'3px' }} />\n        </div>\n      </div>\n    </div>\n  );\n}`
);
fs.writeFileSync(file, c);
console.log('Fixed SectionRow');
