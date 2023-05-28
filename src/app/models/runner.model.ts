export interface Runner {
    runnerNumber?: number;
    name: string;
    email: string;
    partnerID?: number;
    catValue: string;
    runnerAge: string;
    dni: string;
    runnerBirthDate: string;
    runnerGenre?: string;
    status?: string;
    status_detail?: string;
    tshirtSize: string;
    createdAt?: Date;
    updatedAt?: Date;
  }