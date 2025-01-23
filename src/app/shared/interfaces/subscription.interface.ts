export interface StationSubscription {
  id: string;
  userId: string;
  stationIds: string[];
  contactMethods: ContactMethods;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ContactMethods {
  email: boolean,
  whatsapp: boolean,
}
