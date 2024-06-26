export type ModelStatusType = "pending" | "available" | "failure";

export class ModelStatus {
  status: ModelStatusType = "pending";

  setModelStatus(status: ModelStatusType) {
    this.status = status;
  }

  getModelStatus() {
    return this.status;
  }
}
