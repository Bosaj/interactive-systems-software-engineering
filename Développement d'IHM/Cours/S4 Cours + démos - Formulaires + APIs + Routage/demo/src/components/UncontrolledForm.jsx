function UncontrolledForm() {
  const handleSubmit = e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>First Name:</label>
      <input type="text" name="firstName" />

      <label>Last Name:</label>
      <input type="text" name="lastName" />

      <label>Email:</label>
      <input type="email" name="email" />

      <button type="submit">Submit</button>
    </form>
  );
}

export default UncontrolledForm;