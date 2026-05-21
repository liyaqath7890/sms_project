const fs = require('fs');
const file = 'c:/Users/liyaq/OneDrive/Desktop/SMS_project/src/features/dashboard/pages/PremiumDashboard.jsx';
let c = fs.readFileSync(file, 'utf8');
// Fix error section missing closing div
c = c.replace(
  `<button onClick={() => fetchDashboardData(true)} style={{ padding:'0.75rem 1.5rem', backgroundColor:'var(--primary)', color:'white', border:'none', borderRadius:'var(--radius-md)', cursor:'pointer', fontWeight:600 }}>Try Again</button>\n        </div>\n    );`,
  `<button onClick={() => fetchDashboardData(true)} style={{ padding:'0.75rem 1.5rem', backgroundColor:'var(--primary)', color:'white', border:'none', borderRadius:'var(--radius-md)', cursor:'pointer', fontWeight:600 }}>Try Again</button>\n        </div>\n      </div>\n    );`
);
// Fix sections overview block missing closing div
c = c.replace(
  `            <SectionRow key={section.id} section={section} />\n            ))}\n          </div>\n      </motion.div>`,
  `            <SectionRow key={section.id} section={section} />\n            ))}\n          </div>\n        </div>\n      </motion.div>`
);
// Fix SectionRow missing closing divs
c = c.replace(
  `          <div style={{ width: pct + '%', height:'100%', backgroundColor:'var(--primary)', borderRadius:'3px' }} />\n        </div>\n    );\n}`,
  `          <div style={{ width: pct + '%', height:'100%', backgroundColor:'var(--primary)', borderRadius:'3px' }} />\n        </div>\n      </div>\n    </div>\n  );\n}`
);
fs.writeFileSync(file, c);
console.log('Fixed missing tags');
