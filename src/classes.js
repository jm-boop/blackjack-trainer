'use strict';

import { fisherYatesShuffle } from './utils.js';

const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export class CardDeck {
    constructor() {
        this.deck = [RANKS, RANKS, RANKS, RANKS];
        this.deck = this.deck.flat();

        this.availableCards = this.deck; 
    }

    shuffleDeck() {
        fisherYatesShuffle(this.deck);
    }
}

export class Player {
    constructor() { }

    getInitialCards(arr) {
        this.hand = [arr.pop(), arr.pop()];
    }
}

export class Dealer extends Player {
    constructor() {
        super()
    }
}

export class Apprentice extends Player {
    constructor() {
        super()
    }
}
