import Delta from "quill-delta";

class OTServer {
  private document: Delta;
  private deltas: Delta[];

  constructor(document?: any, deltas: Delta[] = []) {
    this.document = new Delta(document);
    this.deltas = deltas;
  }

  receiveDelta(version: number, delta: any): Delta {
    if (version < 0 || this.deltas.length < version) {
      throw new Error("given delta version not in history");
    }

    const concurrentDeltas = this.deltas.slice(version);
    let cumulativeDelta = new Delta(delta);
    console.log(cumulativeDelta);

    for (const currentDelta of concurrentDeltas) {
      cumulativeDelta = new Delta(currentDelta).transform(cumulativeDelta, true);
    }

    this.document = this.document.compose(cumulativeDelta);
    this.deltas.push(cumulativeDelta);

    return cumulativeDelta;
  }
}

export const otServer = new OTServer();
