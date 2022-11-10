const isExtreamTen = andate => {
  let result = '';
  if (andate < 10) {
    result = '0' + andate;
  } else {
    result = andate;
  }

  return result;
};

export const GetTime = () => {
  let today = new Date();

  let year = today.getFullYear(); // 년도
  let month = today.getMonth() + 1; // 월
  let date = today.getDate(); // 날짜
  // let hours = today.getHours(); // 시
  // let minutes = today.getMinutes(); // 분

  month = isExtreamTen(month);
  date = isExtreamTen(date);
  // hours = isExtreamTen(hours);
  // minutes = isExtreamTen(minutes);

  let NowDate = `${year}${month}${date}`;

  return NowDate;
};
