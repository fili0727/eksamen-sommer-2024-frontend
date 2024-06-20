import { Køn } from "./køn";
import { Klub } from "./klub";
import Disciplin from "./disciplin";

export default interface Deltager {
   id?: number;
    navn: string;
    køn: Køn;
    alder: number;
    klub: Klub;
    discipliner: Disciplin[];

}
