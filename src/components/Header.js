import React, { Fragment } from 'react';
import logoArg from "../images/argentinaFlag.png";
import logoSwap from "../images/swap512.png";
import logoEarth from "../images/earthWhite.png";
import styles from "./css/Header.module.css";

const Header = () => {
    return (
        <Fragment>
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
        </Fragment>
    );
}

export default Header;