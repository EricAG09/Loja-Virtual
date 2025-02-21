import React, { createContext, useContext, useState } from 'react';

// Criação do contexto do carrinho
const CartContext = createContext();

// Hook para usar o contexto do carrinho
export const useCart = () => {
    return useContext(CartContext);
};

// Provedor do contexto do carrinho
export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]); 
    const [table, setTable] = useState("");

    const addToCart = (product) => {
        setCart((prevCart) => {
            const existingProduct = prevCart.find(item => item._id === product._id);
            if (existingProduct) {
                return prevCart.map(item =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    // Função para remover um produto do carrinho
    const removeFromCart = (id) => {
        setCart(prevCart => prevCart.filter(item => item._id !== id));
    };

    const setTableNumber = (number) => {
        setTable(number);
    }

    // Função para limpar o carrinho
    const clearCart = () => {
        setCart([]);
        setTable("");
    };

    // Retorna o contexto do carrinho com as funções e o estado
    return (
        <CartContext.Provider value={{ cart, table, addToCart, removeFromCart, setTableNumber, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};