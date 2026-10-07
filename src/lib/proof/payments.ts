/**
 * Payments boundary. The app currently only REPRESENTS money at stake —
 * no funds are held or moved. A compliant provider (e.g. Stripe) would
 * implement this interface server-side; UI code must only call these.
 */
export interface StakeProvider {
  authorize(input: { commitmentId: string; amount: number; currency: string }): Promise<{ ref: string; simulated: boolean }>;
  release(ref: string): Promise<{ simulated: boolean }>;
  forfeit(ref: string, destination: string): Promise<{ simulated: boolean }>;
}

export const simulatedStakes: StakeProvider = {
  async authorize({ commitmentId }) {
    return { ref: `sim_${commitmentId}`, simulated: true };
  },
  async release() {
    return { simulated: true };
  },
  async forfeit() {
    return { simulated: true };
  },
};
