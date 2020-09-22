import React, { Fragment, useState, useEffect } from 'react';

const Conversor = () => {

    const [codPaises, updateCodPaises] = useState([]);
    const [tipoPeso, guardarTipoPeso] = useState("ARS");
    const [tipoDivisa, guardarTipoDivisa] = useState("USD");


    const [montoPesos, guardarMontoPesos] = useState(0);
    const [montoDivisa, guardarMontoDivisa] = useState(0);
    const apiKey = "3986110db82add6683b4";
    const urlListAllCountries = "https://free.currconv.com/api/v7/currencies?apiKey=3986110db82add6683b4";


    const obtenerValorPeso = () => {
        const api = fetch("https://www.dolarsi.com/api/api.php?type=valoresprincipales");
        const valor = api.then(respuesta => respuesta.json());
        valor.then(resultado => console.log(parseInt(resultado[1].casa.compra)));
    }

    const handleOnClick = async () => {
        const api = await fetch("https://free.currconv.com/api/v7/convert?q=" + tipoPeso + "_" + tipoDivisa + "&compact=ultra&apiKey=" + apiKey);
        const respuesta = await api.json();
        const response = Object.values(respuesta)[0];
        let resultado = parseInt(montoPesos) * response;
        guardarMontoDivisa(resultado);
    }

    const obtenerCodigoMonedas = async () => {
        const api = await fetch(urlListAllCountries);
        const respuesta = await api.json();
        updateCodPaises(Object.values(respuesta.results));
    }

    const handleMontoPesos = async (e) => {
        const newvalue = e.target.value;
        guardarMontoPesos(newvalue);

        let resultado;
        if (tipoPeso === "ARS") {
            const api = await fetch("https://free.currconv.com/api/v7/convert?q=" + tipoPeso + "_" + tipoDivisa + "&compact=ultra&apiKey=" + apiKey);
            const respuesta = await api.json();
            const response = Object.values(respuesta)[0];
            resultado = parseInt(montoPesos) * response;
        } else {
            const api = await fetch("https://www.dolarsi.com/api/api.php?type=valoresprincipales");
            const respuesta = await api.json();
            let valorPesoParalelo = parseInt(respuesta[1].casa.compra);

            console.log("valor peso paralelo", valorPesoParalelo);
            const usdMercadoParalelo = parseInt(montoPesos) / valorPesoParalelo;
            console.log("usd mercado paralelo", usdMercadoParalelo);

            const api2 = await fetch("https://free.currconv.com/api/v7/convert?q=USD_" + tipoDivisa + "&compact=ultra&apiKey=" + apiKey);
            const respuesta2 = await api2.json();
            const response = Object.values(respuesta2)[0];

            console.log("response", response)
            resultado = usdMercadoParalelo * response;
        }
        guardarMontoDivisa(resultado);

        // const api = await fetch("https://free.currconv.com/api/v7/convert?q=" + tipoPeso + "_" + tipoDivisa + "&compact=ultra&apiKey=" + apiKey);
        // const respuesta = await api.json();
        // const response = Object.values(respuesta)[0];
        // let resultado = parseInt(montoPesos) * response;
        // guardarMontoDivisa(resultado);
    }

    const handleMontoDivisa = (e) => {
        guardarMontoDivisa(e.target.value);
    }

    const handleTipoPeso = (e) => {
        guardarTipoPeso(e.target.value);
    }
    const handleTipoDivisa = async (e) => {
        const newvalue = e.target.value;
        guardarTipoDivisa(newvalue);
        let resultado;
        if (tipoPeso === "ARS") {
            const api = await fetch("https://free.currconv.com/api/v7/convert?q=" + tipoPeso + "_" + newvalue + "&compact=ultra&apiKey=" + apiKey);
            const respuesta = await api.json();
            const response = Object.values(respuesta)[0];
            resultado = parseInt(montoPesos) * response;
        } else {
            const api = await fetch("https://www.dolarsi.com/api/api.php?type=valoresprincipales");
            const respuesta = await api.json();
            let valorPesoParalelo = parseInt(respuesta[1].casa.compra);

            console.log("valor peso paralelo", valorPesoParalelo);
            const usdMercadoParalelo = parseInt(montoPesos) / valorPesoParalelo;
            console.log("usd mercado paralelo", usdMercadoParalelo);

            const api2 = await fetch("https://free.currconv.com/api/v7/convert?q=USD_" + newvalue + "&compact=ultra&apiKey=" + apiKey);
            const respuesta2 = await api2.json();
            const response = Object.values(respuesta2)[0];

            console.log("response", response)
            resultado = usdMercadoParalelo * response;
        }
        guardarMontoDivisa(resultado);
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