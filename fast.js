import dayjs from "dayjs";
import moment from "moment";

const main = () => {
  console.log(moment().add(45, "days").get("day"));
};

main();
