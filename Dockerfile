# Serviço de integração Prescrição → Farmácia (carro de emergência)
# Gerar antes: npm install && npm run build
FROM node:22-alpine
WORKDIR /app
COPY dist ./dist
COPY servidor/dist ./servidor/dist
COPY servidor/public ./servidor/public
ENV PORTA=3080 DADOS=/dados/banco.json SLA_MINUTOS=60 RESERVA_MINUTOS=15
VOLUME ["/dados"]
EXPOSE 3080
USER node
CMD ["node", "servidor/dist/servidor.js"]
