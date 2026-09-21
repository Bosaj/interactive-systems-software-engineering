import Navbar from '../components/Navbar'
import { useParams } from 'react-router-dom'

const RouteParam = () => {
    const routeParams = useParams();
    return (
        <div>
            <Navbar />
            <h1>Route param: {routeParams['id']}</h1>
        </div>
    )
}

export default RouteParam