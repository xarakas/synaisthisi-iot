import { Topic } from '../../shared/topic.model';
import * as fromTopicActions from './topic.actions';

export interface State {
    topics: Topic[];
    editedTopic: Topic;
    editedTopicIndex: number;
}

const initialState: State = {
    topics: [],
    editedTopic: null,
    editedTopicIndex: -1
};

// CHECK EVERYTHING BEFORE REALLY USE IT
export function topicReducer (state = initialState,
                              action: fromTopicActions.TopicActions): State {
    switch (action.type) {
        case fromTopicActions.SET_TOPICS:
            return {
                ...state,
                topics: [...action.payload]
            };
        case fromTopicActions.SET_DETAILED_TOPIC:
            return {
                ...state,
                editedTopic: action.payload,
                editedTopicIndex: action.payload.id
            };
        case fromTopicActions.STOP_EDIT:
            return {
                ...state,
                editedTopic: null,
                editedTopicIndex: -1
            };
        case fromTopicActions.STOP_ADD_TOPIC:
            return {
                ...state,
                topics: [...state.topics, action.payload],
                editedTopic: action.payload
            };
        case fromTopicActions.STOP_REQUEST_TOPIC:
            const updated_topic = {
                ...state.editedTopic,
                can_sub: true
            };
            return {
                ...state,
                editedTopic: updated_topic
            };
            case fromTopicActions.CLEAR_TOPICS_STATE:
            {
                return {
                    ...state,
                    topics: [],
                    editedTopic: null,
                    editedTopicIndex: -1
                }
            }
            // const old_topic = state.topics.find(r_topic => r_topic.id === action.payload.id);
            // const updated_topic = {
            //     ...old_topic,
            //     ...action.payload
            // };
            // const all_topics = [...state.topics];
            // const index = all_topics.indexOf(old_topic);
            // if (index !== -1) {
            //     all_topics[index] = updated_topic;
            // }
            // return {
            //     ...state,
            //     topics: all_topics
            // };
        // case fromTopicActions.ADD_TOPICS:
        //     return {
        //         ...state,
        //         topics: [...state.topics, ...action.payload]
        //     };
        default:
            return state;
    }
}


