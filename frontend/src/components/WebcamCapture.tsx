import React, { useRef, useState } from 'react';

// Definindo a interface para as props do componente
interface WebcamCaptureProps {
    onCapture: (imagemBase64: string) => void;
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({ onCapture }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [imagemBase64, setImagemBase64] = useState<string | null>(null);

    // Iniciar a webcam
    const iniciarWebcam = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error('Erro ao acessar a webcam:', err);
        }
    };

    // Capturar imagem da webcam
    const capturarImagem = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                const base64 = canvas.toDataURL('image/jpeg');
                setImagemBase64(base64);
                onCapture(base64); // Chama a função onCapture passando a imagem em base64
            }
        }
    };

    return (
        <div>
            <video ref={videoRef} width="720" height="560" autoPlay muted></video>
            <button onClick={iniciarWebcam}>Iniciar Webcam</button>
            <button onClick={capturarImagem}>Capturar Imagem</button>
            {imagemBase64 && <img src={imagemBase64} alt="Captura" />}
        </div>
    );
};

export default WebcamCapture;