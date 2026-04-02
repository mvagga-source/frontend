
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


export function getWeekRange(weekStr) {
  const [year, week] = weekStr.split("-W").map(Number);

  // 1월 4일은 항상 ISO week 1에 포함됨
  const jan4 = new Date(year, 0, 4);

  // jan4가 속한 주의 월요일 찾기
  const day = jan4.getDay() || 7; // 일요일=7
  const monday = new Date(jan4);
  monday.setDate(jan4.getDate() - day + 1);

  // 선택한 주차만큼 이동
  const start = new Date(monday);
  start.setDate(monday.getDate() + (week - 1) * 7);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
}

export function getMonthRange(monthStr) {
  const [year, month] = monthStr.split("-").map(Number);

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0); // 마지막 날

  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
}

export function getYearRange(year) {
  return {
    startDate: `${year}-01-01`,
    endDate: `${year}-12-31`,
  };
}