import { fetchDeals, filterDeals } from "./Controllers/dealsController.js";
import { readFileSync } from "fs";
import { investigateMonthlyPerformance } from "./functions/investigation.js";
import moment from "moment";

async function main() {
  // fetchDeals();
  // prettier-ignore
  const start = moment()
  .subtract(1, "year")
  .subtract(1,"month")
  .startOf("month")
  .startOf("day")
  .valueOf();
  const dealsJson = readFileSync("./all_deals.json").toString();
  const dealsArray = await JSON.parse(dealsJson);
  console.log(`${dealsArray.length} Deals analisados`);
  const monthlyPerformance = investigateMonthlyPerformance(
    dealsArray,
    start,
    "6647613"
  );
  // const filteredDeals = filterDeals(dealsArray, "won");
}

main();
