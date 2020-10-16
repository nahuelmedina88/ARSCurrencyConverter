import React, { Fragment } from 'react';
import styles from "./css/ResultBox.module.css";
import Spinner from "./SpinnerIcon";



const ResultBox = ({ amountArgentinianCurrency, amountForeignCurrency, foreignCurrency, loading }) => {
    return (
        <Fragment>
            <div className={styles.container}>
                {amountArgentinianCurrency && amountArgentinianCurrency !== "0" ?
                    <div className={styles.content}>
                        {loading ? <div> <Spinner /></div> : <div><p>{amountArgentinianCurrency} pesos argentinos son</p>
                            <h2 className>{amountForeignCurrency} {foreignCurrency}</h2></div>
                        }
                    </div> : null
                }
            </div>
        </Fragment>
    );
}

export default ResultBox;