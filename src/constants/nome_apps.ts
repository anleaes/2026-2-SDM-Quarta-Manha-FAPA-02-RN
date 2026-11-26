
//Estilização constantes para os botoes da HomeScreen dos apps

import { DrawerParamList } from "@/navigation/DrawNavigator"

type AppItems = {
    id: string,
    label: string,
    color: string,
    route?: keyof DrawerParamList
}

export const NOME_APPS: AppItems[] = [
    {id: 'sede', label: 'Sedes', color: 'rgb(133, 248, 110)'},
    {id: 'funcionario', label: 'Funcionarios', color: 'rgb(103, 236, 185)'},
    {id: 'espectador', label: 'Espectadores', color: 'rgb(221, 169, 58)'},
    {id: 'beneficio', label: 'Beneficios', color: 'rgb(137, 87, 202)'},
    {id: 'assinatura', label: 'Assinaturas', color: 'rgb(207, 67, 67)'},
    {id: 'venda', label: 'Vendas', color: 'rgb(199, 216, 50)'},
    {id: 'ingresso', label: 'Ingressos', color: 'rgb(67, 88, 207)'},
    {id: 'evento', label: 'Eventos', color: 'rgb(2, 109, 25)', route: 'Evento'},
    {id: 'divulgacao_evento', label: 'Divulgacões de Evento', color: 'rgb(145, 145, 145)'},
    {id: 'cupom', label: 'Cupons', color: 'rgb(122, 33, 240)'},
    {id: 'cartao_vip', label: 'Cartões VIP', color: 'rgb(221, 42, 42)'}
]






