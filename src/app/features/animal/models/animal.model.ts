export interface Animal {
  id: string;
  name: string;
  breed: string;
  sex: 'Macho' | 'Fêmea';
  birthDate: Date;
  weight: number;
}
