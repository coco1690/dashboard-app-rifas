import React from 'react';
import './DescargaBoletasPage.css';

export const DescargaBoletasPage: React.FC = () => {
  return (
    <div className="construccion-container">
      <div className="construccion-content">
        {/* Icono de construcción animado */}
        <div className="construccion-icon">
          <div className="casco">
            <div className="casco-banda"></div>
          </div>
          <div className="herramientas">
            <div className="martillo"></div>
            <div className="llave"></div>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="construccion-text">
          <h1 className="titulo">Página en Construcción</h1>
          <h2 className="subtitulo">Descarga de Boletas</h2>
          <p className="descripcion">
            Estamos trabajando en esta funcionalidad para brindarte la mejor experiencia.
            Pronto podrás descargar tus boletas de manera rápida y sencilla.
          </p>
          
          {/* Barra de progreso */}
          <div className="progreso-container">
            <div className="progreso-texto">Progreso del desarrollo</div>
            <div className="progreso-barra">
              <div className="progreso-fill"></div>
            </div>
            <div className="progreso-porcentaje">75%</div>
          </div>

          {/* Información adicional */}
          <div className="info-adicional">
            <div className="info-item">
              <span className="info-icon">📋</span>
              <span>Funcionalidad de descarga</span>
            </div>
            <div className="info-item">
              <span className="info-icon">🔒</span>
              <span>Proceso seguro</span>
            </div>
            <div className="info-item">
              <span className="info-icon">⚡</span>
              <span>Descarga rápida</span>
            </div>
          </div>

          {/* Botón de contacto
          <button className="btn-contacto" onClick={() => alert('Funcionalidad en desarrollo')}>
            Notificarme cuando esté listo
          </button> */}
        </div>
      </div>

      {/* Decoración de fondo */}
      <div className="construccion-bg">
        <div className="bg-elemento bg-circulo-1"></div>
        <div className="bg-elemento bg-circulo-2"></div>
        <div className="bg-elemento bg-triangulo"></div>
      </div>
    </div>
  );
};