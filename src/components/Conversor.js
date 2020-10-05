import React, { Fragment, useState, useEffect } from 'react';
import styles from "./css/Conversor.module.css";
import logoArg from "../images/argentinaFlag.png";
import logoSwap from "../images/swap512.png";
import logoEarth from "../images/earthWhite.png";
import Select, { components } from 'react-select';
import ReactCountryFlag from "react-country-flag"







const Conversor = () => {

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

    const [codPaises, updateCodPaises] = useState([]);
    const [tipoPeso, guardarTipoPeso] = useState("ARS");
    const [tipoDivisa, guardarTipoDivisa] = useState("USD");
    const options =
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

    const [montoPesos, guardarMontoPesos] = useState(0);
    const [montoDivisa, guardarMontoDivisa] = useState(0);
    const apiKey = "3986110db82add6683b4";
    const urlListAllCountries = "https://free.currconv.com/api/v7/currencies?apiKey=3986110db82add6683b4";


    const obtenerConversion = async (e) => {
        const valorCampo = e.target.value;
        const nombreCampo = e.target.name;
        let resultado;
        if (tipoPeso === "ARS") {
            let api
            nombreCampo === "montoPesos" ?
                api = await fetch("https://free.currconv.com/api/v7/convert?q=" + tipoPeso + "_" + tipoDivisa + "&compact=ultra&apiKey=" + apiKey)
                :
                api = await fetch("https://free.currconv.com/api/v7/convert?q=" + tipoDivisa + "_" + tipoPeso + "&compact=ultra&apiKey=" + apiKey);

            const respuesta = await api.json();
            const response = Object.values(respuesta)[0];
            resultado = parseInt(valorCampo) * response;
        } else {
            const api = await fetch("https://www.dolarsi.com/api/api.php?type=valoresprincipales");
            const respuesta = await api.json();
            let valorDolarParalelo = parseInt(respuesta[1].casa.compra);

            const usdMercadoParalelo = parseInt(valorCampo) / valorDolarParalelo;


            let api2;
            nombreCampo === "montoPesos" ?
                api2 = await fetch("https://free.currconv.com/api/v7/convert?q=USD_" + tipoDivisa + "&compact=ultra&apiKey=" + apiKey)
                :
                api2 = await fetch("https://free.currconv.com/api/v7/convert?q=" + tipoDivisa + "_USD&compact=ultra&apiKey=" + apiKey)

            const respuesta2 = await api2.json();
            const response = Object.values(respuesta2)[0];
            nombreCampo === "montoPesos" ?
                resultado = usdMercadoParalelo * response
                :
                resultado = valorDolarParalelo * (response * parseInt(valorCampo))
        }
        return resultado;
    }

    const compare = (a, b) => {
        if (a.currencyName < b.currencyName) {
            return -1;
        }
        if (a.currencyName > b.currencyName) {
            return 1;
        }
        return 0;
    }

    // const obtenerCodigoMonedas = async () => {
    //     const api = await fetch(urlListAllCountries);
    //     const respuesta = await api.json();
    //     const countries = Object.values(respuesta.results);
    //     const countriesSorted = countries.sort(compare);
    //     updateCodPaises(countriesSorted);
    // }

    const handleMontoPesos = async (e) => {
        let valorCampo = e.target.value;
        guardarMontoPesos(valorCampo);
        let resultado = await obtenerConversion(e);
        guardarMontoDivisa(resultado % 1 === 0 ? resultado : parseFloat(resultado).toFixed(2));
    }

    const handleMontoDivisa = async (e) => {
        let newValue = e.target.value;
        guardarMontoDivisa(newValue);
        let resultado = await obtenerConversion(e);
        guardarMontoPesos(resultado % 1 === 0 ? resultado : parseFloat(resultado).toFixed(2));
    }

    const handleTipoPeso = async (e) => {
        let valorCampo = e;
        guardarTipoPeso(valorCampo);

        // const nombreCampo = e.target.name;

        let resultado;
        if (valorCampo === "ARS") {
            const api = await fetch("https://free.currconv.com/api/v7/convert?q=" + valorCampo + "_" + tipoDivisa + "&compact=ultra&apiKey=" + apiKey);

            const respuesta = await api.json();
            const response = Object.values(respuesta)[0];
            resultado = parseInt(montoPesos) * response;
        } else {
            const api = await fetch("https://www.dolarsi.com/api/api.php?type=valoresprincipales");
            const respuesta = await api.json();
            let valorDolarParalelo = parseInt(respuesta[1].casa.compra);
            const usdMercadoParalelo = parseInt(montoPesos) / valorDolarParalelo;
            let api2 = await fetch("https://free.currconv.com/api/v7/convert?q=USD_" + tipoDivisa + "&compact=ultra&apiKey=" + apiKey);
            const respuesta2 = await api2.json();
            const response = Object.values(respuesta2)[0];
            resultado = usdMercadoParalelo * response
        }
        guardarMontoDivisa(resultado % 1 === 0 ? resultado : parseFloat(resultado).toFixed(2));
    }

    const handleTipoDivisa = async (event) => {
        let valorCampo = event.value;
        guardarTipoDivisa(valorCampo);
        let resultado;
        if (tipoPeso === "ARS") {
            const api = await fetch("https://free.currconv.com/api/v7/convert?q=" + valorCampo + "_ARS&compact=ultra&apiKey=" + apiKey);
            const respuesta = await api.json();
            const response = Object.values(respuesta)[0];
            resultado = parseInt(montoDivisa) * response;
        } else {
            const api = await fetch("https://www.dolarsi.com/api/api.php?type=valoresprincipales");
            const respuesta = await api.json();
            let valorDolarParalelo = parseInt(respuesta[1].casa.compra);
            let api2 = await fetch("https://free.currconv.com/api/v7/convert?q=" + valorCampo + "_USD&compact=ultra&apiKey=" + apiKey);

            const respuesta2 = await api2.json();
            const response = Object.values(respuesta2)[0];

            resultado = valorDolarParalelo * (response * parseInt(montoDivisa));
        }
        guardarMontoPesos(resultado % 1 === 0 ? resultado : parseFloat(resultado).toFixed(2));
    }

    useEffect(() => {
        const obtenerCodigoMonedas = async () => {
            const api = await fetch(urlListAllCountries);
            const respuesta = await api.json();
            const countries = Object.values(respuesta.results);
            const countriesSorted = countries.sort(compare);
            //ingresado para react-select
            const tempOptions = countriesSorted.map(option => ({
                id: option.id,
                value: option.id,
                label: option.currencyName
            }));
            //end
            updateCodPaises(tempOptions);
        }
        obtenerCodigoMonedas();
    }, [])

    return (
        <Fragment>
            <div className={styles.container}>

                <h2 className={styles.title}>Conversor de moneda Argentina</h2>
                <div className={styles.containerLogos}>
                    <div className={styles.logos}>
                        <img src={logoArg} alt="Logo Argentina" />
                    </div>
                    <div className={styles.logos}>
                        <img src={logoSwap} alt="Logo Swap" />
                    </div>
                    <div className={styles.logos}>
                        <img src={logoEarth} alt="Logo Earth" />
                    </div>
                </div>
                <div className={styles.form}>
                    {/* <div className={styles.boxPesos}> */}
                    <input className="form-control"
                        type="number"
                        name="montoPesos"
                        value={montoPesos}
                        placeholder="Monto en pesos..."
                        onChange={handleMontoPesos}
                        onFocus={(e) => e.target.value === "0" ? e.target.value = "" : e.target.value}
                    />
                    {<Select
                        options={options}
                        onChange={handleTipoPeso}
                        defaultValue={{ label: "Peso Oficial", value: 'ARS' }}//ARS by default
                        components={{ Option: IconOption }}
                    >
                    </Select>
                    }
                    {/* <select className="form-control"
                        onChange={handleTipoPeso}>
                        <option key="ARS" value="ARS">Peso Oficial</option>
                        <option key="ARSBLUE" value="ARSBLUE">Peso Alternativo</option>
                    </select> */}
                    {/* </div> */}
                    {/* <div className={styles.boxMonedaExtranjera}> */}
                    <input className="form-control"
                        type="number"
                        name="montoDivisa"
                        value={montoDivisa}
                        placeholder="Monto en moneda extranjera..."
                        onChange={handleMontoDivisa}
                        onFocus={(e) => e.target.value === "0" ? e.target.value = "" : e.target.value}
                    />
                    <Select
                        options={codPaises}
                        onChange={handleTipoDivisa}
                        defaultValue={{ label: "United States Dollar", value: 'USD' }}//usd by default
                        components={{ Option: IconOption }}
                    ></Select>


                    {/* <select className="form-control"
                        onChange={handleTipoDivisa}>
                        {codPaises.map((pais) => <option key={pais.id} value={pais.id}>{pais.currencyName}</option>)}
                    </select> */}

                </div>
                {/* </div> */}
                {/* <button onClick={handleOnClick}>Calcular</button> */}
            </div>
        </Fragment >
    );
}

export default Conversor;