import React, {useEffect, useState } from "react";
import { isEmpty, isEqual, pick, get, has } from "lodash";
import { Col, Row, FormControl, Grid, ControlLabel } from "react-bootstrap";
import { Multiselect } from "react-widgets";
import { getRequestApi } from "@js/extension/api/requests";
import "@js/extension/css/identify.css";
import Message from "@mapstore/components/I18N/Message";
import SearchCombo from '@js/extension/components/form/SearchCombo';
import Tabou2Combo from '@js/extension/components/form/Tabou2Combo';
/**
 * Accordion to display info for Identity panel section - only for feature linked with id tabou
 * @param {any} param
 * @returns component
 */
export default function Tabou2IdentAccord({ initialItem, programme, operation, mapFeature, ...props }) {
    let layer = props?.selection?.layer;

    const [values, setValues] = useState({});
    const [fields, setFields] = useState([]);
    const [required, setRequired] = useState({});
    let changeInfos = () => {};

    // create fields from const func
    const getFields = () => [{
        name: "id",
        type: "text",
        label: "tabou2.identify.accordions.idTabou",
        field: "id",
        source: initialItem,
        readOnly: true
    }, {
        name: "code",
        label: "tabou2.identify.accordions.code",
        type: "text",
        field: "code",
        source: values,
        readOnly: false,
        require: true
    },
    {
        name: "entiteReferente",
        field: "entiteReferente.libelle",
        label: "tabou2.identify.accordions.entiteRefLib",
        layers: ["layerSA", "layerOA"],
        type: "combo",
        autocomplete: false,
        api: `entites-referentes`,
        apiLabel: "libelle",
        placeholder: "tabou2.identify.accordions.emptySelect",
        source: operation,
        readOnly: false,
        value: () => get(values, "entiteReferente"),
        select: (v) => changeInfos({entiteReferente: v}),
        change: (v) => changeInfos(v ? {entiteReferente: v} : {entiteReferente: null})
    }, {
        name: "referents",
        field: "referents",
        label: "tabou2.identify.accordions.referents",
        type: "multi",
        layers: ["layerOA", "layerSA"],
        readOnly: true,
        source: {referents: props.tiers.filter(t => t.typeTiers.id === 3).map(t => t.tiers.nom).join(",")}
    }, {
        name: "commune",
        field: "properties.commune",
        label: "tabou2.identify.accordions.city",
        type: "multi",
        source: mapFeature,
        readOnly: true
    }, {
        name: "nature",
        label: "tabou2.identify.accordions.nature",
        field: "nature.libelle",
        type: "text",
        source: operation,
        readOnly: true,
        require: true

    }, {
        layers: ["layerPA"],
        name: "operationId",
        label: "tabou2.identify.accordions.operation",
        field: "operationId",
        value: () => has(values, "operationName") ? values.operationName : operation.nom,
        select: (v) => changeInfos({operationId: v?.id || "", operationName: v?.nom || v}),
        change: (v) => changeInfos({operationId: v?.id || "", operationName: v?.nom || v}),
        type: "combo",
        autocomplete: true,
        apiLabel: "nom",
        api: "operations?estSecteur=false&asc=true",
        source: operation,
        readOnly: false
    }, {
        name: "nom",
        field: "nom",
        label: "tabou2.identify.accordions.name",
        type: "text",
        source: values,
        readOnly: false,
        require: true
    }, {
        name: "consommationEspace",
        field: "consommationEspace.libelle",
        label: "tabou2.identify.accordions.consoSpace",
        layers: ["layerSA", "layerOA"],
        type: "combo",
        autocomplete: false,
        api: `consommation-espace?asc=true`,
        apiLabel: "libelle",
        placeholder: "tabou2.identify.accordions.emptySelect",
        source: operation,
        readOnly: false,
        value: () => get(values, "consommationEspace"),
        select: (v) => changeInfos({consommationEspace: v}),
        change: (v) => changeInfos(v ? {consommationEspace: v} : {consommationEspace: null})
    }, {
        name: "etape",
        layers: ["layerSA", "layerOA"],
        label: "tabou2.identify.accordions.step",
        field: "etape.libelle",
        type: "combo",
        apiLabel: "libelle",
        filter: false,
        api: `operations/${initialItem.id}/etapes?orderBy=id&asc=true`,
        source: operation,
        readOnly: false,
        require: true,
        value: () => get(values, "etape"),
        select: (v) => changeInfos({etape: v}),
        change: (v) => changeInfos(v ? {etape: v} : {etape: null})
    },    {
        name: "numAds",
        label: "tabou2.identify.accordions.numAds",
        field: "numAds",
        type: "text",
        source: values,
        readOnly: false
    }];

    const allowChange = props.authent.isContrib || props.authent.isReferent;

    // hooks
    useEffect(() => {
        const calculFields = getFields();
        const mandatoryFields = calculFields.filter(f => f.require).map(f => f.name);
        if (!isEqual(initialItem, values)) {
            setValues(initialItem);
            setFields(calculFields);
            setRequired(mandatoryFields);
        }
    }, [initialItem]);

    // get value for specific item
    const getValue = (item) => {
        if (isEmpty(values) || isEmpty(operation)) return null;
        let itemSrc = getFields().filter(f => f.name === item.name)[0]?.source;
        return get(itemSrc, item?.field) || [];
    };

    // manage change info
    changeInfos = (item) => {
        let newValues = {...values, ...item};
        setValues(newValues);
        // send to parent to save
        let accordValues = pick(newValues, getFields().filter(f => !f.readOnly).map(f => f.name));
        props.change(accordValues, pick(accordValues, required));
    };

    return (
        <Grid style={{ width: "100%" }}>
            {
                fields.filter(f => isEmpty(f.layers) || f?.layers.indexOf(layer) > -1).map(item => (
                    <Row className="attributeInfos">
                        {
                            item.type === "title" ? (
                                <Col xs={12}>
                                    <ControlLabel><Message msgId={item.label}/></ControlLabel>
                                </Col>
                            ) : (<>
                                <Col xs={4}>
                                    <ControlLabel><Message msgId={item.label}/></ControlLabel>
                                </Col>
                                <Col xs={8}>
                                    {
                                        item.type === "combo" && item?.autocomplete ? (
                                            <SearchCombo
                                                minLength={3}
                                                textField={item.apiLabel}
                                                valueField={item.apiField}
                                                forceSelection
                                                value={item.value()}
                                                search={
                                                    text => getRequestApi(item.api, props.pluginCfg.apiCfg, {[item.autocomplete]: `${text}*`})
                                                        .then(results =>
                                                            results.elements.map(v => v)
                                                        )
                                                }
                                                onSelect={item.select}
                                                onChange={item.change}
                                                name={item.name}
                                                placeholder={props.i18n(props.messages, item?.label || "")}
                                            />
                                        ) : null
                                    }
                                    {
                                        item.type === "text" ?
                                            (<FormControl
                                                placeholder={props.i18n(props.messages, item?.label || "")}
                                                value={getValue(item) || ""}
                                                readOnly={item.readOnly || !allowChange}
                                                onChange={(v) => changeInfos({[item.name]: v.target.value})}
                                            />) : null
                                    }{
                                        item.type === "multi" && has(item.source, item.field) ? (
                                            <Multiselect
                                                style={{ color: "black !important" }}
                                                placeholder={props.i18n(props.messages, item?.label || "")}
                                                value={getValue(item).length ? getValue(item).split(";") : [] }
                                                readOnly={item.readOnly || !allowChange}
                                                onChange={() => null}
                                                messages={{
                                                    emptyList: item.readOnly ? "tabou2.identify.accordions.notAvailable" : "tabou2.emptyList",
                                                    openCombobox: "tabou2.displayList"
                                                }}
                                                className={ item.readOnly ? "tagColor noClick" : "tagColor"}
                                            />
                                        ) : null
                                    }{
                                        item.type === "combo" && !item?.autocomplete ? (
                                            <Tabou2Combo
                                                load={() => getRequestApi(item.api, props.pluginCfg.apiCfg, {})}
                                                placeholder={props.i18n(props.messages, item?.placeholder || "")}
                                                filter="contains"
                                                disabled={item.readOnly || !allowChange}
                                                textField={item.apiLabel}
                                                onLoad={(r) => r?.elements || r}
                                                name={item.name}
                                                value={get(values, item.field)}
                                                onSelect={(v) => changeInfos({[item.name]: v})}
                                                onChange={(v) => !v ? changeInfos({[item.name]: v}) : null}
                                                messages={{
                                                    emptyList: props.i18n(props.messages, "tabou2.emptyList"),
                                                    openCombobox: props.i18n(props.messages, "tabou2.displayList")
                                                }}
                                            />
                                        ) : null
                                    }
                                </Col></>
                            )
                        }

                    </Row>
                ))
            }
        </Grid>
    );
}
