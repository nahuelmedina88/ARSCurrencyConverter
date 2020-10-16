const apiKey = "e7e6d77d88f7a3697a77";

export const getValueDollarIllegalMarket = async () => {
    const api = await fetch("https://www.dolarsi.com/api/api.php?type=valoresprincipales");
    const response = await api.json();
    return (parseFloat(response[1].casa.compra, 10).toFixed(2));
}

export const getRateConvertionUSDTo = async (otherCurrency) => {
    const api = await fetch("https://free.currconv.com/api/v7/convert?q=USD_" + otherCurrency + "&compact=ultra&apiKey=" + apiKey);
    const res = await api.json();
    const response = Object.values(res)[0];
    return response;
}

export const getRateConvertionOtherCurrencyToUSD = async (otherCurrency) => {
    const api = await fetch("https://free.currconv.com/api/v7/convert?q=" + otherCurrency + "_USD&compact=ultra&apiKey=" + apiKey)
    const res = await api.json();
    const response = Object.values(res)[0];
    return response;
}


export const getRateConvertionOficialARSTo = async (otherCurrency) => {
    let api;
    api = await fetch("https://free.currconv.com/api/v7/convert?q=ARS_" + otherCurrency + "&compact=ultra&apiKey=" + apiKey);
    const res = await api.json();
    const response = Object.values(res)[0];
    return response;

}

export const getRateConvertionOtherCurrencyToARSOfficial = async (otherCurrency) => {
    let api = await fetch("https://free.currconv.com/api/v7/convert?q=" + otherCurrency + "_ARS&compact=ultra&apiKey=" + apiKey);
    const res = await api.json();
    const response = Object.values(res)[0];
    return response;
}

