export class Topic {
    public id: number;
    public can_sub: boolean;
    public can_pub: boolean;

    constructor(public name: string, public description: string) {}

}

//  Check if this should just be an interface and not a class, and change if yes
export class DetailedTopicModel extends Topic {
    public can_sub: boolean;
    public can_pub: boolean;
}

export enum TopicSearchType {
    allTopics,
    userSubPermittedTopics
}
