export class InvalidLineupError extends Error {
    constructor(lineup: number[]) {
        super();
        this.message = this.constructMessage(lineup);
    }

    private constructMessage(lineup: number[]): string {
        return `[${lineup}] is an invalid lineup`
    }
}