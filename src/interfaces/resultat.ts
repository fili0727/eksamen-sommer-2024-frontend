import Deltager from "./deltager";
import Disciplin from "./disciplin";
import { ResultatEnum } from "./resultatEnum";

export interface Resultat {
  id?: number;
  deltager: Deltager;
  disciplin: Disciplin;
  resultatEnum: ResultatEnum;
  dato: Date;
  distance?: number;
  tidSekunder?: number;
  højde?: number;
  point?: number;
}