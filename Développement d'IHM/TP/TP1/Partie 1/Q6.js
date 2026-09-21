

const chargerDonnees = async (url) => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Erreur lors du chargement des données');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error(error.message);
    }
};


(async () => {
    try {
        const data = await chargerDonnees('https://jsonplaceholder.typicode.com/posts/1');
        console.log(data); 

    } catch (error) {
        console.error('Erreur:', error); 
    }
})();
