// index.js

// Importation des fonctions du fichier operations.js
const { addition, multiplication } = require('./operations');

// Utilisation des fonctions pour effectuer des opérations mathématiques
const resultAddition = addition(5, 3);
console.log('Résultat de l\'addition :', resultAddition); // Output: Résultat de l'addition : 8

const resultMultiplication = multiplication(4, 6);
console.log('Résultat de la multiplication :', resultMultiplication); // Output: Résultat de la multiplication : 24
