const numbers=[1,2,3,4,5,6];
const doubled=numbers.map(num =>num*2);
console.log(doubled);
//Q2:
const personnes = [
    { prenom: 'Ahmed', nom: 'ALAMI' },
    { prenom: 'Fatima', nom: 'ALAOUI' },
    { prenom: 'Karim', nom: 'BAGHDADI' }
  ];
  
  const nomsComplets = personnes.map(personne => `${personne.prenom} ${personne.nom}`);
  console.log(nomsComplets); 
  //Q3:
  const numbers1=[1,2,3,4,5,6,7,8,9,10];
  const novnumbers=numbers1.filter(num=>num%2===0);
  console.log(novnumbers);
  //Q4:
  const values = ['a', 'b', 'c', 'a', 'b', 'a', 'c', 'd'];
  const frequency = values.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});
  console.log(frequency);
//Q5:
const chargerDonnees = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des données');
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error.message);
    }
  };
  
  chargerDonnees();
