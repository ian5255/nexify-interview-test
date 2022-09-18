import moment from "moment";

export const Rfc3339ToDay = (date, format = "YYYY/MM/DD") => {
  if (!date) return "";
  if (`${date}`.includes("0001-01-01T")) return "";
  return moment(date).format(format);
};
// 日期 轉 rfc
export const DayToRfc3339 = (rfc) => {
  if (rfc === "") return ""; // "0001-01-01T00:00:00+08:00";
  return moment(rfc).format();
};
