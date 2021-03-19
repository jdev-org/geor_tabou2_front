export const TABS = [{
    id: 'search',
    tooltip: 'tabou2.tabs.search',
    glyph: 'search'
}, {
    id: 'add',
    tooltip: 'tabou2.tabs.add',
    glyph: 'plus'
}, {
    id: 'identify',
    tooltip: 'tabou2.tabs.identify',
    glyph: 'map-marker'
}];

export const CONTROL_NAME = 'tabou2';

export const API_BASE_URL = 'http://localhost:3000';

export const GEOSERVER_WFS_URL = 'https://public.sig.rennesmetropole.fr/geoserver';

export const COMMUNE_LAYER_ID = 'ladm_terri:commune_emprise';

export const ID_SELECTOR = 'layerTabouId-selector';

export const PANEL_SIZE = 500;

export const URL_TIERS = {
    "tabou2": "/",
    "tabou2:v_oa_programme": "/programmes/",
    "tabou2:oa_secteur": "/operations/"
};

export const SEARCH_ITEMS = [{
    name: 'communes',
    placeholder: 'Toutes communes',
    group: 1
}, {
    name: 'quartiers',
    placeholder: 'Tous quartiers',
    group: 1,
    parent: 'communes',
    cascadeField: 'codeInsee',
    parentField: 'codeInsee'
}, {
    name: 'iris',
    placeholder: 'Tous iris',
    group: 1,
    parent: 'communes',
    cascadeField: 'ccom',
    parentField: 'codeInsee'
}, {
    name: 'plui',
    disabled: true,
    placeholder: 'Tous zonage PLUI',
    group: 1
}, /* {
    name: 'types-financements',
    disabled: true,
    placeholder: 'Tous Financement',
    group: 1
}, */{
    name: "natures",
    placeholder: "Toutes natures",
    group: 2
}, {
    name: "secteurs-sam",
    placeholder: 'Tous secteurs SAM',
    type: 'string',
    group: 2
}, {
    name: "secteurs-speu",
    placeholder: 'Tous secteurs SPEU',
    type: 'string',
    group: 2
}, {
    name: "secteurs-sds",
    placeholder: 'Tous secteurs SDS',
    api: "secteurs-dds",
    type: 'string',
    group: 2
}, {
    name: "secteurs-foncier",
    placeholder: "Tous secteurs Foncier",
    type: 'string',
    group: 2
}, {
    name: "etapesoa",
    placeholder: "Toutes Etapes OA",
    api: "/operations/etapes",
    disabled: false,
    group: 2
}, {
    name: "etapespa",
    api: "/programmes/etapes",
    placeholder: "Toutes Etapes PA",
    disabled: false,
    group: 2
}];

export const SEARCH_CALENDARS = [{
    items: [{
        label: "Date DOC du :"
    },
    {
        label: "A la date du :"
    }]
}, {
    items: [{
        label: "Date DAACT du :"
    },
    {
        label: "A la date du :"
    }]
}, {
    items: [{
        label: "Date de livraison du :"
    },
    {
        label: "A la date du :"
    }]
}];

export const ACCORDIONS = [
    {title: 'Identification', id: 'ident'},
    {title: 'Descriptif', id: 'describe'},
    {title: 'Gouvernance', id: 'gouvernance'},
    {title: 'Suivi Opérationnel', id: 'suivi'},
    {title: 'Programmation Habitat', id: 'habitat'},
    {title: 'Programmation Activités', id: 'activite', layers: ['layerOA', 'layerSA']},
    {title: 'Instruction Droit des Sols', id: 'dds', layers: ['layerPA']},
    {title: 'Secteurs et programmes liés', id: 'secteursprog', layers: ['layerOA', 'layerSA']}
];

export const LAYER_FIELD_OPTION = [
    {
        name: "tabou2:v_oa_programme",
        field: "properties.nom",
        id: "properties.objectid"
    },
    {
        name: "tabou2:oa_secteur",
        field: "properties.secteur",
        id: "properties.objectid"
    },
    {
        name: "tabou2:zac",
        field: "properties.nomzac",
        id: "properties.id_zac"
    }
];

export const ACC_ATTRIBUTE_IDENT = [{
    name: 'ID_Tabou',
    api: '',
    type: 'number',
    fieldApi: 'id',
    layers: []
}, {
    name: 'code',
    api: '',
    type: 'string',
    fieldApi: 'code',
    layers: []
}, {
    name: 'commune',
    fieldApi: '',
    api: '',
    type: 'string',
    layers: []
}, {
    name: 'natures',
    api: '',
    fieldApi: 'libelle',
    type: 'string',
    layers: []
}, {
    name: 'nom',
    fieldApi: 'nom',
    placeholder: 'nom',
    api: '',
    type: 'string',
    layers: []
}, {
    name: 'estoff',
    fieldApi: 'diffusionRestreinte',
    placeholder: 'Est off',
    api: '',
    type: 'boolean',
    layers: []
}, {
    name: 'numads',
    placeholder: 'Num ADS',
    fieldApi: 'numAds',
    api: '',
    type: 'string',
    layers: []
}];

export const ACC_ATTRIBUTE_DESCRIBE = [{
    name: 'operation',
    placeholder: 'opération',
    api: '',
    fieldApi: 'operation',
    type: 'string',
    layers: []
}, {
    name: 'description',
    placeholder: 'Opération',
    fieldApi: 'description',
    api: '',
    type: 'string',
    layers: []
}, {
    name: 'conso-espace',
    api: '',
    fieldApi: 'libelle',
    type: 'combo',
    layers: ['layerOA', 'layerSA']
}, {
    name: 'vocation',
    api: '',
    type: 'combo',
    layers: ['layerOA', 'layerSA']
}, {
    name: 'surftotal',
    api: '',
    type: 'string',
    layers: ['layerOA', 'layerSA']
}];


export const TIERS_FORMS = [{
    field: "adresseCp",
    label: "Code postal",
    type: "text",
    required: true,
    pattern: "^[0-9]*$"
}, {
    field: "adresseNum",
    label: "Numéro",
    type: "text",
    required: false,
    pattern: "^[0-9]*$"
}, {
    field: "adresseRue",
    label: "Rue",
    type: "text",
    required: true,
    pattern: ""
}, {
    field: "adresseVille",
    label: "Ville",
    type: "text",
    required: true,
    pattern: ""
}, {
    name: "contact",
    label: "Contact",
    type: "text",
    required: true,
    pattern: ""
}, {
    field: "email",
    label: "Email",
    type: "email",
    required: true,
    pattern: ""
}, {
    field: "siteWeb",
    label: "Site web",
    type: "string",
    required: false,
    pattern: ""
}, {
    field: "telecopie",
    label: "Fax",
    type: "text",
    required: false,
    pattern: "^[0-9]*$"
}, {
    field: "telephone",
    label: "Téléphone",
    type: "text",
    required: true,
    pattern: "^[0-9]*$"
}];
