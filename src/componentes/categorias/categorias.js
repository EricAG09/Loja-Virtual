import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export const Categorias = () => {
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/categorias");
        setCategorias(response.data); 
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };

    fetchCategorias();
  }, []);

  return (
    <div>
      <h1>Categorias</h1>
      <div className="categorias">
        {categorias.length > 0 ? (
          categorias.map((categoria) => (
            <Link key={categoria._id} to={`/categoria/${categoria.nome}`}>
              <div className="categoria">
                <h2>{categoria.nome}</h2>
                <p>{categoria.descricao}</p>
              </div>
            </Link>
          ))
        ) : (
          <p>Carregando categorias...</p>
        )}
      </div>
    </div>
  );
};
