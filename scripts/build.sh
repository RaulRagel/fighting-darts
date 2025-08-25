
# npm run build
echo "⚠️ Cambiando a Node 16"
nvm use 16.20.2
ng build
echo "📂 Abriendo carpeta dist..."
start "" "$(cd dist/boxing-darts-angular && pwd -W)"