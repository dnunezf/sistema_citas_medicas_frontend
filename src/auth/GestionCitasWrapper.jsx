/*NOTA: ESTE WRAPPER SE ENCARGA DE EXTRAER EL idMedico DESDE LA URL, USANDO
* useParams, Y LO PASE A GestionCitas*/

import { useParams } from 'react-router-dom';
import GestionCitas from '../components/GestionCitas';

const GestionCitasWrapper = () => {
    const { id } = useParams();
    return <GestionCitas idMedico={id} />;
};

export default GestionCitasWrapper;
