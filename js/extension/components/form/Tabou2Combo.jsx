import React, { useState, useEffect } from 'react';
import { Combobox } from 'react-widgets';
import { uniqBy, get } from 'lodash';

function Tabou2Combo({
    style = {},
    placeholder = '',
    load = () => { },
    valueField,
    textField,
    value,
    firstItem,
    disabled,
    parentValue = '',
    onLoad = () => { },
    ...props
}) {

    // set default state according to param type
    const [data, setData] = useState([]); // array
    const [text, setText] = useState("");

    const loadData = () => {
        load().then(result => {
            let response;
            if (onLoad) {
                response = onLoad(result);
            }
            if (firstItem) response.unshift(firstItem);
            response = uniqBy(response, textField);
            setData(response);
        });
    };

    useEffect(() => {
        setText("");
        if (!disabled) {
            loadData();
        }
    }, [parentValue, disabled]); // pass array to stop inifity loop

    useEffect(() => {
        if (text !== value) {
            setText(value);
        }
    }, [value]); // pass array to stop inifity loop

    const changeText = (v, fn) => {
        if (textField) {
            setText(get(v, textField));
        }

        if (fn) {
            fn(v);
        }
    };

    return (<Combobox
        value={text}
        textField={textField}
        valueField={valueField}
        style={style}
        data={data}
        defaultValue={props.defaultValue}
        filter="contains"
        placeholder={placeholder}
        disabled={disabled}
        onSelect={v => changeText(v, props.onSelect)}
        onChange={v => changeText(v, props.onChange)}
        messages={props.messages}
        className={props.className}
    />);
}

export default Tabou2Combo;
