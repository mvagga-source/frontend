
export const formatDate = (dateStr) => {

    const date = new Date(dateStr);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2,'0');
    const day = String(date.getDate()).padStart(2,'0');

    return `${year}-${month}-${day}`;
};

export const formatDateTime = (dateStr) => {

  const date = new Date(dateStr);

  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');

  return `${formatDate(dateStr)} ${hh}:${mm}`;
};