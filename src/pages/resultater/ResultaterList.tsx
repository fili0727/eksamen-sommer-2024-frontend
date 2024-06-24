import { useEffect, useState } from "react"
import { hentResultater, hentDeltagere, hentDiscipliner } from "../../services/apiFacade"
import {Resultat} from "../../interfaces/resultat"
import Deltager from "../../interfaces/deltager"
import Disciplin from "../../interfaces/disciplin"
import {ResultatEnum} from "../../interfaces/resultatEnum"
import ResultaterFormDialog from "./ResultaterFormDialog"
import "../../styling/resultaterliste.css"


//STORTSET DET HELE HER ER CHATGTP (klokken er 23:30 og jeg har kvalme🤠)
export default function ResultaterList() {
 const [resultater, setResultater] = useState<Resultat[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [deltagere, setDeltagere] = useState<Deltager[]>([]);
  const [discipliner, setDiscipliner] = useState<Disciplin[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState<{
    deltagerId?: number;
    disciplinId?: number;
    resultatEnum: ResultatEnum;
    dato: string;
    distance?: number;
    tidSekunder?: number;
    højde?: number;
    point?: number;
  }>({
    resultatEnum: ResultatEnum.DISTANCE,
    dato: '',
  });

  useEffect(() => {
    loadResultater();
    fetchDeltagere();
    fetchDiscipliner();
  }, []);

  const loadResultater = async () => {
    try {
      const hentedeResultater = await hentResultater();
      setResultater(hentedeResultater);
      setLoading(false);
    } catch (error) {
      setError('Der skete en fejl');
      console.error(error);
    }
  };

  const fetchDeltagere = async () => {
    try {
      const data = await hentDeltagere();
      setDeltagere(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDiscipliner = async () => {
    try {
      const data = await hentDiscipliner();
      setDiscipliner(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    const selectedOption = JSON.parse(value);
    setFormData({
      ...formData,
      [name]: selectedOption.id,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('http://localhost:8080/api/resultater', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      alert('Resultat created successfully!');
      setShowDialog(false);
      loadResultater(); // Reload the results after creating a new one
    } else {
      alert('Failed to create resultat.');
    }
  };
 

  console.log(error);
  
  if (loading) return <p>Loading participants...</p>;

  return (
    <div className="resultater-container">
      <h1 className="resultater-heading">Resultater</h1>
       <button className="button" onClick={() => setShowDialog(true)}>Add Resultat</button>

       {showDialog && (
        <ResultaterFormDialog
          deltagere={deltagere}
          discipliner={discipliner}
          handleChange={handleChange}
          handleSelectChange={handleSelectChange}
          handleSubmit={handleSubmit}
          onClose={() => setShowDialog(false)}
        />
      )}


      {/* <form onSubmit={handleSubmit} className="resultater-form">
        <div>
          <label>Deltager</label>
          <select required name="deltagerId" onChange={handleSelectChange}>
            <option value="">Select a Deltager</option>
            {deltagere.map((deltager) => (
              <option key={deltager.id} value={JSON.stringify(deltager)}>
                {deltager.navn}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Disciplin</label>
          <select required name="disciplinId" onChange={handleSelectChange}>
            <option value="">Select a Disciplin</option>
            {discipliner.map((disciplin) => (
              <option key={disciplin.id} value={JSON.stringify(disciplin)}>
                {disciplin.disciplinNavn}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Resultat Enum</label>
          <select required name="resultatEnum" onChange={handleChange}>
            {Object.keys(ResultatEnum).map((key) => (
              <option key={key} value={ResultatEnum[key as keyof typeof ResultatEnum]}>
                {ResultatEnum[key as keyof typeof ResultatEnum]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Dato</label>
          <input required type="date" name="dato" onChange={handleChange} />
        </div>
        <div>
          <label>Distance</label>
          <input type="number" name="distance" onChange={handleChange} />
        </div>
        <div>
          <label>Tid i Sekunder</label>
          <input type="number" name="tidSekunder" onChange={handleChange} />
        </div>
        <div>
          <label>Højde</label>
          <input type="number" name="højde" onChange={handleChange} />
        </div>
        <div>
          <label>Point</label>
          <input type="number" name="point" onChange={handleChange} />
        </div>
        <button type="submit">Create Resultat</button>
      </form> */}

      <table className="resultater-table">
        <thead className="resultater-thead">
          <tr className="resultater-tr">
            <th className="resultater-th">Disciplin</th>
            <th className="resultater-th">Resultat</th>
            <th className="resultater-th">Resultat type</th>
            <th className="resultater-th">Deltager</th>
          </tr>
        </thead>
        <tbody>
          {resultater.map((resultat: Resultat) => (
            <tr key={resultat.id} className="resultater-tr">
              <td className="resultater-td">{resultat.disciplin.disciplinNavn}</td>
             <td className="resultater-td">
                {resultat.point}✨ 
                {resultat.distance}✨
                {resultat.højde}✨
                {resultat.tidSekunder} 
              </td>
              <td className="resultater-td">{resultat.resultatEnum}</td>
              <td className="resultater-td">{resultat.deltager.navn}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}