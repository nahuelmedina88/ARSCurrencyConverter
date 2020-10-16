import React, { Fragment } from 'react';
import styles from "./css/Error.module.css";

const Error = () => {
    return (
        <Fragment>
            <div className={"alert alert-danger " + styles.error}>
                Los valores son incorrectos.
            </div>
        </Fragment>);
}

export default Error;