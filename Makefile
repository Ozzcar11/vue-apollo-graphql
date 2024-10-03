CONTAINER_NAME ?= app
DOCKER_EXEC ?= docker compose

help:
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

local: ## Подготовка проекта для локальной разработки
	./docker/scripts/init.sh local
	$(DOCKER_EXEC) build

dev: ## Подготовка проекта для дев разработки
	./docker/scripts/init.sh dev
	$(DOCKER_EXEC) build
	$(DOCKER_EXEC) up -d

prod: ## Подготовка проекта для продакшен запуска
	./docker/scripts/init.sh prod
	$(DOCKER_EXEC) build
	$(DOCKER_EXEC) up -d

up: ## Старт контейнера
	$(DOCKER_EXEC) up -d

restart: ## Рестарт контейнера
	$(DOCKER_EXEC) restart

down: ## Остановка контейнера
	$(DOCKER_EXEC) down

develop: ## Запуск локальной среды разработки
	$(DOCKER_EXEC) up -d
	$(DOCKER_EXEC) exec $(CONTAINER_NAME) pnpm run dev

install: ## Установка node_modules
	$(DOCKER_EXEC) run --rm $(CONTAINER_NAME) pnpm install

npm: ## Выполнение произвольной npm комманды
	$(DOCKER_EXEC) run --rm $(CONTAINER_NAME) $(command)

bash: ## Bash консоль контейнера
	$(DOCKER_EXEC) exec $(CONTAINER_NAME) bash

lint: ## Запуск линтера
	$(DOCKER_EXEC) exec $(CONTAINER_NAME) pnpm run lint

fix: ## Автофикс линтера
	$(DOCKER_EXEC) exec $(CONTAINER_NAME) pnpm run lint:fix

cstop: ## Останавливает все запущенные контенеры на машине
	docker ps -a -q | xargs -n 1 -P 8 -I {} docker stop {}

rm: ## Останавливает текущий контейнер и удаляет .env и docker compose файлы
	$(DOCKER_EXEC) down
	rm .env
	rm docker-compose.yml

test:
	docker-compose exec app pnpm run test ${file}

test-watch:
	docker-compose exec app pnpm run test:watch

test-coverage:
	docker-compose exec app pnpm run test:coverage
