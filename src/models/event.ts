export class Event {
  id: number;
  maaltijd_id: number;
  titel: string;
  naam: string;
  soort: string;
  datum: string;
  tijd: string;
  locatie: string;
  samenvatting: string;
  omschrijving: string;
  beschrijving: string;
  gesloten: string;
  prijs: string;
  begin_moment: string;
  eind_moment: string;
  aanmelden_vanaf: string;
  aanmelden_tot: string;
  afmelden_tot: string;
  _meta: {
    start: any;
    end: any;
    formattedListDate: string;
    category: string;
    present?: boolean;
  };
}
