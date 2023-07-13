set -e

EXTERNAL_PORT=1337
INTERNAL_PORT=8080

APP_NAME="talen:prod"
if [[ $1 == "build" ]]; then
    docker build -f Dockerfile --build-arg REACT_APP_URL="http://0.0.0.0:${EXTERNAL_PORT}" -t ${APP_NAME} . 
fi

if [[ $1 == "run" ]]; then
    . .env
    docker run -it --rm -e "PORT=${INTERNAL_PORT}" -e "ENV=${ENV}" -e "MONGO_USERNAME=${MONGO_USERNAME}" -e "MONGO_PASSWORD=${MONGO_PASSWORD}" -e "GITHUB_USERNAME=${GITHUB_USERNAME} -e "GITHUB_PASSWORD=${GITHUB_PASSWORD} -p ${EXTERNAL_PORT}:${INTERNAL_PORT} ${APP_NAME}
fi
