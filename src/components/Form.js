import React from 'react';
import { Fragment, useState } from 'react';
import styles from "./css/Form.module.css";
import Select, { components } from 'react-select';
import ReactCountryFlag from "react-country-flag";
import { getValueDollarIllegalMarket, getRateConvertionUSDTo, getRateConvertionOtherCurrencyToUSD, getRateConvertionOficialARSTo, getRateConvertionOtherCurrencyToARSOfficial } from "./API";
import Error from "./Error";

const Form = ({ countryCode, getAmountArgentinianCurrency, getAmountForeignCurrency, getForeignCurrency, getLoadingState }) => {

    const [argentinianCurrency, updateArgentinianCurrency] = useState("ARS");
    const [foreignCurrency, updateForeignCurrency] = useState("USD");
    const [amountPesos, updateAmountPesos] = useState(0);
    const [amountForeign, updateAmountForeign] = useState(0);
    const [error, updateError] = useState(false);


    const argentinianCurrencyOptions =
        [{
            id: "ARS",
            value: "ARS",
            label: "Peso Oficial"
        }, {
            id: "ARSBLUE",
            value: "ARSBLUE",
            label: "Peso Paralelo"
        }
        ];
    const { Option } = components;
    const IconOption = props => (

        <Option {...props}>
            <ReactCountryFlag
                countryCode={(props.data.value).substring(0, 2)}
                svg
                style={{
                    width: '2em',
                    height: '2em',
                    paddingRight: '0.3em'
                }}
                title="US"
            />
            {props.data.label}
        </Option>
    );

    const getRateConvertionOficial = async (direction, amountCurrency, otherCurrency) => {
        let response;
        direction === "amountPesos" ?
            response = await getRateConvertionOficialARSTo(otherCurrency)
            :
            response = await getRateConvertionOtherCurrencyToARSOfficial(otherCurrency)

        const res = parseFloat(amountCurrency) * response;
        return res;
    }

    const getRateConvertionIllegalMarket = async (direction, amountCurrency, valueDollarIllegalMarket, myValueDollarIllegalMarket) => {
        let response;
        let result;
        if (direction === "amountPesos") {
            response = await getRateConvertionUSDTo(foreignCurrency);
            result = myValueDollarIllegalMarket * response;
        } else {
            response = await getRateConvertionOtherCurrencyToUSD(foreignCurrency);
            result = valueDollarIllegalMarket * (response * parseFloat(amountCurrency))
        }
        return result;
    }

    const getValueConvertion = async (e) => {
        const amountCurrency = e.target.value;
        const direction = e.target.name;//ARS TO ...Either Argentine Peso first or Foreign Currency
        let result;
        if (argentinianCurrency === "ARS") { // Argentine Peso Official Currency
            result = await getRateConvertionOficial(direction, amountCurrency, foreignCurrency);

        } else if (argentinianCurrency === "ARSBLUE") { // Argentine Peso Illegal Market
            const valueDollarIllegalMarket = await getValueDollarIllegalMarket();
            const myValueDollarIllegalMarket = parseFloat(amountCurrency) / valueDollarIllegalMarket;
            result = await getRateConvertionIllegalMarket(direction, amountCurrency, valueDollarIllegalMarket, myValueDollarIllegalMarket);
        }
        return result;
    }

    const getValueConvertionSelect = async (currency) => {
        let result;
        if (currency === "ARS") {
            const response = await getRateConvertionOficialARSTo(foreignCurrency);
            result = parseFloat(amountPesos) * response;
        } else if (currency === "ARSBLUE") {
            const valueDollarIllegalMarket = await getValueDollarIllegalMarket();
            const myValueDollarIllegalMarket = parseFloat(amountPesos) / valueDollarIllegalMarket;
            let response = await getRateConvertionUSDTo(foreignCurrency);
            result = myValueDollarIllegalMarket * response;
        } else { //if is foreign corrency
            if (argentinianCurrency === "ARS") {
                const response = await getRateConvertionOtherCurrencyToARSOfficial(currency);
                result = parseFloat(amountForeign) * response;
            } else if (argentinianCurrency === "ARSBLUE") {
                const valueDollarIllegalMarket = await getValueDollarIllegalMarket();
                let response = await getRateConvertionOtherCurrencyToUSD(currency);
                result = valueDollarIllegalMarket * (response * parseFloat(amountForeign));
            }
        }
        return result;
    }

    const handleAmountPesos = async (e) => {
        let valorCampo = e.target.value;
        let valorCampoInteger = parseInt(valorCampo);
        if (valorCampoInteger < 0) {
            updateError(true);
        } else {
            updateError(false);
        }
        updateAmountPesos(valorCampo);
        getLoadingState(true);
        let result = await getValueConvertion(e);
        getLoadingState(false);
        updateAmountForeign(result % 1 === 0 ? result : parseFloat(result).toFixed(2));
        /*Update state in App*/
        getAmountArgentinianCurrency(valorCampo);
        getAmountForeignCurrency(result % 1 === 0 ? result : parseFloat(result).toFixed(2));
        getForeignCurrency(foreignCurrency);
    }

    const handleAmountForeign = async (e) => {
        let newValue = e.target.value;
        updateAmountForeign(newValue);
        getLoadingState(true);
        let result = await getValueConvertion(e);
        getLoadingState(false);
        updateAmountPesos(result % 1 === 0 ? result : parseFloat(result).toFixed(2));
        /*Update state in App*/
        getAmountArgentinianCurrency(result % 1 === 0 ? result : parseFloat(result).toFixed(2));
        getAmountForeignCurrency(newValue);
        getForeignCurrency(foreignCurrency);
    }

    const handleArgentinianCurrency = async (e) => {
        let currency = e.value;
        updateArgentinianCurrency(currency);
        getForeignCurrency(foreignCurrency);
        getLoadingState(true);
        let result = await getValueConvertionSelect(currency);
        getLoadingState(false);
        getAmountForeignCurrency(result % 1 === 0 ? result : parseFloat(result).toFixed(2));
        updateAmountForeign(result % 1 === 0 ? result : parseFloat(result).toFixed(2));
    }

    const handleForeignCurrency = async (e) => {
        let otherCurrency = e.value;
        if (otherCurrency === "ARS") {
            updateError(true);
            return;
        } else {
            updateError(false);

            updateForeignCurrency(otherCurrency);
            getForeignCurrency(otherCurrency);

            getLoadingState(true);
            let result = await getValueConvertionSelect(otherCurrency);
            getLoadingState(false);
            updateAmountPesos(result % 1 === 0 ? result : parseFloat(result).toFixed(2));
            getAmountArgentinianCurrency(result % 1 === 0 ? result : parseFloat(result).toFixed(2));
        }
    }

    return (
        <Fragment>
            <div className={styles.form}>
                {error ? <Error /> : null}
                <input className="form-control"
                    type="number"
                    name="amountPesos"
                    value={amountPesos}
                    placeholder="Monto en pesos..."
                    onChange={handleAmountPesos}
                    onFocus={(e) => e.target.value === "0" ? e.target.value = "" : e.target.value}
                />
                {<Select
                    options={argentinianCurrencyOptions}
                    onChange={handleArgentinianCurrency}
                    defaultValue={{ label: "Peso Oficial", value: 'ARS' }}//ARS by default
                    components={{ Option: IconOption }}
                >
                </Select>
                }
                <input className="form-control"
                    type="number"
                    name="amountForeign"
                    value={amountForeign}
                    placeholder="Monto en moneda extranjera..."
                    onChange={handleAmountForeign}
                    onFocus={(e) => e.target.value === "0" ? e.target.value = "" : e.target.value}
                />
                <Select
                    options={countryCode}
                    onChange={handleForeignCurrency}
                    defaultValue={{ label: "United States Dollar", value: 'USD' }}//usd by default
                    components={{ Option: IconOption }}
                ></Select>

            </div>
        </Fragment>
    );
}

export default Form;