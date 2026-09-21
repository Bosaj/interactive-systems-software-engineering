import Navbar from '../components/Navbar'
import ControlledForm from '../components/ControlledForm'
import UncontrolledForm from '../components/UncontrolledForm'
import MixedForm from '../components/MixedForm'
import FormErrorHandling from '../components/FormErrorHandling'

const Forms = () => {
return (
    <div>
        <Navbar />
        <h1>Forms</h1>
        <section>
            <h2>Controlled Form</h2>
            <ControlledForm />
        </section>
        <section>
            <h2>Uncontrolled Form</h2>
            <UncontrolledForm />
        </section>
        <section>
            <h2>Mixed Form</h2>
            <MixedForm />
        </section>
        <section>
            <h2>Form with error handling</h2>
            <FormErrorHandling />
        </section>
    </div>
)
}

export default Forms