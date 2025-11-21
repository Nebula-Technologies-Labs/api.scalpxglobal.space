function formatExpiry(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-GB", { month: "short" }).toUpperCase();
  const year = date.getFullYear();
  return `${day}${month}${year}`; // e.g. 28OCT2025
}

const getNextExpiries = () => {
  const today = new Date();

  const nextTuesday = new Date(today);

  const day = today.getDay();

  const diff = (9 - day) % 7 || 7;

  nextTuesday.setDate(today.getDate() + diff);

  const nextToNextTuesday = new Date(nextTuesday);
  nextToNextTuesday.setDate(nextTuesday.getDate() + 7);

  return {
    nextExpiry: formatExpiry(nextTuesday),
    nextToNextExpiry: formatExpiry(nextToNextTuesday),
  };
};

const getRecentExpiry = () => {
  const { nextExpiry, nextToNextExpiry } = getNextExpiries();
  const nextDate = new Date(
    `${nextExpiry.slice(0, 2)} ${nextExpiry.slice(2, 5)} ${nextExpiry.slice(5)}`
  );
  const today = new Date();
  return today <= nextDate ? nextExpiry : nextToNextExpiry;
};

module.exports = { getRecentExpiry };
