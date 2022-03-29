var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { readFileSync } from "fs";
import { investigateMonthlyPerformance } from "./functions/investigation.js";
import moment from "moment";
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // fetchDeals();
        // prettier-ignore
        const start = moment()
            .subtract(1, "year")
            .subtract(1, "month")
            .startOf("month")
            .startOf("day")
            .valueOf();
        const dealsJson = readFileSync("./all_deals.json").toString();
        const dealsArray = yield JSON.parse(dealsJson);
        console.log(`${dealsArray.length} Deals analisados`);
        const monthlyPerformance = investigateMonthlyPerformance(dealsArray, start, "6647613");
        // const filteredDeals = filterDeals(dealsArray, "won");
    });
}
main();
