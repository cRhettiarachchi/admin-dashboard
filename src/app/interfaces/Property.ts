export interface Property {
  id: string | undefined;
  property_type: string;
  property_name: string;
  no_of_rooms: number;
  address_line_1: string;
  address_line_2: string;
  town: string;
  region: string;
  country: string;
  post_code: string;
  notes: string;
}
