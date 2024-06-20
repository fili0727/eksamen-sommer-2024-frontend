import { useEffect, useState } from "react"
import { hentResultater } from "../../services/apiFacade"
import {Resultat} from "../../interfaces/resultat"

export default function ResultaterList() {
  const [resultater, setResultater] = useState<Resultat[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResultater();
  }, [])

  const loadResultater = async () => {
    try{
      const hentedeResultater = await hentResultater();
      setResultater(hentedeResultater);
      setLoading(false);
    } catch (error) {
      setError("Der skete en fejl");
      console.error(error);
    }
  }
    if (loading) return <p>Loading participants...</p>;
  console.log(error)

    return (
        <div>
            <h1>ResultaterList</h1>
            <table>
                <thead>
                    <tr>
                        <th>Disciplin</th>
                        <th>???</th>
                        <th>???</th>
                        <th>Deltager</th>
                    </tr>
                </thead>
                <tbody>
                    {resultater.map((resultat: Resultat) => {
                        return (
                            <tr key={resultat.id}>
                                <td>{resultat.disciplin.disciplinNavn}</td>
                                <td>{resultat.point}</td>
                                <td>{resultat.resultatEnum}</td>
                                <td>{resultat.deltager.navn}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}