import { PubSub } from 'apollo-server';

const pubsub = new PubSub()

const subtopic = {
    'new_bet': 'new_bet'
}

export {
    pubsub,
    subtopic
}