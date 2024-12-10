import React from "react";
import logo from '../Assents/logo.png';
import cart from '../Assents/cart_icon.png';
import './navbar.css';

function NavBar () {
    console.log("Entrou!!!")
    return (
        <>
        <div className="navbar">
            <div className="nav-logo">
                <img src={logo} alt='logo' />
                <p>Loja Virtual</p>
                
            </div>
            
            <ul className="nav-menu">
                <li>Loja</li>
                <li>Homem</li>
                <li>Mulher</li>
                <li>Criança</li>
            </ul>
            <div className="nav-login-cart">
                <button>Login</button>
                <img src={cart} alt='carro' />
            </div>
        </div>
        </>
    )
}

export default NavBar;