import { useEffect, useState } from "react"
import { hentResultater } from "../../services/apiFacade"
import {Resultat} from "../../interfaces/resultat"
import "../../styling/resultaterliste.css"

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
    <div className="resultater-container">
        <h1 className="resultater-heading">Resultater</h1>
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
                {resultater.map((resultat: Resultat) => {
                    return (
                        <tr key={resultat.id} className="resultater-tr">
                            <td className="resultater-td">{resultat.disciplin.disciplinNavn}</td>
                            <td className="resultater-td">{resultat.point}{resultat.distance}{resultat.højde}{resultat.tidSekunder}</td>
                            <td className="resultater-td">{resultat.resultatEnum}</td>
                            <td className="resultater-td">{resultat.deltager.navn}</td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    </div>
)


}