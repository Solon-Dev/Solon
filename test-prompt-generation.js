// Quick test to verify prompt generation works
const { ACCESSIBILITY_PLAYBOOK, SECURITY_PLAYBOOK } = require('./src/lib/playbooks/presets.ts');

console.log('=== PLAYBOOKS LOADED ===');
console.log('Accessibility rules:', ACCESSIBILITY_PLAYBOOK.rules.length);
console.log('Security rules:', SECURITY_PLAYBOOK.rules.length);

console.log('\n=== SAMPLE ACCESSIBILITY RULES ===');
ACCESSIBILITY_PLAYBOOK.rules.slice(0, 2).forEach(rule => {
  console.log(`- [${rule.severity}] ${rule.category}: ${rule.description}`);
});

console.log('\n=== SAMPLE SECURITY RULES ===');
SECURITY_PLAYBOOK.rules.slice(0, 2).forEach(rule => {
  console.log(`- [${rule.severity}] ${rule.category}: ${rule.description}`);
});
