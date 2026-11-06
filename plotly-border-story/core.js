(function (root) {
  'use strict';
  function monthsBetween(from, to) {
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(from) || !/^\d{4}-(0[1-9]|1[0-2])$/.test(to) || from > to) throw new Error('Choose a start month on or before the end month.');
    const result = [];
    const d = new Date(from + '-01T00:00:00Z');
    while (d.toISOString().slice(0, 7) <= to) {
      result.push(d.toISOString().slice(0, 7));
      if (result.length > 1200) throw new Error('Range too long.');
      d.setUTCMonth(d.getUTCMonth() + 1);
    }
    return result;
  }
  function selection(data, ports, from, to) {
    const months = monthsBetween(from, to);
    return [...new Set(ports.filter(Boolean))].map(port => {
      const source = data.rows.filter(r => r.port === port);
      if (!source.length) throw new Error('Unknown port.');
      const map = new Map(source.map(r => [r.month, r.value]));
      const values = months.map(month => ({port, code:source[0].code, month, value:map.has(month) ? map.get(month) : null}));
      return {port, values, complete:values.every(r => r.value !== null), total:values.reduce((s,r) => s + (r.value ?? 0), 0)};
    });
  }
  function cell(value) {
    let text = String(value ?? '');
    if (/^[\s]*[=+\-@\t\r]/.test(text)) text = "'" + text;
    return '"' + text.replaceAll('"', '""') + '"';
  }
  function csv(series, data) {
    const header = ['port','port_code','month','measure','direction','count','status','source_url','retrieved_on'];
    return '\uFEFF' + [header, ...series.flatMap(s => s.values.map(r => [r.port,r.code,r.month,'Trucks',data.direction,r.value,r.value === null ? 'Missing' : 'Reported',data.source,data.retrieved]))].map(row => row.map(cell).join(',')).join('\r\n') + '\r\n';
  }
  const api = {monthsBetween, selection, cell, csv};
  if (typeof module !== 'undefined') module.exports = api;
  else root.BorderStory = api;
})(typeof window === 'undefined' ? globalThis : window);
