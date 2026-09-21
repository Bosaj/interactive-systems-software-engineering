import { useState } from "react";

function MixedForm() {
    const [phoneNumber, setPhoneNumber] = useState("");

    const handlePhoneNumberChange = (event) => {
        const formattedNumber = event.target.value.replace(/\D/g, "").slice(0, 10); 
        setPhoneNumber(formattedNumber);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" name="name" />

        <label>Email:</label>
        <input type="email" name="email" />

        <label>Phone Number:</label>
        <input type="tel" name="phoneNumber" value={phoneNumber} onChange={handlePhoneNumberChange} />

        <button type="submit">Submit</button>
        </form>
    );
}

export default MixedForm;