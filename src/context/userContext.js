import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);

    // 🔥 Busca produtos e categorias ao carregar a aplicação
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/produtos');
                setProducts(response.data);

                // Extrai categorias únicas dos produtos
                const uniqueCategories = [...new Set(response.data.map(prod => prod.categoria))];
                setCategories(uniqueCategories);
            } catch (error) {
                console.error("Erro ao buscar produtos:", error);
            }
        };
        fetchProducts();
    }, []);

    // 🛒 Adiciona um produto ao carrinho
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

    // ❌ Remove um item do carrinho
    const removeFromCart = (id) => {
        setCart(prevCart => prevCart.filter(item => item._id !== id));
    };

    // 🗑️ Limpa o carrinho
    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, categories, products }}>
            {children}
        </CartContext.Provider>
    );
};
