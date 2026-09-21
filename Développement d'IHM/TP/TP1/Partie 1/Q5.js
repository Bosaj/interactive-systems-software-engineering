

const chargerDonnees = url => {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur lors du chargement des données');
                }
                return response.json();
            })
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                reject(error.message);
            });
    });
};


chargerDonnees('https://jsonplaceholder.typicode.com/posts/1')
    .then(data => {
        console.log(data); 
    })
    .catch(error => {
        console.error('Erreur:', error); 
    });
