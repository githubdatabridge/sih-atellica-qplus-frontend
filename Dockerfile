FROM node:18.12.0-alpine as base
WORKDIR /usr/src/app

ARG version
ENV VITE_APP_VERSION=$version

FROM base as build
COPY package.json ./
COPY yarn.lock ./
COPY .npmrc ./

RUN yarn install
COPY . ./
RUN npm run build

FROM base as publish
COPY --from=build /usr/src/app/build ./build
# COPY --from=build /usr/src/app/index.js ./
COPY --from=build /usr/src/app/.env.template.js ./build

# COPY --from=build /usr/src/app/service*.js ./
# RUN npm install express dotenv node-windows@1.0.0-beta.6

EXPOSE 8080
CMD [ "node", "index.js" ]
