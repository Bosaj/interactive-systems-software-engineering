import React, { useState } from 'react';
import "./App.css";

const App = () => {
  const [formData, setFormData] = useState({
    uname: "",
    upass: "",
    city: "",
    gender: "",
    hobbies: []
  });
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const database = [
    { username: "user1", password: "pass1" },
    { username: "user2", password: "pass2" }
  ];

  const errors = {
    uname: "Votre identifiant est incorrect.",
    upass: "Votre mot de passe est incorrect.",
    city: "Veuillez sélectionner une ville parmi : Casablanca, Rabat, Marrakech, Oujda, Agadir, Tanger, et Fès.",
    gender: "Veuillez sélectionner votre genre.",
    hobbies: "Veuillez sélectionner au moins un loisir parmi : Sport, Lecture, Musique."
  };

  const handleSubmit = event => {
    event.preventDefault();
    const { uname, upass, city, gender } = formData;

    const userData = database.find(user => user.username === uname.toLowerCase());

    let newErrorMessages = {};

    if (!userData) {
      newErrorMessages.uname = errors.uname;
    } else if (userData.password !== upass) {
      newErrorMessages.upass = errors.upass;
    }

    if (!["Homme", "Femme"].includes(gender)) {
      newErrorMessages.gender = errors.gender;
    }

    if (!["Casablanca", "Rabat", "Marrakech", "Oujda", "Agadir", "Tanger", "Fès"].includes(city)) {
      newErrorMessages.city = errors.city;
    }

    // Validation of hobbies
    if (formData.hobbies.length === 0) {
      newErrorMessages.hobbies = errors.hobbies;
    }

    console.log("Form Data:", { uname, upass, gender, hobbies: formData.hobbies, city });
    console.log("New Error Messages:", newErrorMessages);

    if (Object.keys(newErrorMessages).length > 0) {
      setErrorMessages(newErrorMessages);
      return;
    }

    setIsSubmitted(true);
  };

  const handleChange = event => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCheckboxChange = event => {
    const { name, checked } = event.target;
    let updatedHobbies;

    if (checked) {
      updatedHobbies = [...formData.hobbies, name];
    } else {
      updatedHobbies = formData.hobbies.filter(hobby => hobby !== name);
    }

    console.log("Updated Hobbies:", updatedHobbies);

    setFormData({
      ...formData,
      hobbies: updatedHobbies
    });

    // Update error message for hobbies
    setErrorMessages(prevErrorMessages => ({
      ...prevErrorMessages,
      hobbies: updatedHobbies.length > 0 ? undefined : errors.hobbies
    }));
  };

  const renderErrorMessage = name => {
    return !isSubmitted && errorMessages[name] && (
      <div key={name} className="error">
        {errorMessages[name]}
      </div>
    );
  };

  const renderForm = (
    <div className="login-form">
      <div className="title">Connexion</div>
      <div className="form">
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <label>L'identifiant </label>
            <input type="text" name="uname" value={formData.uname} onChange={handleChange} required />
            {renderErrorMessage("uname")}
          </div>
          <div className="input-container">
            <label>Mot de passe </label>
            <input type="password" name="upass" value={formData.upass} onChange={handleChange} required />
            {renderErrorMessage("upass")}
          </div>
          <div className="input-container">
            <label>Ville </label>
            <select name="city" value={formData.city} onChange={handleChange} required>
              <option value="">Sélectionner une ville</option>
              <option value="Casablanca">Casablanca</option>
              <option value="Rabat">Rabat</option>
              <option value="Marrakech">Marrakech</option>
              <option value="Oujda">Oujda</option>
              <option value="Agadir">Agadir</option>
              <option value="Tanger">Tanger</option>
              <option value="Fès">Fès</option>
            </select>
            {renderErrorMessage("city")}
          </div>
          <div className="input-container">
            <label>Genre </label>
            <div>
              <input type="radio" name="gender" value="Homme" onChange={handleChange} required /> Homme
              <input type="radio" name="gender" value="Femme" onChange={handleChange} required /> Femme
            </div>
            {renderErrorMessage("gender")}
          </div>
          <div className="input-container">
            <label>Loisirs </label>
            <div>
              <input type="checkbox" name="Sport" onChange={handleCheckboxChange} /> Sport
              <input type="checkbox" name="Lecture" onChange={handleCheckboxChange} /> Lecture
              <input type="checkbox" name="Musique" onChange={handleCheckboxChange} /> Musique
            </div>
            {errorMessages.hobbies && (
              <div key="hobbies" className="error">
                {errorMessages.hobbies}
              </div>
            )}
          </div>
          <div className="button-container">
            <input type="submit" value="Se connecter" />
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="app">
      {isSubmitted ? (
        <div>
          <div className="title">Accueil</div>
          <div>Bonjour</div>
        </div>
      ) : (
        renderForm
      )}
    </div>
  );
};

export default App;
