# IA_Market_Study

# 📈 Market Predictor AI

Este proyecto entrena una IA con datos de mercado (velas OHLC y RSI) para predecir movimientos futuros de precios y facilitar las predicciones mediante un bot de Telegram.

## 🧠 Objetivo

1. Entrenar una IA con datos históricos de mercado.
2. Usar el modelo entrenado para predecir si un símbolo subirá o bajará, según el tamaño de vela.
3. Facilitar la consulta de predicciones mediante un bot de Telegram.

## 🧩 Estructura

- `data/`: Contiene los datos históricos de entrenamiento (velas OHLC y RSI).
- `training/`: Script de preprocesado y entrenamiento del modelo.
- `predictor/`: Carga el modelo y genera predicciones.
- `telegram_bot/`: Permite interactuar con el sistema vía Telegram.
- `notebooks/`: Análisis y pruebas en Jupyter Notebook.

