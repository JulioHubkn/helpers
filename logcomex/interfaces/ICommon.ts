interface ICommonDeal {
  id: number;
  name: string;
  email: string;
  hasPic: boolean;
  picHash: string;
  activeFlag: boolean;

  properties: {
    quantitade_de_Embarque_por_ncm: number;
    canal_de_aquisicao: { value: "Inbound" | "Outbound" };
    modal_mais_utilizado: { value: string };
    unidade_de_desembaraco_mais_utilizada: { value: string };
    etapa_do_cliente: { value: string };
    ramo_de_atuacao__do_negocio_: { value: string };
    classificacao: { value: string };
    hs_is_closed_won: { value: string };
    hs_closed_amount_in_home_currency: {
      value: number;
      timestamp: number;
      versions: { value: number; timestamp: number }[];
    };
    pipeline: {
      value: string;
      versions: { value: number; timestamp: number }[];
    };
    dealstage: {
      value: string;
      versions: { value: number; timestamp: number }[];
    };
  };
}

export { ICommonDeal };
