FROM node:12.6.0
COPY . /build
WORKDIR /build
RUN yarn install
RUN yarn build