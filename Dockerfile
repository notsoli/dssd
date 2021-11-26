# use node base image
FROM node:17

# copy package and package-lock
COPY package.json package.json
COPY package-lock.json package-lock.json

# install node packages
RUN npm install

# copy root files
COPY . .

# expose server port
EXPOSE 80