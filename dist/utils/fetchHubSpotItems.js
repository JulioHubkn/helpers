var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from "axios";
import * as fs from "fs";
const BASE_URL = `https://api.hubapi.com/`;
const fecthItems = (API_KEY, urlComplement, item) => __awaiter(void 0, void 0, void 0, function* () {
    const FILE_PATH = `./all_${item}.json`;
    let url = BASE_URL + urlComplement + `hapikey=${API_KEY}&limit=250`;
    let itemCollection = [];
    let next = true;
    let i = 0;
    let total = 0;
    let offset = null;
    let properties = [
        // "quantitade_de_Embarque_por_ncm",
        "canal_de_aquisicao",
        "dealstage",
        "hubspot_owner_id",
        // "modal_mais_utilizado",
        // "unidade_de_desembaraco_mais_utilizada",
        // "etapa_do_cliente",
        // "ramo_de_atuacao__do_negocio_",
        // "classificacao",
        // "hs_is_closed_won",
        // "hs_is_closed",
        "hs_closed_amount_in_home_currency",
        "pipeline",
    ];
    fs.writeFileSync(FILE_PATH, "[");
    for (let e of properties) {
        // url += "&properties=" + e;
        url += "&propertiesWithHistory=" + e;
    }
    let callUrl = url;
    do {
        if (offset) {
            callUrl = `${url}&offset=${offset}`;
        }
        const items = yield axios.get(callUrl);
        if (items.data.deals) {
            total = items.data.total;
            for (let e of items.data.deals) {
                // if (e.properties.hs_is_closed) {
                //   if (e.properties.hs_is_closed.value === "true") {
                //     itemCollection.push(e);
                fs.writeFileSync(FILE_PATH, JSON.stringify(e) + ",", {
                    flag: "a",
                });
                // }
                // }
            }
        }
        if (items.data.hasMore === false) {
            console.log("Finalizando...");
            next = false;
        }
        else {
            offset = items.data.offset;
            console.log(`Buscando > ${offset}`);
        }
    } while (next);
    fs.writeFileSync(FILE_PATH, "]", { flag: "a" });
});
export { fecthItems };
