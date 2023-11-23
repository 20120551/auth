# phase 1
FROM node:20-alpine as build
WORKDIR /source
COPY *.json .
# COPY jest.config.js .
RUN npm install
RUN npm install -g typescript
COPY . .
# RUN npm run test
# RUN npm run build:webpack
RUN npm run build
# CMD [ "npm", "start" ]

FROM node:20-alpine
WORKDIR /app
COPY *.json .
RUN npm install --production
COPY --from=build /source/dist ./dist
CMD [ "npm", "start" ]

