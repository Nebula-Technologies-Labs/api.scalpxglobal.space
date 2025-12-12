function formatSymbol(raw) {
  const regex = /^([A-Z]+)(\d{2})([A-Z]{3})(\d{2})(\d+)?(CE|PE|FUT)?$/;

  const match = raw.match(regex);
  if (!match) return raw;

  const [, name, _day, mon, _year, strike, type] = match;

  return [name, _day, mon, strike, type].filter(Boolean).join(" ");
}

function formatInstrumentArray(arr) {
  return arr.map((inst) => ({
    ...inst,
    symbol: formatSymbol(inst.symbol),
  }));
}

module.exports = {formatInstrumentArray };
