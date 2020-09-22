import React, { Fragment, useState, useEffect } from 'react';

const Conversor = () => {

    const [codPaises, updateCodPaises] = useState([]);
    const [tipoPeso, guardarTipoPeso] = useState("ARS");
    const [tipoDivisa, guardarTipoDivisa] = useState("USD");

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
            console.log("valor Dolar paralelo", valorDolarParalelo);

            const usdMercadoParalelo = parseInt(montoPesos) / valorDolarParalelo;
            console.log("usd mercado paralelo", usdMercadoParalelo);

            let api2;
            nombreCampo === "montoPesos" ?
                api2 = await fetch("https://free.currconv.com/api/v7/convert?q=USD_" + tipoDivisa + "&compact=ultra&apiKey=" + apiKey)
                :
                api2 = await fetch("https://free.currconv.com/api/v7/convert?q=" + tipoDivisa + "_USD&compact=ultra&apiKey=" + apiKey)

            const respuesta2 = await api2.json();
            const response = Object.values(respuesta2)[0];

            console.log("response", response);
            console.log("evento name", nombreCampo);
            console.log("monto Divisa", parseInt(valorCampo));
            nombreCampo === "montoPesos" ?
                resultado = usdMercadoParalelo * response
                :
                resultado = valorDolarParalelo * (response * parseInt(valorCampo))
        }
        return resultado;
    }

    const handleOnClick = async () => {
        let resultado = await obtenerConversion();
        guardarMontoDivisa(resultado);
    }

    const obtenerCodigoMonedas = async () => {
        const api = await fetch(urlListAllCountries);
        const respuesta = await api.json();
        updateCodPaises(Object.values(respuesta.results));
    }

    const handleMontoPesos = async (e) => {
        let newValue = e.target.value;
        guardarMontoPesos(newValue);
        let resultado = await obtenerConversion(e);
        guardarMontoDivisa(resultado);
    }

    const handleMontoDivisa = async (e) => {
        let newValue = e.target.value;
        guardarMontoDivisa(newValue);
        let resultado = await obtenerConversion(e);
        guardarMontoPesos(resultado);
    }

    const handleTipoPeso = (e) => {
        guardarTipoPeso(e.target.value);
    }
    const handleTipoDivisa = (e) => {
        guardarTipoDivisa(e.target.value);
    }


    useEffect(() => {
        obtenerCodigoMonedas();
    }, [])

    return (
        <Fragment>
            <select onChange={handleTipoPeso}>
                <option key="ARS" value="ARS">Peso Oficial</option>
                <option key="ARSBLUE" value="ARSBLUE">Peso Alternativo</option>
            </select>
            <input
                type="text"
                name="montoPesos"
                value={montoPesos}
                placeholder="Ingrese monto en pesos..."
                onChange={handleMontoPesos}
            />
            <select onChange={handleTipoDivisa}>
                {codPaises.map((pais) => <option key={pais.id} value={pais.id}>{pais.currencyName}</option>)}
            </select>
            <input
                type="text"
                name="montoDivisa"
                value={montoDivisa}
                placeholder="Ingrese monto en moneda extranjera..."
                onChange={handleMontoDivisa}
            />
            <button onClick={handleOnClick}>Calcular</button>
        </Fragment>
    );
}

export default Conversor;