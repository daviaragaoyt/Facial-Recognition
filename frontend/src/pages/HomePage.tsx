import React, { useState } from 'react';
import WebcamCapture from '../components/WebcamCapture';
import api from '../services/api';

// Definindo o tipo para o resultado da comparação
interface ResultadoComparacao {
    match: boolean;
    pessoa?: {
        id: number;
        nome: string;
        tipo: string;
    };
}

const HomePage: React.FC = () => {
    const [resultadoComparacao, setResultadoComparacao] = useState<ResultadoComparacao | null>(null);

    // Função para comparar a imagem com o backend
    const compararImagem = async (imagemBase64: string) => {
        try {
            const response = await api.post('/comparar', { imagem_base64: imagemBase64 });
            setResultadoComparacao(response.data);
        } catch (error) {
            console.error('Erro ao comparar imagem:', error);
        }
    };

    return (
        <div>
            <h1>Detecção Facial</h1>
            {/* Passando a função compararImagem como prop para WebcamCapture */}
            <WebcamCapture onCapture={compararImagem} />
            {resultadoComparacao && (
                <div>
                    <h2>Resultado da Comparação</h2>
                    <pre>{JSON.stringify(resultadoComparacao, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default HomePage;