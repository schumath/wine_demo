export interface IQuery {
  $or: {
    name?: { $regex: string; $options: string };
    year?: number;
    country?: { $regex: string; $options: string };
    type?: { $regex: string; $options: string };
  }[];
}
