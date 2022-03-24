import React, {useState, useEffect} from "react";
import { Col, FormGroup, Row, FormControl, ControlLabel, Glyphicon} from "react-bootstrap";
import Toolbar from '@mapstore/components/misc/toolbar/Toolbar';
import "../../css/tabou.css";
import { has, get, set, isEmpty } from "lodash";
import Message from "@mapstore/components/I18N/Message";
import Dropzone from 'react-dropzone';
import SearchCombo from '@js/extension/components/form/SearchCombo';
import { searchDocumentsTypes } from "../../api/requests";
import { DateTimePicker } from "react-widgets";
import moment from 'moment';
import momentLocalizer from 'react-widgets/lib/localizers/moment';
momentLocalizer(moment);
/**
 * Form to display when a tier is edit or created.
 * @param {any} param
 * @returns component
 */
export default function Tabou2DocsForm({
    document,
    action = -1,
    onClick = () => {},
    translate
}) {
    const metadataSchema = {nom: "", libelle: "", type: "", date: new Date().toISOString()};
    const [file, setFile] = useState({});
    const [metadata, setMetadata] = useState(metadataSchema);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        setMetadata({...metadataSchema, ...document});
    }, []);

    const changeMeta = (field, value) => {
        let copyField = {
            ...metadata, [field]: value
        };
        // avoid to change props.tiers directly and broke ref memory
        let metaChanged = set(copyField, field, value);
        setMetadata(metaChanged);
    };

    const changeDate = (field, str) => {
        // TODO : valid with moment like that
        // let isValid = moment(str, "DD/MM/YYYY", true);
        changeMeta(field.key, str ? new Date(str).toISOString() : new Date().toISOString());
    };

    const marginTop = "10px";

    const fieldsMetadata = [{
        key: "id",
        visible: action !== 6,
        libelle: "tabou2.docsModal.docsForm.id",
        type: "text",
        readOnly: true,
        required: false

    }, {
        key: "nom",
        libelle: "tabou2.docsModal.docsForm.name",
        type: "text",
        visible: action,
        required: true,
        readOnly: action === 2

    }, {
        key: "libelle",
        libelle: "tabou2.docsModal.docsForm.label",
        type: "text",
        readOnly: true,
        required: false,
        visible: action !== 6
    },  {
        key: "type",
        libelle: "tabou2.docsModal.docsForm.type",
        type: "search",
        required: true,
        visible: action,
        readOnly: action === 2
    }, {
        key: "modifDate",
        libelle: "tabou2.docsModal.docsForm.changeDate",
        visible: action !== 6,
        type: "text",
        readOnly: true,
        required: false
    }, {
        key: "modifUser",
        visible: action !== 6,
        libelle: "tabou2.docsModal.docsForm.changeBy",
        type: "text",
        readOnly: true,
        required: false
    }, {
        key: "typeMime",
        visible: action !== 6,
        libelle: "tabou2.docsModal.docsForm.format",
        type: "text",
        readOnly: true,
        required: false
    }, {
        key: "date",
        visible: action,
        libelle: "tabou2.docsModal.docsForm.date",
        type: "date",
        required: false,
        readOnly: action === 2

    }].filter(f => f.visible);

    const valid = () => {
        let required = fieldsMetadata.filter(f => f.required);
        let values = required.filter(r => metadata[r.key]);
        let requiredValid = values.length === required.length;
        if (isEmpty(document)) {
            // valid document creation
            return requiredValid && !isEmpty(file);
        }
        // valid document modification
        return requiredValid && (metadata.nom || file?.name);
    };

    const triggerAction = (n) => {
        return onClick({document: document, action: n, file: file, metadata: metadata});
    };

    const clearSearch = (key) => {
        setSearchText("");
        changeMeta(key, "");
    };

    return (
        <>
            <Row className="text-center tabou-tbar-panel">
                <Toolbar
                    btnDefaultProps={{
                        bsStyle: "primary"
                    }}
                    btnGroupProps={{
                        style: {
                            margin: 10
                        }
                    }}
                    buttons={[
                        {
                            glyph: "ok",
                            disabled: !valid(),
                            visible: action !== 2,
                            tooltip: translate.i18n(translate.messages, "tabou2.valid"),
                            id: "saveDocDetail",
                            className: "square-button-md",
                            onClick: () => triggerAction(action === 3 ? 7 : 1),
                            style: {color: "#28a745", background: "none", border: "none"}
                        }, {
                            glyph: "remove",
                            tooltip: translate.i18n(translate.messages, "tabou2.cancel"),
                            className: "square-button-md",
                            id: "closeDocDetail",
                            onClick: () => triggerAction(0),
                            style: {color: "#fc3f2a", background: "none", border: "none"}
                        }]}
                />
            </Row>
            <FormGroup>
                <Col xs={7}>
                    {fieldsMetadata.map(field => (
                        <Col xs={12}>
                            <Col xs={3} style={{marginTop: marginTop}}>
                                <ControlLabel>
                                    <Message msgId={field.libelle}/>{field.required ? "*" : ""} :
                                </ControlLabel>
                            </Col>
                            <Col xs={9}>
                                {field.type === "text" && (<FormControl
                                    type="text"
                                    required={field?.required || false}
                                    readOnly={field?.readOnly || false}
                                    value={has(metadata, field?.key) ? get(metadata, field?.key) || get(document, field.key) : get(document, field.key)}
                                    placeholder={translate.i18n(translate.messages, field.libelle)}
                                    onChange={(t) => changeMeta(field.key, t.target.value)}
                                />)}
                                {field.type === "search" && (
                                    <SearchCombo
                                        minLength={1}
                                        textField={"libelle"}
                                        valueField={"id"}
                                        readOnly={field?.readOnly || false}
                                        value={searchText ? searchText : metadata?.type}
                                        forceSelection
                                        search={
                                            text => searchDocumentsTypes(text)
                                                .then(({elements}) => {
                                                    return elements.map(v => v);
                                                })
                                        }
                                        onSelect={(t) => {
                                            if (t) {
                                                changeMeta(field.key, t.libelle);
                                                setSearchText(t.libelle);
                                            } else {
                                                clearSearch(field.key);
                                            }
                                        }}
                                        onChange={(t) => {
                                            if (!t) {
                                                clearSearch(field.key);
                                            } else {
                                                setSearchText(t);
                                            }
                                        }}
                                        placeholder={translate.i18n(translate.messages, "tabou2.docsModal.docsForm.selectType")}
                                    />
                                )}
                                {field.type === "date" && (
                                    <DateTimePicker
                                        type="date"
                                        className="identifyDate"
                                        inline
                                        dropDown
                                        placeholder={translate.i18n(translate.messages, "tabou2.docsModal.docsForm.dateDoc")}
                                        readOnly={field?.readOnly || false}
                                        calendar
                                        time={false}
                                        culture="fr"
                                        value={has(metadata, field?.key) ? new Date(get(metadata, field?.key)) : null}
                                        format="DD/MM/YYYY"
                                        onSelect={(v) => changeDate(field, v)}
                                        onChange={(v) => changeDate(field, v)}
                                    />
                                )}
                            </Col>
                        </Col>
                    ))}
                </Col>
                {[3, 6].includes(action) && (<Col xs={4}>
                    <Dropzone
                        key="dropzone"
                        rejectClassName="alert-danger"
                        className="alert alert-info col-xs-12"
                        onDrop={(f) => {
                            if (!metadata.nom) {
                                changeMeta("nom", f[0].name);
                            }
                            setFile(f[0]);
                        }}
                        style={{
                            margin: "0px !important",
                            borderStyle: "dashed",
                            borderWidth: "3px",
                            transition: "all 0.3s ease-in-out"
                        }}
                        activeStyle={{
                            backgroundColor: "#eee",
                            borderWidth: "5px",
                            boxShadow: "0px 0px 25px 14px #d9edf7"
                        }}
                    >
                        <Col xs={12} className="text-center">
                            <div>
                                <Glyphicon glyph="upload" style={{paddingRight: "5px"}}/><br/>
                                <Message msgId="tabou2.docsModal.uploadFile"/>
                                <p style={{color: "grey", marginTop: "5px"}}>
                                    {file && file.name ? file.name : null}
                                    {metadata.nom && !file?.name ? metadata.nom : null}
                                </p>
                            </div>
                        </Col>
                    </Dropzone>
                </Col>)}
            </FormGroup>
        </>
    );
}
