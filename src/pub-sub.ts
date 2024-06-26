export interface Subscriber {
  update: (publisher: Publisher) => void;
}

export interface IPublisher {
  subscribers: Subscriber[];
  subscribe: (subscriber: Subscriber) => void;
  unSubscribe: (subscriber: Subscriber) => void;
  updateSubscriber: () => void;
}

export class Publisher implements Publisher {
  public subscribers: Subscriber[] = [];
  subscribe(subscriber: Subscriber) {
    if (!this.subscribers.includes(subscriber)) {
      this.subscribers.push(subscriber);
    }
  }

  unSubscribe(subscriber: Subscriber) {
    this.subscribers = this.subscribers.filter((sub) => sub !== subscriber);
  }

  updateSubscriber() {
    this.subscribers.forEach((sub) => sub.update(this));
  }
}
