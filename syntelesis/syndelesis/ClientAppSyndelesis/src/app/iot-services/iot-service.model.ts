import { Topic } from '../shared/topic.model';

export class IoTService {
  public id: number;
  public owner: string;
  // detailed description fields
  public input_topics: Topic[];
  public output_topics: Topic[];
  public subscriber: boolean;
  // service management fields
  public service_file_is_uploaded: boolean;
  public service_is_running: boolean;

  public constructor(
    public name: string,
    public description: string,
    public service_type: string,
    public location: string
  ) {}
}

