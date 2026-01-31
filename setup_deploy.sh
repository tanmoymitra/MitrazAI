#!/bin/bash
HOST="ubuntu@3.105.81.192"
KEY="-i mitrazAWS.pem"

echo "🚀 Connecting to $HOST to set up deployment..."

ssh $KEY -o StrictHostKeyChecking=no $HOST "
  set -e
  
  # 1. Create Bare Repo
  echo '📂 Creating bare git repository...'
  mkdir -p ~/website.git
  cd ~/website.git
  git init --bare

  # 2. Create Post-Receive Hook
  echo '🪝 Creating post-receive hook...'
  cat > hooks/post-receive << 'EOF'
#!/bin/bash
TARGET=\"/var/www/mitrazinfotech.tech/html\"
GIT_DIR=\"/home/ubuntu/website.git\"
BRANCH=\"main\"

while read oldrev newrev ref
do
    if [[ \$ref =~ .*/\$BRANCH$ ]];
    then
        echo \"✅ Ref \$ref received. Deploying ${BRANCH} branch to \$TARGET...\"
        
        # Ensure target exists and permissions are correct
        # Note: ubuntu user needs passwordless sudo for this to work automatically
        sudo mkdir -p \$TARGET
        sudo chown -R ubuntu:ubuntu \$TARGET
        
        # Checkout code
        git --work-tree=\$TARGET --git-dir=\$GIT_DIR checkout -f \$BRANCH
        
        echo \"🚀 Deployment Complete!\"
    else
        echo \"⚠️ Ref \$ref received. Doing nothing: only the \$BRANCH branch may be deployed on this server.\"
    fi
done
EOF

  chmod +x hooks/post-receive
  echo '✅ Hook created and made executable.'

  # 3. Pre-create web directory
  echo '🌐 Configuring web directory...'
  sudo mkdir -p /var/www/mitrazinfotech.tech/html
  sudo chown -R ubuntu:ubuntu /var/www/mitrazinfotech.tech/html
  echo '✅ Web directory ready.'
"

echo "🎉 Remote setup complete!"
echo "You can now run: git push production main"
