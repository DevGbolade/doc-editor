/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Delta from "quill-delta";

// Define the interface for client state
interface ClientState {
  applyFromClient(client: OTClient, delta: Delta): ClientState;
  applyFromServer(client: OTClient, delta: Delta): ClientState;
  serverAck(client: OTClient): ClientState;
  transformSelection(selection: any): any;
  resend?(client: OTClient): void;
}

// Initial state class
class Synchronized implements ClientState {
  applyFromClient(client: OTClient, delta: Delta): ClientState {
    client.sendDelta(client.version, delta);
    return new AwaitingConfirm(delta);
  }

  applyFromServer(client: OTClient, delta: Delta): ClientState {
    client.applyDelta(delta);
    return this;
  }

  serverAck(_client: OTClient): ClientState {
    throw new Error("There is no pending delta.");
  }

  transformSelection(selection: any): any {
    return selection;
  }
}

// State class for when there is an outstanding delta
class AwaitingConfirm implements ClientState {
  outstanding: Delta;

  constructor(outstanding: Delta) {
    this.outstanding = outstanding;
  }

  applyFromClient(_client: OTClient, delta: Delta): ClientState {
    return new AwaitingWithBuffer(this.outstanding, delta);
  }

  applyFromServer(client: OTClient, delta: Delta): ClientState {
    const newOutstanding = this.outstanding.transform(delta, false) as Delta;
    client.applyDelta(newOutstanding);
    return new AwaitingConfirm(newOutstanding);
  }

  serverAck(_client: OTClient): ClientState {
    return synchronizedState;
  }

  transformSelection(selection: any): any {
    return selection.transform(this.outstanding);
  }

  resend(client: OTClient): void {
    client.sendDelta(client.version, this.outstanding);
  }
}

// State class for when there is an outstanding delta and a buffer
class AwaitingWithBuffer implements ClientState {
  outstanding: Delta;
  buffer: Delta;

  constructor(outstanding: Delta, buffer: Delta) {
    this.outstanding = outstanding;
    this.buffer = buffer;
  }

  applyFromClient(_client: OTClient, delta: Delta): ClientState {
    const newBuffer = this.buffer.compose(delta) as Delta;
    return new AwaitingWithBuffer(this.outstanding, newBuffer);
  }

  applyFromServer(client: OTClient, delta: Delta): ClientState {
    const newOutstanding = this.outstanding.transform(delta, false) as Delta;
    const newBuffer = this.buffer.transform(delta, false) as Delta;
    const toApply = newOutstanding.transform(delta, false) as Delta;
    client.applyDelta(toApply);
    return new AwaitingWithBuffer(newOutstanding, newBuffer);
  }

  serverAck(client: OTClient): ClientState {
    client.sendDelta(client.version, this.buffer);
    return new AwaitingConfirm(this.buffer);
  }

  transformSelection(selection: any): any {
    return selection.transform(this.outstanding).transform(this.buffer);
  }

  resend(client: OTClient): void {
    client.sendDelta(client.version, this.outstanding);
  }
}

// OTClient class
class OTClient {
  version: number;
  state: ClientState;

  constructor(version = 0) {
    this.version = version;
    this.state = synchronizedState;
  }

  setState(state: ClientState): void {
    this.state = state;
  }

  applyFromClient(delta: Delta): void {
    this.setState(this.state.applyFromClient(this, delta));
  }

  applyFromServer(delta: Delta): void {
    this.version++;
    this.setState(this.state.applyFromServer(this, delta));
  }

  serverAck(): void {
    this.version++;
    this.setState(this.state.serverAck(this));
  }

  serverReconnect(): void {
    if (typeof this.state.resend === "function") {
      this.state.resend(this);
    }
  }

  transformSelection(selection: any): any {
    return this.state.transformSelection(selection);
  }

  sendDelta(_version: number, _delta: Delta): void {
    throw new Error("sendDelta must be defined in a subclass");
  }

  applyDelta(_delta: Delta): void {
    throw new Error("applyDelta must be defined in a subclass");
  }
}

const synchronizedState = new Synchronized();
export default OTClient;
