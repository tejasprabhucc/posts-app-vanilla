import { Publisher } from "./pub-sub";

export type ModelStatusType = "pending" | "available" | "failure";

export class ModelStatus {
  status: ModelStatusType = "pending";
  private publisher: Publisher;

  constructor(publisher: Publisher) {
    this.publisher = publisher;
  }
  setModelStatus(status: ModelStatusType) {
    this.status = status;
    this.publisher.updateSubscriber();
  }

  getModelStatus() {
    return this.status;
  }
}
