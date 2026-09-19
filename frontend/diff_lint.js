const fs = require('fs');

const curr = JSON.parse(fs.readFileSync('lint_current.json', 'utf16le').replace(/^\uFEFF/, ''));
const base = JSON.parse(fs.readFileSync('lint_baseline.json', 'utf16le').replace(/^\uFEFF/, ''));

function formatList(list) {
  const result = [];
  list.forEach(f => {
    const basename = f.filePath.split('\\').pop().split('/').pop();
    f.messages.forEach(m => {
      result.push({
        file: basename,
        line: m.line,
        severity: m.severity === 2 ? 'error' : 'warning',
        ruleId: m.ruleId,
        message: m.message
      });
    });
  });
  return result;
}

const finalData = formatList(curr);
const baselineData = formatList(base);

console.log('--- FINAL LINT LIST ---');
finalData.forEach(item => console.log(`${item.file}:${item.line} [${item.severity}] ${item.ruleId}: ${item.message.split('\n')[0]}`));

console.log('\n--- BASELINE LINT LIST ---');
baselineData.forEach(item => console.log(`${item.file}:${item.line} [${item.severity}] ${item.ruleId}: ${item.message.split('\n')[0]}`));

console.log('\n--- IN FINAL BUT NOT IN BASELINE ---');
finalData.forEach(fi => {
  if (!baselineData.some(bi => bi.ruleId === fi.ruleId && bi.message === fi.message)) {
    console.log(`${fi.file}:${fi.line} [${fi.severity}] ${fi.ruleId}`);
  }
});

console.log('\n--- IN BASELINE BUT NOT IN FINAL ---');
baselineData.forEach(bi => {
  if (!finalData.some(fi => fi.ruleId === bi.ruleId && fi.message === bi.message)) {
    console.log(`${bi.file}:${bi.line} [${bi.severity}] ${bi.ruleId}`);
  }
});
