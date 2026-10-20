export function isPaymentsEnabled(env: { PAYMENTS_ENABLED: string }): boolean {
  return env.PAYMENTS_ENABLED === "true";
}

function notActivated(): never {
  throw new Error("Payments not activated");
}

export function createPaymentIntent(..._args: unknown[]): never {
  notActivated();
}

export function verifyPayment(..._args: unknown[]): never {
  notActivated();
}

export function getPaymentStatus(..._args: unknown[]): never {
  notActivated();
}
