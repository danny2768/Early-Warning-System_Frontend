export interface CreateSubscription {
  userId:         string;
  stationIds:     string[];
  contactMethods: ContactMethods;
}

export interface ContactMethods {
  email:    boolean;
  whatsapp: boolean;
}
