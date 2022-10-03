export class TimeoutError extends Error {
  constructor(message?: string) {
    super(message ? message : "Time out");
  }
}
export class UnsupportedProtocolError extends Error {
  constructor(protocol: string) {
    super("Unsupported protocol: " + protocol);
  }
}

export class InvalidAddressOrEnsError extends Error {
  constructor() {
    super("Invalid address or ENS");
  }
}
export class InvalidAddressError extends Error {
  constructor() {
    super("Invalid address");
  }
}
export class InvalidProposalIdError extends Error {
  constructor() {
    super("Invalid proposal ID");
  }
}
export class InvalidProposalIdVoteError extends Error {
  constructor() {
    super("Invalid proposal vote status");
  }
}
export class InvalidProposalIdInsufficientVotesError extends Error {
  constructor() {
    super("Insufficient votes");
  }
}
export class InvalidProposalIdCancelError extends Error {
  constructor() {
    super("The current state cannot be cancelled");
  }
}
export class NoProviderError extends Error {
  constructor() {
    super("A web3 provider is needed");
  }
}
export class NoSignerError extends Error {
  constructor() {
    super("A signer is needed");
  }
}
export class UnexpectedActionError extends Error {
  constructor() {
    super("The received action is different from the expected one");
  }
}