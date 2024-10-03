#!/usr/bin/env sh

if [ ! -f .env ]; then
  echo "Env not exits. Creating"
  cp .env.example .env
  sleep 3
fi


setEnv() {
  envFile='.env'
  escapedRegExp=$(echo "$2" | sed 's/[.[\/\&\(*^$+?{|]/\\&/g')

  if grep -E "^$1=" $envFile > /dev/null; then
    # replace existed
    if [ "$(uname)" = "Darwin" ]; then
      sed -i '' -r "s/^($1=).*/\1$escapedRegExp/" $envFile
    else
      sed -i -r "s/^($1=).*/\1$escapedRegExp/" $envFile
    fi
  else
    # add new
    printf '\n%s=%s' "$1" "$2" >> $envFile
  fi
}

setEnv APP_ENV "$1"

if [ "$1" = "local" ]; then
  ln -sf docker-compose-local.yml docker-compose.yml
  cp -a ./hooks/. ./.git/hooks
  chmod ug+x .git/hooks/*
fi

if [ "$1" = "prod" ]; then
  setEnv APP_ENV "production"
  setEnv VITE_APP_USE_PROXY "false"
  setEnv VITE_APP_ENV "production"
  [ -n "$CI_COMMIT_SHORT_SHA" ] && [ -n "$CI_COMMIT_REF_SLUG" ] && setEnv APP_IMAGE_VERSION "$CI_COMMIT_SHORT_SHA-$CI_COMMIT_REF_SLUG"
  [ -n "$VITE_APP_API_DOMAIN_PROD" ] && setEnv VITE_APP_API_DOMAIN "$VITE_APP_API_DOMAIN_PROD"
  [ -n "$VITE_APP_COMPANY_AUTH_PROD" ] && setEnv VITE_APP_COMPANY_AUTH "$VITE_APP_COMPANY_AUTH_PROD"
  [ -n "$CI_SERVER_HOST" ] && [ -n "$CI_PROJECT_ID" ] && [ -n "$CI_JOB_TOKEN" ] && echo "//${CI_SERVER_HOST}/api/v4/projects/447/packages/npm/:_authToken=${CI_JOB_TOKEN}" >> src/.npmrc
  ln -sf docker-compose-production.yml docker-compose.yml
fi

if [ "$1" = "dev" ]; then
  setEnv APP_ENV "production"
  setEnv VITE_APP_USE_PROXY "false"
  setEnv VITE_APP_ENV "development"
  [ -n "$CI_COMMIT_SHORT_SHA" ] && [ -n "$CI_COMMIT_REF_SLUG" ] && setEnv APP_IMAGE_VERSION "$CI_COMMIT_SHORT_SHA-$CI_COMMIT_REF_SLUG"
  [ -n "$VITE_APP_API_DOMAIN_DEV" ] && setEnv VITE_APP_API_DOMAIN "$VITE_APP_API_DOMAIN_DEV"
  [ -n "$VITE_APP_COMPANY_AUTH_DEV" ] && setEnv VITE_APP_COMPANY_AUTH "$VITE_APP_COMPANY_AUTH_DEV"
  [ -n "$CI_SERVER_HOST" ] && [ -n "$CI_PROJECT_ID" ] && [ -n "$CI_JOB_TOKEN" ] && echo "//${CI_SERVER_HOST}/api/v4/projects/447/packages/npm/:_authToken=${CI_JOB_TOKEN}" >> src/.npmrc
  ln -sf docker-compose-production.yml docker-compose.yml
fi

