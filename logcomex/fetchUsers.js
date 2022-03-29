import fetch from "node-fetch";
import { fstat, writeFileSync } from "fs";
import { isDeepStrictEqual } from "util";

const main = async () => {
  let cont = true;
  const API_KEY = `hapikey=fc7f5f74-80db-4e99-b3ce-5a4444851478`;
  let url = `https://api.hubapi.com/crm/v3/owners?${API_KEY}`;
  let sdrs = {};
  do {
    let users = await fetch(url);
    users = await users.json();
    if (users.results) {
      users.results.map((e) => {
        let sdr = false;
        if (e.teams) {
          for (let item of e.teams) {
            // if (item.name.includes("SDR")) {
            if (item.id === `239124`) {
              sdr = true;
            }
          }
        }
        if (sdr) {
          sdrs = Object.assign(sdrs, {
            [`${e.id}`]: {
              id: e.id,
              group: "SDR",
            },
          });
        }
      });
    }
    if (users.paging) {
      if (users.paging.next) {
        url = users.paging.next.link + "&" + API_KEY;
        cont = true;
      } else {
        cont = false;
      }
    } else {
      cont = false;
    }
  } while (cont === true);
  writeFileSync("./sdrs.json", JSON.stringify(sdrs));
};
main();
