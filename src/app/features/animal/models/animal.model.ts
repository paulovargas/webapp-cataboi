import { Herd } from "../../herd/models/herd.model";
import { Property } from "../../property/models/property.model";

export interface Animal {
  idanimal: number;
  rebanho: Herd;
  propriedade: Property;
  especie: string;
  numeroBrincos: number;
  dataNascimento: string;
  status: string;
  raca: string;
  pelagem: string;
  sexo: string;
  prenhez: string;
  peso: 0;
  foto: null;
  descricao: string;
}
