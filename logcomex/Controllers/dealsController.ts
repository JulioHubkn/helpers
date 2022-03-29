import { fecthItems } from "../utils/fetchHubSpotItems.js";
const API_KEY = `7c0ad816-bcb9-4a6e-8644-763e12e17a15`;
import { ICommonDeal } from "../interfaces/ICommon.js";
import moment from "moment";
import { writeFileSync } from "fs";

const fetchDeals = () => {
  fecthItems(API_KEY, `deals/v1/deal/paged?`, "deals");
};

type ClassificacaoItems = {
  [key: string]: {
    total: number;
    totalValue: number;
    won: number;
    lost: number;
    value: number;
  };
};

type RamoDeAtuacaoItems = {
  [key: string]: {
    count: number;
    wonPerc: number;
    countWon: number;
  };
};

type EtapaDoClienteItems = {
  [key: string]: {
    total: number;
    totalValue: number;
    won: number;
    lost: number;
    value: number;
  };
};

type UnidadesDeDesembaracoItems = {
  [key: string]: {
    total: number;
    totalValue: number;
    won: number;
    lost: number;
    value: number;
  };
};

type ModalItems = {
  [key: string]: {
    total: number;
    totalValue: number;
    won: number;
    lost: number;
    value: number;
  };
};

type Collection = {
  classificacao: {
    general: ClassificacaoItems;
    byPipeline: {
      [key: string]: ClassificacaoItems;
    };
  };
  ramoDeAtuacao: { general: RamoDeAtuacaoItems };
  etapa_do_cliente: {
    general: EtapaDoClienteItems;
    byPipeline: {
      [key: string]: EtapaDoClienteItems;
    };
  };
  unidade_de_desembaraco_mais_utilizada: {
    general: UnidadesDeDesembaracoItems;
    byPipeline: {
      [key: string]: UnidadesDeDesembaracoItems;
    };
  };

  modal: {
    general: UnidadesDeDesembaracoItems;
    byPipeline: {
      [key: string]: UnidadesDeDesembaracoItems;
    };
  };
};

