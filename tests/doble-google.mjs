// A stand-in for the parts of Google Apps Script that backend/apps-script/aula.gs uses, so that the real
// .gs file can run in Node. It imitates what Google Sheets does to values written into cells that are not
// "plain text": numbers, dates and formulas are converted; a leading apostrophe keeps a value as text.
// It is NOT Google: passing these tests says nothing about the real service (see backend/README.md).
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const NUMBER = /^[+-]?(\d+([.,]\d+)?|\d*\.\d+)(e[+-]?\d+)?$/i;
const DATE = /^\d{4}-\d{1,2}-\d{1,2}([ T][\d:.]+Z?)?$|^\d{1,2}[-/]\d{1,2}([-/]\d{2,4})?$/;
function convert(value, format) {
 if (typeof value !== 'string') return {value};
 if (value.startsWith("'")) return {value: value.slice(1)};
 if (format === '@') return {value};
 if (value.startsWith('=')) return {value: '#ERROR!', formula: value};
 if (NUMBER.test(value.trim())) return {value: Number(value.trim().replace(',', '.'))};
 if (DATE.test(value.trim())) return {value: new Date(value)};
 if (/^(true|false)$/i.test(value)) return {value: value.toLowerCase() === 'true'};
 return {value};
}

class Sheet {
 constructor(name) { this.name = name; this.cells = new Map(); this.formats = new Map(); this.formulas = new Map(); this.rows = 1000; this.cols = 26; this.frozen = 0; }
 getName() { return this.name; }
 setName(name) { this.book.rename(this, name); return this; }
 getMaxRows() { return this.rows; }
 getMaxColumns() { return this.cols; }
 insertRowsAfter(after, n) { this.rows += n; return this; }
 insertColumnsAfter(after, n) { this.cols += n; return this; }
 setFrozenRows(n) { this.frozen = n; return this; }
 getLastRow() { let last = 0; for (const [key, v] of this.cells) if (v !== '') last = Math.max(last, Number(key.split(',')[0])); return last; }
 getLastColumn() { let last = 0; for (const [key, v] of this.cells) if (v !== '') last = Math.max(last, Number(key.split(',')[1])); return last; }
 getRange(row, col, rows = 1, cols = 1) {
  if (row < 1 || col < 1 || rows < 1 || cols < 1 || row + rows - 1 > this.rows || col + cols - 1 > this.cols) throw new Error(`Rango fuera de la hoja ${this.name}: ${row},${col} ${rows}x${cols}`);
  this.book.calls.push(['getRange', this.name, row, col, rows, cols]);
  const sheet = this;
  return {
   getValues() { return Array.from({length: rows}, (_, r) => Array.from({length: cols}, (_, c) => sheet.cells.get(`${row + r},${col + c}`) ?? '')); },
   setValues(values) {
    if (values.length !== rows || values.some(line => line.length !== cols)) throw new Error('Las dimensiones de los datos no coinciden con las del intervalo');
    sheet.book.writes++;
    values.forEach((line, r) => line.forEach((v, c) => {
     const key = `${row + r},${col + c}`, out = convert(v, sheet.formats.get(key));
     sheet.cells.set(key, out.value);
     if (out.formula) sheet.formulas.set(key, out.formula); else sheet.formulas.delete(key);
    }));
    return this;
   },
   setNumberFormat(format) { for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) sheet.formats.set(`${row + r},${col + c}`, format); return this; },
  };
 }
 // For the tests: the rows as they would be seen in the sheet, header included.
 table() { const rows = this.getLastRow(), cols = this.getLastColumn(); return rows ? this.getRange(1, 1, rows, cols).getValues() : []; }
}

export function dobleGoogle() {
 const sheets = new Map();
 const book = {
  calls: [], writes: 0, busy: false,
  rename(sheet, name) { sheets.delete(sheet.name); sheet.name = name; sheets.set(name, sheet); },
  getSheetByName: name => sheets.get(name) || null,
  insertSheet(name) { if (sheets.has(name)) throw new Error('Ya existe una hoja con ese nombre'); const s = new Sheet(name); s.book = book; sheets.set(name, s); return s; },
  getSheets: () => [...sheets.values()],
 };
 const globals = {
  SpreadsheetApp: {getActiveSpreadsheet: () => book, flush() {}},
  ContentService: {MimeType: {JSON: 'application/json'}, createTextOutput: text => ({setMimeType() { return this; }, getContent: () => text})},
  LockService: {getScriptLock: () => ({tryLock: () => !book.busy, releaseLock() {}})},
 };
 return {book, globals, hoja: name => sheets.get(name) || null};
}

// Runs a .gs file against a fresh double and returns its entry points with JSON in and out.
export function cargarGs(file, doble = dobleGoogle()) {
 const context = vm.createContext({...doble.globals, console});
 vm.runInContext(readFileSync(file, 'utf8') + '\n;globalThis.__gs = {doPost, doGet};', context, {filename: file});
 const {doPost, doGet} = context.__gs;
 return {
  doble,
  post: body => JSON.parse(doPost({postData: {contents: typeof body === 'string' ? body : JSON.stringify(body)}}).getContent()),
  get: parameter => JSON.parse(doGet({parameter}).getContent()),
  doPost, doGet,
 };
}
