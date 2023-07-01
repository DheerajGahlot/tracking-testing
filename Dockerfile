FROM node:19.8.1
RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY . .
RUN npm install -f
EXPOSE 5000
CMD [ "node", "index.js" ]
