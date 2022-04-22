import React, { useState } from 'react';
import Message from "@mapstore/components/I18N/Message";
import { has, get, isEmpty, find, set } from "lodash";
import { Col, Row, FormControl, Grid, ControlLabel, Button, Panel } from "react-bootstrap";
import "@js/extension/css/vocation.css";
import { findValueByType, changeByType } from "./utils";
import FooterButtons from '../common/FooterButtons';


export default function AutreProgrammation({
    operation = {},
    owner = {},
    layer = "",
    update = () => {},
    close = () => {}
}) {
    if (isEmpty(operation)) return "Aucune Opération à afficher !";
    const [values, setValues] = useState(operation);

    const getFields = () => [
        {
            name: "equipement",
            label: "Programmation équipement",
            field: "description",
            type: "text",
            layers: [],
            source: () => findValueByType("Equipement", values, "informationsProgrammation"),
            change: (value) => setValues(changeByType("Equipement", value, values, "informationsProgrammation")),
            code: "Equipement",
            readOnly: false
        },
        {
            name: "programmationAutre",
            label: "Programmation autre",
            field: "description",
            type: "text",
            layers: [],
            source: () => findValueByType("Autres", values, "informationsProgrammation"),
            change: (value) => setValues(changeByType("Autres", value, values, "informationsProgrammation")),
            code: "Autres",
            readOnly: false
        }
    ];

    const allowChange = owner.isContrib || owner.isReferent;
    return (
        <Panel
            className="contribPaddOap-style"
            footer={<FooterButtons save={() => update(values)} close={close} reset={() => setValues(operation)} />}
        >
            <Row className="attributeInfos">
                <h4 style={{ marginBottom: "25px" }}>
                    <strong>Autre programmation</strong>
                </h4>
                {
                    getFields().filter(f => isEmpty(f.layers) || f?.layers.indexOf(layer) > -1).map((item, i) => (
                        <Row key={`${item.name}-${i}`}>
                            <Col xs={4}>
                                {/* <ControlLabel><Message msgId={item.label}/></ControlLabel> */}
                                {item.label}
                            </Col>
                            <Col xs={4}>
                                {
                                    ["text", "number"].includes(item.type) ?
                                        (<FormControl
                                            componentClass={item.isArea ? "textarea" : "input"}
                                            placeholder={item.label}
                                            style={{height: item.isArea ? "100px" : "auto"}}
                                            type={item.type}
                                            min="0"
                                            step={item?.step}
                                            value={get(item.source(), item.field) || ""}
                                            readOnly={item.readOnly || !allowChange}
                                            onChange={(v) => {
                                                return item.change(item.type === "number" && v.target.value < 0 ? "" : v.target.value);
                                            }}
                                            onKeyDown={(v) => {
                                                if (item.type !== "number") return;
                                                // only keep numeric and special key control as "Delete" or "Backspace"
                                                if (!new RegExp('^[0-9\.\,]').test(v.key) && v.key.length < 2) {
                                                    v.returnValue = false;
                                                    if (v.preventDefault) v.preventDefault();
                                                }
                                            }}
                                        />) : ""
                                }
                            </Col>
                        </Row>
                    ))
                }
            </Row>
        </Panel>
    );
}
