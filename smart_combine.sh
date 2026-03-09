#!/bin/bash

# --- НАСТРОЙКА ---
# Директория для поиска. Используем первый аргумент ($1) или текущую директорию (.), если он не задан.
SOURCE_DIR=${1:-.}

# Имя выходного файла. Используем второй аргумент ($2) или имя по умолчанию.
OUTPUT_FILE=${2:-"project_snapshot.txt"}

# --- ПРОВЕРКИ ---
# Проверяем, существует ли указанная директория
if [ ! -d "$SOURCE_DIR" ]; then
    echo "Ошибка: Директория '$SOURCE_DIR' не найдена."
    exit 1
fi

# Получаем полный, абсолютный путь к выходному файлу, чтобы надежно его исключить.
OUTPUT_FILE_ABS=$(realpath "$OUTPUT_FILE")
# Получаем имя самого скрипта, чтобы его тоже исключить
SCRIPT_ABS_PATH=$(realpath "$0")


echo "Поиск файлов в: $(realpath "$SOURCE_DIR")"
echo "Результат будет сохранен в: $OUTPUT_FILE_ABS"
echo "-------------------------------------"

# Очищаем или создаем выходной файл
> "$OUTPUT_FILE_ABS"

# --- ОСНОВНАЯ ЛОГИКА ---
# Используем subshell (скобки), чтобы команда 'cd' не влияла на основную среду скрипта
(
  # Переходим в исходную директорию. Это упрощает получение относительных путей.
  cd "$SOURCE_DIR" || exit

  # Ищем файлы (-type f) в текущей директории (.) и ее поддиректориях,
  # которые соответствуют ОДНОМУ ИЗ (-o) условий по имени.
  # Скобки \( ... \) группируют условия с "-o" (ИЛИ).
  # Добавлены условия -prune для исключения папок node_modules и public_images
  find . -type d \( -name "node_modules" -o -name "public_images" \) -prune -o -type f \( \
    -name "*.js"   -o \
    -name "*.jsx"  -o \
    -name "*.conf" -o \
    -name "Dockerfile" -o \
    -name "*.json" -o \
    -name "*.html" -o \
    -name "*.yml" \
  \) ! -name "package-lock.json" -print | while IFS= read -r filepath
  do
    # Получаем полный путь к найденному файлу для сравнения
    current_file_abs=$(realpath "$filepath")

    # Пропускаем сам выходной файл и сам скрипт
    if [[ "$current_file_abs" == "$OUTPUT_FILE_ABS" || "$current_file_abs" == "$SCRIPT_ABS_PATH" ]]; then
      continue
    fi
    
    # Убираем начальный "./" из пути для красоты
    relative_path=${filepath#./}
    
    echo "Добавляю: $relative_path"

    # Группируем команды вывода и один раз дописываем в файл (это эффективнее)
    {
      echo "$relative_path"
      echo ""
      cat "$filepath"
      echo ""
      echo "______"
      echo ""
    } >> "$OUTPUT_FILE_ABS"

  done
)

echo "-------------------------------------"
echo "Готово! Нужные файлы объединены в $OUTPUT_FILE"