import { useState } from "react";

function FormErrorHandling() {
    const [errors, setErrors] = useState({});
    const [password, setPassword] = useState('');

    const handlePasswordChange = (e) => {
      var regExp = /^(?=.*[a-zA-Z](?=.*\d)(?=.*[@$!])).{8,}$/;
                  
      if(! regExp.test(e.target.value)){
        let validationErrors = {};
        validationErrors.password = "Password incorrect!";
        setErrors(validationErrors);
      } else {
        setErrors({}); 
      }
    }
  
    const handleSubmit = (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
  
      let validationErrors = {};
  
      const email = formData.get("email");
      if (email && !email.endsWith("@gmail.com")) {
        validationErrors.email = "Email must be from the domain gmail.com.";
      }
  
      if (formData.get("phoneNumber").length !== 10) {
        validationErrors.phoneNumber = "Phone number must be 10 digits.";
      }
  
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
      } else {
        console.log(Array.from(formData.entries()));
        setErrors({}); 
      }
    };
  
    return (
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" name="name" required />
        {errors.name && <div className="error">{errors.name}</div>}
  
        <label>Email:</label>
        <input type="email" name="email" required />
        {errors.email && <div className="error">{errors.email}</div>}
  
        <label>Phone Number (10 digits):</label>
        <input type="tel" name="phoneNumber" required />
        {errors.phoneNumber && <div className="error">{errors.phoneNumber}</div>}

        <label>Password:</label>
        <input type="text" name="password" onChange={(e) => handlePasswordChange(e)} required />
        {errors.password && <div className="error">{errors.password}</div>}
  
        <button type="submit">Submit</button>
      </form>
    );
  }
  
  export default FormErrorHandling;