var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import moment from "moment";
import { inBetween } from "../utils/utils.js";
const investigateMonthlyPerformance = (deals, startTimestamp, pipeline) => __awaiter(void 0, void 0, void 0, function* () {
    let endTimestamp = moment(startTimestamp)
        .endOf("month")
        .endOf("day")
        .valueOf();
    //  ---------------------------------------------------------------------------------------------
    let dealsInTheMonth = yield filterDealsArray(deals, startTimestamp, endTimestamp, pipeline, "6647614");
    console.log(`N° de deals > ${dealsInTheMonth.length}`);
    //  ---------------------------------------------------------------------------------------------
    let closedValue = yield closedDealsTotalValue(dealsInTheMonth, startTimestamp, endTimestamp);
    console.log(`Valor fechado em ${moment(startTimestamp).format("MM-YYYY")} > ${closedValue}`);
    //  ---------------------------------------------------------------------------------------------
    let lostDealsCount = yield lostDealsFilter(deals, "6647644", "6647614", "7417228", startTimestamp, endTimestamp);
    console.log(`${lostDealsCount} negócios perdidos no mesmo mês`);
});
const filterDealsArray = (deals, startTimestamp, endTimestamp, pipe, prospectStageId) => __awaiter(void 0, void 0, void 0, function* () {
    let countProspectsLast2Months = 0;
    let countProspects = 0;
    let dealsInTheMonth = deals.filter((e) => {
        const { hs_closed_amount_in_home_currency, pipeline, dealstage } = e.properties;
        let closedInPeriod = false;
        let pipelineInPeriod = false;
        if (hs_closed_amount_in_home_currency) {
            for (let item of hs_closed_amount_in_home_currency.versions) {
                if (item.timestamp >= startTimestamp &&
                    item.timestamp <= endTimestamp) {
                    closedInPeriod = true;
                }
            }
        }
        if (pipeline) {
            if (dealstage) {
                for (let item of dealstage.versions) {
                    if (inBetween(moment(endTimestamp)
                        .subtract(1, "month")
                        .endOf("month")
                        .valueOf(), moment(startTimestamp)
                        .subtract(2, "months")
                        .startOf("month")
                        .valueOf(), item.timestamp) &&
                        +item.value === +prospectStageId &&
                        +pipeline.value === +pipe) {
                        countProspectsLast2Months++;
                        break;
                    }
                    if (inBetween(endTimestamp, startTimestamp, item.timestamp) &&
                        +item.value === +prospectStageId &&
                        +pipeline.value === +pipe) {
                        countProspects++;
                        break;
                    }
                }
            }
            for (let item of pipeline.versions) {
                if (item.timestamp <= endTimestamp && +item.value === +pipe) {
                    pipelineInPeriod = true;
                }
            }
        }
        if (closedInPeriod && pipelineInPeriod) {
            return true;
        }
    });
    //  e.properties.pipeline.value === pipeline
    console.log(`Prospects gerados 2 nos meses anteriores > ${countProspectsLast2Months}`);
    console.log(`Prospects gerados nos mes > ${countProspects}`);
    return dealsInTheMonth;
});
const closedDealsTotalValue = (deals, startTimestamp, endTimestamp) => __awaiter(void 0, void 0, void 0, function* () {
    let totalClosedValue = 0;
    let closed = false;
    let closedCount = 0;
    for (let e of deals) {
        const { hs_closed_amount_in_home_currency } = e.properties;
        let closedValue = 0;
        if (hs_closed_amount_in_home_currency) {
            for (let item of hs_closed_amount_in_home_currency.versions) {
                if (item.timestamp <= endTimestamp &&
                    item.timestamp >= startTimestamp &&
                    +item.value > 0) {
                    closedValue = +item.value;
                }
            }
        }
        if (closedValue > 0) {
            closedCount++;
        }
        totalClosedValue += closedValue;
    }
    let avgTicket = (totalClosedValue / closedCount).toFixed(2);
    console.log(`Ticket Médio > ${avgTicket}`);
    return totalClosedValue;
});
const lostDealsFilter = (deals, lostStageId, prospectStageId, meetingStageId, startTimestamp, endTimestamp) => __awaiter(void 0, void 0, void 0, function* () {
    let lostDeals = deals.filter((e) => {
        const { dealstage } = e.properties;
        let lostInPeriod = false;
        if (dealstage) {
            for (let item of dealstage.versions) {
                if (inBetween(endTimestamp, startTimestamp, item.timestamp) &&
                    +item.value === +lostStageId) {
                    return true;
                }
            }
        }
    });
    let daysFromProspect = {
        general: 0,
        Inbound: 0,
        Outbound: 0,
    };
    let daysFromMeeting = {
        general: 0,
        Inbound: 0,
        Outbound: 0,
    };
    let countFromProspect = {
        general: 0,
        Inbound: 0,
        Outbound: 0,
    };
    let countFromMeeting = {
        general: 0,
        Inbound: 0,
        Outbound: 0,
    };
    let countProspects = {
        general: 0,
        Inbound: 0,
        Outbound: 0,
    };
    let daysToLost = 0;
    lostDeals.map((d) => {
        const { dealstage, canal_de_aquisicao } = d.properties;
        let prospectDate = 0;
        let meetingDate = 0;
        let lostDate = 0;
        for (let item of dealstage.versions) {
            if (inBetween(endTimestamp, startTimestamp, item.timestamp) &&
                +item.value === +lostStageId) {
                lostDate = item.timestamp;
            }
            if (inBetween(endTimestamp, startTimestamp, item.timestamp) &&
                +item.value === +prospectStageId) {
                countProspects.general++;
                if (canal_de_aquisicao) {
                    // @ts-ignore
                    countProspects[`${canal_de_aquisicao.value}`]
                        ? countProspects[`${canal_de_aquisicao.value}`]++
                        : (countProspects[`${canal_de_aquisicao.value}`] = 1);
                }
            }
        }
        for (let item of dealstage.versions) {
            if (+item.value === +prospectStageId &&
                item.timestamp < lostDate &&
                prospectDate === 0) {
                prospectDate = item.timestamp;
                countFromProspect.general
                    ? countFromProspect.general++
                    : (countFromProspect.general = 1);
                if (canal_de_aquisicao) {
                    if (canal_de_aquisicao.value === "Inbound") {
                        countFromProspect.Inbound
                            ? countFromProspect.Inbound++
                            : (countFromProspect.Inbound = 1);
                    }
                    if (canal_de_aquisicao.value === "Inbound") {
                        countFromProspect.Outbound
                            ? countFromProspect.Outbound++
                            : (countFromProspect.Outbound = 1);
                    }
                }
            }
            if (+item.value === +meetingStageId &&
                item.timestamp < lostDate &&
                meetingDate === 0) {
                meetingDate = item.timestamp;
                countFromMeeting.general
                    ? countFromMeeting.general++
                    : (countFromMeeting.general = 1);
                if (canal_de_aquisicao) {
                    if (canal_de_aquisicao.value === "Inbound") {
                        countFromMeeting.Inbound
                            ? countFromMeeting.Inbound++
                            : (countFromMeeting.Inbound = 1);
                    }
                    if (canal_de_aquisicao.value === "Inbound") {
                        countFromMeeting.Outbound
                            ? countFromMeeting.Outbound++
                            : (countFromMeeting.Outbound = 1);
                    }
                }
            }
        }
        if (+prospectDate > 0) {
            daysFromProspect.general
                ? (daysFromProspect.general += moment(lostDate).diff(prospectDate, "days"))
                : (daysFromProspect.general = moment(lostDate).diff(prospectDate, "days"));
            if (canal_de_aquisicao) {
                if (canal_de_aquisicao.value === "Inbound") {
                    daysFromProspect.Inbound
                        ? (daysFromProspect.Inbound += moment(lostDate).diff(prospectDate, "days"))
                        : (daysFromProspect.Inbound = moment(lostDate).diff(prospectDate, "days"));
                }
                if (canal_de_aquisicao.value === "Outbound") {
                    daysFromProspect.Outbound
                        ? (daysFromProspect.Outbound += moment(lostDate).diff(prospectDate, "days"))
                        : (daysFromProspect.Outbound = moment(lostDate).diff(prospectDate, "days"));
                }
            }
        }
        if (+meetingDate > 0) {
            daysFromMeeting.general
                ? (daysFromMeeting.general += moment(lostDate).diff(meetingDate, "days"))
                : (daysFromMeeting.general = moment(lostDate).diff(meetingDate, "days"));
            if (canal_de_aquisicao) {
                if (canal_de_aquisicao.value === "Inbound") {
                    daysFromMeeting.Inbound
                        ? (daysFromMeeting.Inbound += moment(lostDate).diff(meetingDate, "days"))
                        : (daysFromMeeting.Inbound = moment(lostDate).diff(meetingDate, "days"));
                }
                if (canal_de_aquisicao.value === "Outbound") {
                    daysFromMeeting.Outbound
                        ? (daysFromMeeting.Outbound += moment(lostDate).diff(meetingDate, "days"))
                        : (daysFromMeeting.Outbound = moment(lostDate).diff(meetingDate, "days"));
                }
            }
        }
    }, 0);
    let avgFromProspect = {
        general: countFromProspect.general > 0
            ? (daysFromProspect.general / countFromProspect.general).toFixed(2)
            : 0,
        Inbound: countFromProspect.Inbound > 0
            ? (daysFromProspect.Inbound / countFromProspect.Inbound).toFixed(2)
            : 0,
        Outbound: countFromProspect.Outbound > 0
            ? (daysFromProspect.Outbound / countFromProspect.Outbound).toFixed(2)
            : 0,
    };
    let avgFromMeeting = {
        general: countFromMeeting.general > 0
            ? (daysFromMeeting.general / countFromMeeting.general).toFixed(2)
            : 0,
        Inbound: countFromMeeting.Inbound > 0
            ? (daysFromMeeting.Inbound / countFromMeeting.Inbound).toFixed(2)
            : 0,
        Outbound: countFromMeeting.Outbound > 0
            ? (daysFromMeeting.Outbound / countFromMeeting.Outbound).toFixed(2)
            : 0,
    };
    console.log(`Média de dias entre prospect e lost > ${JSON.stringify(avgFromProspect)}`);
    console.log(`Média de dias entre agendamento e lost > ${JSON.stringify(avgFromMeeting)}`);
    return lostDeals.length;
});
export { investigateMonthlyPerformance };
