#!/bin/bash

echo "🚀 Configurando sistema de tradução com googletrans..."

# Verificar se Python está instalado
if ! command -v python &> /dev/null; then
    echo "❌ Python não encontrado. Por favor, instale Python 3.7+"
    exit 1
fi

echo "✅ Python encontrado: $(python --version)"

# Instalar googletrans
echo "📦 Instalando googletrans..."
pip install -r requirements.txt

if [ $? -eq 0 ]; then
    echo "✅ googletrans instalado com sucesso!"
else
    echo "❌ Erro ao instalar googletrans"
    exit 1
fi

# Testar a tradução
echo "🧪 Testando tradução..."
python src/translate.py "Olá mundo" pt en

if [ $? -eq 0 ]; then
    echo "✅ Sistema de tradução configurado com sucesso!"
    echo "🎉 Agora você pode usar a tradução dinâmica no seu blog!"
else
    echo "❌ Erro no teste de tradução"
    exit 1
fi 