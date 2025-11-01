#!/usr/bin/env bash
set -e

# ==========================
# AgentHub Setup Script
# ==========================
# Fully portable, one-click bootstrap + auto dev launch
# macOS/Linux compatible
# ==========================

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "🚀 AgentHub setup starting at: $ROOT_DIR"

# --------------------------
# 1️⃣ NVM & Node.js check
# --------------------------
export NVM_DIR="$HOME/.nvm"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  echo "✅ NVM already installed."
else
  echo "📦 Installing NVM..."
  mkdir -p "$NVM_DIR"
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
fi

# Load NVM
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

NODE_VERSION="18.20.8"
if ! node -v | grep -q "v18"; then
  echo "🧩 Installing Node.js $NODE_VERSION via NVM..."
  nvm install $NODE_VERSION
fi
nvm use $NODE_VERSION
echo "✅ Using Node $(node -v) and npm $(npm -v)"

# --------------------------
# 2️⃣ Ensure x402-sdk mock exists
# --------------------------
MOCK_X402="$ROOT_DIR/mocks/x402-sdk"
if [ ! -d "$MOCK_X402" ]; then
  echo "⚠️ Creating local mock for x402-sdk..."
  mkdir -p "$MOCK_X402"
  cat > "$MOCK_X402/package.json" <<'EOF'
{
  "name": "x402-sdk",
  "version": "1.0.0",
  "main": "index.js"
}
EOF
  cat > "$MOCK_X402/index.js" <<'EOF'
module.exports = {
  connect: () => console.log('[Mocked x402-sdk] connect called'),
  transfer: async () => ({ tx: 'mock_tx' })
};
EOF
fi

# --------------------------
# 3️⃣ Helper: install dependencies safely
# --------------------------
install_deps() {
  local folder=$1
  echo "📦 Installing dependencies in $folder..."
  cd "$ROOT_DIR/$folder"

  # Backend: ensure x402-sdk is a file dependency
  if [ "$folder" == "backend" ]; then
    node -e "
      const fs = require('fs');
      const pkgPath = '$ROOT_DIR/$folder/package.json';
      const pkg = require(pkgPath);
      if (!pkg.dependencies) pkg.dependencies = {};
      pkg.dependencies['x402-sdk'] = 'file:../mocks/x402-sdk';
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    "
  fi

  npm install --legacy-peer-deps
}

# --------------------------
# 4️⃣ Backend setup
# --------------------------
echo "🧱 Setting up backend..."
cd "$ROOT_DIR/backend"

# Create default .env if missing
if [ ! -f .env ]; then
  cat >.env <<EOF
PORT=5000
X402_API_KEY=demo_key
EOF
fi

install_deps "backend"

# Prisma setup
npx prisma generate || true
npx prisma migrate dev --name init || true

echo "✅ Backend ready."

# --------------------------
# 5️⃣ Frontend setup
# --------------------------
echo "💡 Setting up frontend..."
cd "$ROOT_DIR/frontend"

# Create default .env if missing
if [ ! -f .env ]; then
  cat >.env <<EOF
NEXT_PUBLIC_API_URL=http://localhost:5000/api
EOF
fi

install_deps "frontend"

echo "✅ Frontend ready."

# --------------------------
# 6️⃣ Kill previous dev servers
# --------------------------
echo "🛑 Checking for running backend/frontend servers..."

BACKEND_PORT=5000
FRONTEND_PORT=3000

kill_port() {
  local port=$1
  if lsof -i tcp:$port >/dev/null 2>&1; then
    echo "⚠️ Killing process on port $port..."
    lsof -ti tcp:$port | xargs kill -9
  else
    echo "✅ No process running on port $port."
  fi
}

kill_port $BACKEND_PORT
kill_port $FRONTEND_PORT

# --------------------------
# 7️⃣ Launch dev servers in parallel
# --------------------------

echo "🚀 Launching dev servers in parallel..."

if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS: open new terminal tabs
  osascript <<EOF
tell application "Terminal"
    do script "cd $ROOT_DIR/backend && npm run dev"
    do script "cd $ROOT_DIR/frontend && npm run dev"
end tell
EOF
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
  # Linux: use gnome-terminal or xterm
  if command -v gnome-terminal >/dev/null 2>&1; then
    gnome-terminal -- bash -c "cd $ROOT_DIR/backend && npm run dev; exec bash"
    gnome-terminal -- bash -c "cd $ROOT_DIR/frontend && npm run dev; exec bash"
  else
    echo "⚠️ Please open two terminals manually:"
    echo "  ▶ Backend: cd $ROOT_DIR/backend && npm run dev"
    echo "  ▶ Frontend: cd $ROOT_DIR/frontend && npm run dev"
  fi
else
  echo "⚠️ OS not detected for auto-terminal launch. Please start manually."
fi

echo ""
echo "🎉 AgentHub setup completed successfully!"
echo "------------------------------------------"
echo "Backend:  $ROOT_DIR/backend"
echo "Frontend: $ROOT_DIR/frontend"
echo ""
echo "If dev servers didn't start automatically, run manually:"
echo "  ▶ Backend: cd backend && npm run dev"
echo "  ▶ Frontend: cd frontend && npm run dev"
echo "------------------------------------------"

