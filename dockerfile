# Étape 1 : Utiliser l'image officielle de Node.js
FROM node:16

# Créer un répertoire de travail pour l'application
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances de l'application
RUN npm install

# Copier tout le code de l'application dans le container
COPY . .

# Exposer le port sur lequel l'application écoute
EXPOSE 8080

# Commande pour démarrer l'application
CMD ["npm", "start"]