const filterDeals = (deals: ICommonDeal[], status: string) => {
  let auxObj: Collection = {
    classificacao: { general: {}, byPipeline: {} },
    ramoDeAtuacao: { general: {} },
    etapa_do_cliente: { general: {}, byPipeline: {} },
    unidade_de_desembaraco_mais_utilizada: { general: {}, byPipeline: {} },
    modal: { general: {}, byPipeline: {} },
  };
  let etapasDoCliente: any = [];

  for (let e of deals) {
    if (e.properties.classificacao) {
      if (auxObj.classificacao.general[e.properties.classificacao.value]) {
        auxObj.classificacao.general[e.properties.classificacao.value].total++;
        if (
          +e.properties.hs_closed_amount_in_home_currency.timestamp >=
          +moment().startOf("month").valueOf()
        )
          auxObj.classificacao.general[
            e.properties.classificacao.value
          ].totalValue += +e.properties.hs_closed_amount_in_home_currency.value;
      } else {
        auxObj.classificacao.general[e.properties.classificacao.value] = {
          total: 1,
          totalValue: 0,
          won: 0,
          lost: 0,
          value: 0,
        };
      }

      e.properties.hs_is_closed_won.value === "true"
        ? auxObj.classificacao.general[e.properties.classificacao.value].won++
        : auxObj.classificacao.general[e.properties.classificacao.value].lost++;

      if (e.properties.pipeline) {
        if (!auxObj.classificacao.byPipeline[e.properties.pipeline.value]) {
          auxObj.classificacao.byPipeline[e.properties.pipeline.value] = {};
        }
        if (
          auxObj.classificacao.byPipeline[e.properties.pipeline.value][
            e.properties.classificacao.value
          ]
        ) {
          auxObj.classificacao.byPipeline[e.properties.pipeline.value][
            e.properties.classificacao.value
          ].total++;
        } else {
          auxObj.classificacao.byPipeline[e.properties.pipeline.value][
            e.properties.classificacao.value
          ] = {
            total: 1,
            totalValue: 0,
            won: 0,
            lost: 0,
            value: 0,
          };
        }

        e.properties.hs_is_closed_won.value === "true"
          ? auxObj.classificacao.byPipeline[e.properties.pipeline.value][
              e.properties.classificacao.value
            ].won++
          : auxObj.classificacao.byPipeline[e.properties.pipeline.value][
              e.properties.classificacao.value
            ].lost++;
      }
    }

    if (e.properties.ramo_de_atuacao__do_negocio_) {
      if (
        auxObj.ramoDeAtuacao.general[
          e.properties.ramo_de_atuacao__do_negocio_.value
        ]
      ) {
        auxObj.ramoDeAtuacao.general[
          e.properties.ramo_de_atuacao__do_negocio_.value
        ].count++;
        if (e.properties.hs_is_closed_won.value === "true")
          auxObj.ramoDeAtuacao.general[
            e.properties.ramo_de_atuacao__do_negocio_.value
          ].countWon++;
      } else {
        auxObj.ramoDeAtuacao.general[
          e.properties.ramo_de_atuacao__do_negocio_.value
        ] = {
          count: 1,
          countWon: 0,
          wonPerc: 0,
        };
        if (e.properties.hs_is_closed_won.value === "true")
          auxObj.ramoDeAtuacao.general[
            e.properties.ramo_de_atuacao__do_negocio_.value
          ].countWon++;
      }
      auxObj.ramoDeAtuacao.general[
        e.properties.ramo_de_atuacao__do_negocio_.value
      ].wonPerc =
        (100 *
          auxObj.ramoDeAtuacao.general[
            e.properties.ramo_de_atuacao__do_negocio_.value
          ].countWon) /
        auxObj.ramoDeAtuacao.general[
          e.properties.ramo_de_atuacao__do_negocio_.value
        ].count;
    }

    if (e.properties.etapa_do_cliente) {
      if (
        auxObj.etapa_do_cliente.general[e.properties.etapa_do_cliente.value]
      ) {
        auxObj.etapa_do_cliente.general[e.properties.etapa_do_cliente.value]
          .total++;
        if (e.properties.hs_closed_amount_in_home_currency) {
          if (
            +e.properties.hs_closed_amount_in_home_currency.timestamp >=
            +moment().startOf("month").valueOf()
          )
            auxObj.etapa_do_cliente.general[
              e.properties.etapa_do_cliente.value
            ].totalValue +=
              +e.properties.hs_closed_amount_in_home_currency.value;
        }
      } else {
        auxObj.etapa_do_cliente.general[e.properties.etapa_do_cliente.value] = {
          total: 1,
          totalValue: 0,
          won: 0,
          lost: 0,
          value: 0,
        };
      }

      e.properties.hs_is_closed_won.value === "true"
        ? auxObj.etapa_do_cliente.general[e.properties.etapa_do_cliente.value]
            .won++
        : auxObj.etapa_do_cliente.general[e.properties.etapa_do_cliente.value]
            .lost++;

      if (e.properties.pipeline) {
        if (!auxObj.etapa_do_cliente.byPipeline[e.properties.pipeline.value]) {
          auxObj.etapa_do_cliente.byPipeline[e.properties.pipeline.value] = {};
        }
        if (
          auxObj.etapa_do_cliente.byPipeline[e.properties.pipeline.value][
            e.properties.etapa_do_cliente.value
          ]
        ) {
          auxObj.etapa_do_cliente.byPipeline[e.properties.pipeline.value][
            e.properties.etapa_do_cliente.value
          ].total++;
        } else {
          auxObj.etapa_do_cliente.byPipeline[e.properties.pipeline.value][
            e.properties.etapa_do_cliente.value
          ] = {
            total: 1,
            totalValue: 0,
            won: 0,
            lost: 0,
            value: 0,
          };
        }

        e.properties.hs_is_closed_won.value === "true"
          ? auxObj.etapa_do_cliente.byPipeline[e.properties.pipeline.value][
              e.properties.etapa_do_cliente.value
            ].won++
          : auxObj.etapa_do_cliente.byPipeline[e.properties.pipeline.value][
              e.properties.etapa_do_cliente.value
            ].lost++;
      }
    }

    if (e.properties.unidade_de_desembaraco_mais_utilizada) {
      if (
        auxObj.unidade_de_desembaraco_mais_utilizada.general[
          e.properties.unidade_de_desembaraco_mais_utilizada.value
        ]
      ) {
        auxObj.unidade_de_desembaraco_mais_utilizada.general[
          e.properties.unidade_de_desembaraco_mais_utilizada.value
        ].total++;
        if (e.properties.hs_closed_amount_in_home_currency) {
          if (
            +e.properties.hs_closed_amount_in_home_currency.timestamp >=
            +moment().startOf("month").valueOf()
          )
            auxObj.unidade_de_desembaraco_mais_utilizada.general[
              e.properties.unidade_de_desembaraco_mais_utilizada.value
            ].totalValue +=
              +e.properties.hs_closed_amount_in_home_currency.value;
        }
      } else {
        auxObj.unidade_de_desembaraco_mais_utilizada.general[
          e.properties.unidade_de_desembaraco_mais_utilizada.value
        ] = {
          total: 1,
          totalValue: 0,
          won: 0,
          lost: 0,
          value: 0,
        };
      }

      e.properties.hs_is_closed_won.value === "true"
        ? auxObj.unidade_de_desembaraco_mais_utilizada.general[
            e.properties.unidade_de_desembaraco_mais_utilizada.value
          ].won++
        : auxObj.unidade_de_desembaraco_mais_utilizada.general[
            e.properties.unidade_de_desembaraco_mais_utilizada.value
          ].lost++;

      if (e.properties.pipeline) {
        if (
          !auxObj.unidade_de_desembaraco_mais_utilizada.byPipeline[
            e.properties.pipeline.value
          ]
        ) {
          auxObj.unidade_de_desembaraco_mais_utilizada.byPipeline[
            e.properties.pipeline.value
          ] = {};
        }
        if (
          auxObj.unidade_de_desembaraco_mais_utilizada.byPipeline[
            e.properties.pipeline.value
          ][e.properties.unidade_de_desembaraco_mais_utilizada.value]
        ) {
          auxObj.unidade_de_desembaraco_mais_utilizada.byPipeline[
            e.properties.pipeline.value
          ][e.properties.unidade_de_desembaraco_mais_utilizada.value].total++;
        } else {
          auxObj.unidade_de_desembaraco_mais_utilizada.byPipeline[
            e.properties.pipeline.value
          ][e.properties.unidade_de_desembaraco_mais_utilizada.value] = {
            total: 1,
            totalValue: 0,
            won: 0,
            lost: 0,
            value: 0,
          };
        }

        e.properties.hs_is_closed_won.value === "true"
          ? auxObj.unidade_de_desembaraco_mais_utilizada.byPipeline[
              e.properties.pipeline.value
            ][e.properties.unidade_de_desembaraco_mais_utilizada.value].won++
          : auxObj.unidade_de_desembaraco_mais_utilizada.byPipeline[
              e.properties.pipeline.value
            ][e.properties.unidade_de_desembaraco_mais_utilizada.value].lost++;
      }
    }

    if (e.properties.modal_mais_utilizado) {
      let modals = e.properties.modal_mais_utilizado.value.split(";");
      for (let item of modals) {
        if (auxObj.modal.general[item]) {
          auxObj.modal.general[item].total++;
          if (e.properties.hs_closed_amount_in_home_currency) {
            if (
              +e.properties.hs_closed_amount_in_home_currency.timestamp >=
              +moment().startOf("month").valueOf()
            ) {
              auxObj.modal.general[item].totalValue +=
                +e.properties.hs_closed_amount_in_home_currency.value;
            }
          }
        } else {
          auxObj.modal.general[item] = {
            total: 1,
            totalValue: 0,
            won: 0,
            lost: 0,
            value: 0,
          };
        }

        e.properties.hs_is_closed_won.value === "true"
          ? auxObj.modal.general[item].won++
          : auxObj.modal.general[item].lost++;

        if (e.properties.pipeline) {
          if (!auxObj.modal.byPipeline[e.properties.pipeline.value]) {
            auxObj.modal.byPipeline[e.properties.pipeline.value] = {};
          }
          if (auxObj.modal.byPipeline[e.properties.pipeline.value][item]) {
            auxObj.modal.byPipeline[e.properties.pipeline.value][item].total++;
          } else {
            auxObj.modal.byPipeline[e.properties.pipeline.value][item] = {
              total: 1,
              totalValue: 0,
              won: 0,
              lost: 0,
              value: 0,
            };
          }

          e.properties.hs_is_closed_won.value === "true"
            ? auxObj.modal.byPipeline[e.properties.pipeline.value][item].won++
            : auxObj.modal.byPipeline[e.properties.pipeline.value][item].lost++;
        }
      }
    }
  }
  console.log(etapasDoCliente);
  writeFileSync("./response.json", JSON.stringify(auxObj));
};

export { fetchDeals, filterDeals };
